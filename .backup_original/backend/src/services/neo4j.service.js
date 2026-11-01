const { runQuery, getDriver } = require('../config/neo4j');

class Neo4jService {
  /**
   * Find applicable licenses and dependencies for a business category
   */
  async findLicensesByCategory(categoryCode) {
    try {
      const cypher = `
        MATCH (c:BusinessCategory {code: $categoryCode})-[:MAY_REQUIRE]->(l:LicenseType)
        OPTIONAL MATCH (l)-[:HANDLED_BY]->(d:Department)
        OPTIONAL MATCH (l)-[depRel:DEPENDS_ON]->(dep:LicenseType)
        OPTIONAL MATCH (l)-[:NEEDS_DOCUMENT]->(doc:DocumentType)
        RETURN l, d, 
               collect(DISTINCT {
                 id: dep.id,
                 code: dep.code, 
                 name: dep.name, 
                 reason: depRel.reason
               }) AS dependencies,
               collect(DISTINCT {
                 code: doc.code, 
                 name: doc.name
               }) AS requiredDocuments
        ORDER BY l.id ASC
      `;
      const records = await runQuery(cypher, { categoryCode });
      return records.map(record => {
        const l = record.get('l').properties;
        const d = record.get('d') ? record.get('d').properties : null;
        const dependencies = record.get('dependencies').filter(dep => dep.code !== null);
        const requiredDocuments = record.get('requiredDocuments').filter(doc => doc.code !== null);
        return {
          license: l,
          department: d,
          dependencies,
          requiredDocuments
        };
      });
    } catch (err) {
      console.warn('[Neo4j Warning in findLicensesByCategory]:', err.message);
      const mysql = require('../config/mysql');
      const rows = await mysql.query(`
        SELECT lt.id, lt.code, lt.name, lt.fee, lt.validity_months AS validityMonths,
               lt.requires_inspection AS requiresInspection, d.id AS deptId, d.name AS deptName
        FROM license_types lt
        JOIN license_type_categories ltc ON lt.id = ltc.license_type_id
        JOIN business_categories bc ON ltc.category_id = bc.id
        LEFT JOIN departments d ON lt.department_id = d.id
        WHERE bc.code = ?
      `, [categoryCode]);
      return rows.map(r => ({
        license: {
          id: r.id,
          code: r.code,
          name: r.name,
          fee: parseFloat(r.fee),
          validityMonths: r.validityMonths,
          requiresInspection: !!r.requiresInspection
        },
        department: r.deptId ? { id: r.deptId, name: r.deptName } : null,
        dependencies: [],
        requiredDocuments: []
      }));
    }
  }

  /**
   * Find single license type graph dependencies and requirements
   */
  async getLicenseRelationships(licenseCode) {
    try {
      const cypher = `
        MATCH (l:LicenseType {code: $licenseCode})
        OPTIONAL MATCH (l)-[:HANDLED_BY]->(d:Department)
        OPTIONAL MATCH (l)-[depRel:DEPENDS_ON]->(dep:LicenseType)
        OPTIONAL MATCH (l)-[:NEEDS_DOCUMENT]->(doc:DocumentType)
        OPTIONAL MATCH (l)-[:HAS_REQUIREMENT]->(req:Requirement)
        OPTIONAL MATCH (cat:BusinessCategory)-[:MAY_REQUIRE]->(l)
        RETURN l, d,
               collect(DISTINCT { id: dep.id, code: dep.code, name: dep.name, reason: depRel.reason }) AS prerequisites,
               collect(DISTINCT { code: doc.code, name: doc.name }) AS documents,
               collect(DISTINCT { code: req.code, title: req.title, isMandatory: req.isMandatory }) AS requirements,
               collect(DISTINCT { id: cat.id, code: cat.code, name: cat.name }) AS applicableCategories
      `;
      const records = await runQuery(cypher, { licenseCode });
      if (records.length === 0) return null;
      const rec = records[0];
      return {
        license: rec.get('l').properties,
        department: rec.get('d') ? rec.get('d').properties : null,
        prerequisites: rec.get('prerequisites').filter(p => p.code !== null),
        documents: rec.get('documents').filter(d => d.code !== null),
        requirements: rec.get('requirements').filter(r => r.code !== null),
        applicableCategories: rec.get('applicableCategories').filter(c => c.code !== null)
      };
    } catch (err) {
      console.warn('[Neo4j Warning in getLicenseRelationships]:', err.message);
      const mysql = require('../config/mysql');
      const rows = await mysql.query(`
        SELECT lt.*, d.name AS department_name
        FROM license_types lt
        LEFT JOIN departments d ON lt.department_id = d.id
        WHERE lt.code = ?
      `, [licenseCode]);
      if (!rows.length) return null;
      const l = rows[0];
      return {
        license: {
          id: l.id,
          code: l.code,
          name: l.name,
          fee: parseFloat(l.fee),
          validityMonths: l.validity_months,
          requiresInspection: !!l.requires_inspection
        },
        department: l.department_id ? { id: l.department_id, name: l.department_name } : null,
        prerequisites: [],
        documents: [],
        requirements: [],
        applicableCategories: []
      };
    }
  }

  /**
   * Return full graph visualization tailored for Cytoscape.js
   */
  async getFullGraph(categoryFilter = null) {
    try {
      let cypher = `
        MATCH (n)
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN n, r, m
      `;
      if (categoryFilter) {
        cypher = `
          MATCH (c:BusinessCategory {code: $categoryFilter})
          MATCH path = (c)-[*1..2]-(m)
          UNWIND nodes(path) AS n
          UNWIND relationships(path) AS r
          RETURN DISTINCT n, r, endNode(r) AS m
        `;
      }

      const records = await runQuery(cypher, { categoryFilter });
      const nodesMap = new Map();
      const edgesList = [];

      records.forEach(record => {
        const n = record.get('n');
        if (n && !nodesMap.has(n.elementId || n.identity.toString())) {
          const id = n.elementId || n.identity.toString();
          const label = n.labels[0];
          nodesMap.set(id, {
            data: {
              id,
              label: n.properties.name || n.properties.title || n.properties.code || id,
              category: label,
              code: n.properties.code || '',
              ...n.properties
            }
          });
        }

        const r = record.get('r');
        const m = record.get('m');
        if (m && !nodesMap.has(m.elementId || m.identity.toString())) {
          const id = m.elementId || m.identity.toString();
          const label = m.labels[0];
          nodesMap.set(id, {
            data: {
              id,
              label: m.properties.name || m.properties.title || m.properties.code || id,
              category: label,
              code: m.properties.code || '',
              ...m.properties
            }
          });
        }

        if (r && n && m) {
          const edgeId = r.elementId || r.identity.toString();
          edgesList.push({
            data: {
              id: edgeId,
              source: n.elementId || n.identity.toString(),
              target: m.elementId || m.identity.toString(),
              label: r.type,
              type: r.type,
              ...r.properties
            }
          });
        }
      });

      return {
        elements: {
          nodes: Array.from(nodesMap.values()),
          edges: edgesList
        }
      };
    } catch (err) {
      console.warn('[Neo4j Warning in getFullGraph]:', err.message);
      return {
        elements: {
          nodes: [],
          edges: []
        }
      };
    }
  }

  /**
   * Synchronize LicenseType master data modifications to Neo4j
   */
  async syncLicenseType(licenseData) {
    try {
      const cypher = `
        MERGE (l:LicenseType {code: $code})
        SET l.id = $id,
            l.name = $name,
            l.fee = $fee,
            l.validityMonths = $validityMonths,
            l.requiresInspection = $requiresInspection
        WITH l
        MATCH (d:Department {id: $departmentId})
        MERGE (l)-[:HANDLED_BY]->(d)
        RETURN l
      `;
      return await runQuery(cypher, {
        code: licenseData.code,
        id: licenseData.id,
        name: licenseData.name,
        fee: parseFloat(licenseData.fee || 0),
        validityMonths: parseInt(licenseData.validity_months || 12, 10),
        requiresInspection: Boolean(licenseData.requires_inspection),
        departmentId: licenseData.department_id
      });
    } catch (err) {
      console.warn('[Neo4j Sync Warning in syncLicenseType]:', err.message);
      return null;
    }
  }

  /**
   * Synchronize BusinessCategory master data to Neo4j
   */
  async syncBusinessCategory(categoryData) {
    try {
      const cypher = `
        MERGE (c:BusinessCategory {code: $code})
        SET c.id = $id,
            c.name = $name
        RETURN c
      `;
      return await runQuery(cypher, {
        code: categoryData.code,
        id: categoryData.id,
        name: categoryData.name
      });
    } catch (err) {
      console.warn('[Neo4j Sync Warning in syncBusinessCategory]:', err.message);
      return null;
    }
  }

  /**
   * Synchronize Department master data to Neo4j
   */
  async syncDepartment(deptData) {
    try {
      const cypher = `
        MERGE (d:Department {code: $code})
        SET d.id = $id,
            d.name = $name
        RETURN d
      `;
      return await runQuery(cypher, {
        code: deptData.code,
        id: deptData.id,
        name: deptData.name
      });
    } catch (err) {
      console.warn('[Neo4j Sync Warning in syncDepartment]:', err.message);
      return null;
    }
  }
}

module.exports = new Neo4jService();
