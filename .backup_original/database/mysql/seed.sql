-- ========================================================
-- BizPermit MySQL Demonstration Seed Data
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE audit_logs;
TRUNCATE TABLE notifications;
TRUNCATE TABLE issued_licenses;
TRUNCATE TABLE inspections;
TRUNCATE TABLE application_payments;
TRUNCATE TABLE application_status_history;
TRUNCATE TABLE application_assignments;
TRUNCATE TABLE applications;
TRUNCATE TABLE license_requirements;
TRUNCATE TABLE license_type_categories;
TRUNCATE TABLE license_types;
TRUNCATE TABLE staff_departments;
TRUNCATE TABLE departments;
TRUNCATE TABLE businesses;
TRUNCATE TABLE business_categories;
TRUNCATE TABLE user_roles;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users (Hashed with bcrypt: 10 rounds)
-- Passwords:
-- owner@bizpermit.demo     => Owner@1234
-- officer@bizpermit.demo   => Officer@1234
-- inspector@bizpermit.demo => Inspector@1234
-- admin@bizpermit.demo     => Admin@1234

INSERT INTO users (id, full_name, email, phone, password_hash, is_active, created_at) VALUES
(1, 'Marcus Vance', 'owner@bizpermit.demo', '+1 (555) 234-5678', '$2a$10$zdkdRc4p3BD4nCbSYqjokOHBKMoluWlMQ36hRjdUW6XIoB8BEXDHO', TRUE, NOW()),
(2, 'Sarah Jenkins', 'officer@bizpermit.demo', '+1 (555) 345-6789', '$2a$10$Oz02bHVYK4xvy18nNTDvgOoPGvu.thD0IFxBl9nHlK3kqcxMWXW0K', TRUE, NOW()),
(3, 'David Thorne', 'inspector@bizpermit.demo', '+1 (555) 456-7890', '$2a$10$XHrCM4clgWigd180Aa/3texxNa607k7jg.p5KdaYeKA81QeBszh.q', TRUE, NOW()),
(4, 'Eleanor Vance', 'admin@bizpermit.demo', '+1 (555) 567-8901', '$2a$10$ExiIe6xrZqp2b5XYkNSxW.Z09Z5tAddIXWsEP978NZf.hI4eIumuq', TRUE, NOW());

-- 2. User Roles
INSERT INTO user_roles (user_id, role) VALUES
(1, 'BUSINESS_OWNER'),
(2, 'OFFICER'),
(3, 'INSPECTOR'),
(4, 'ADMIN'),
(4, 'OFFICER');

-- 3. Business Categories
INSERT INTO business_categories (id, code, name, description, icon, is_active) VALUES
(1, 'RETAIL', 'Retail Outlets & Commercial Trade', 'Brick-and-mortar storefronts, supermarkets, specialty boutiques, and merchandise trade.', 'storefront', TRUE),
(2, 'FOOD_HOSPITALITY', 'Food Establishments & Hospitality', 'Cafes, bakeries, full-service dining, commercial kitchens, catering, and lodging.', 'restaurant', TRUE),
(3, 'MANUFACTURING', 'Manufacturing & Light Industrial', 'Processing factories, assembly plants, packaging units, and industrial workshops.', 'precision_manufacturing', TRUE),
(4, 'HEALTHCARE', 'Health & Clinical Services', 'Pharmacies, medical diagnostic clinics, dental facilities, and wellness centers.', 'health_and_safety', TRUE),
(5, 'LOGISTICS', 'Logistics, Warehousing & Fleet', 'Commercial freight yards, storage warehouses, cold chains, and delivery fleets.', 'local_shipping', TRUE),
(6, 'PROFESSIONAL', 'Professional & Consulting Services', 'Legal practices, architectural consultancies, IT agencies, and corporate offices.', 'business_center', TRUE);

-- 4. Departments
INSERT INTO departments (id, code, name, contact_email, contact_phone, office_location, is_active) VALUES
(1, 'DCR', 'Dept. of Commercial Regulations & Consumer Affairs', 'dcr@municipal.gov.demo', '+1 (555) 100-2001', 'Civic Center Wing B, Suite 200', TRUE),
(2, 'DPH', 'Dept. of Public Health & Food Sanitation', 'dph@municipal.gov.demo', '+1 (555) 100-2002', 'Health Services Complex, Floor 3', TRUE),
(3, 'FSB', 'Municipal Fire & Life Safety Bureau', 'fireprevention@municipal.gov.demo', '+1 (555) 100-2003', 'Emergency Services HQ, Station 1', TRUE),
(4, 'BMZ', 'Building & Municipal Zoning Bureau', 'zoning@municipal.gov.demo', '+1 (555) 100-2004', 'City Hall, Annex 4', TRUE),
(5, 'EPW', 'Environmental Protection & Waste Governance', 'epw@municipal.gov.demo', '+1 (555) 100-2005', 'Civic Ecological Complex, Building C', TRUE);

-- 5. Staff Departments
INSERT INTO staff_departments (user_id, department_id, designation, is_head) VALUES
(2, 1, 'Senior Licensing Officer', TRUE),
(2, 2, 'Adjudication Reviewer', FALSE),
(3, 3, 'Senior Field Inspector', TRUE),
(3, 2, 'Sanitary Examiner', FALSE),
(4, 1, 'Chief Registrar', TRUE);

-- 6. License Types
INSERT INTO license_types (id, code, name, department_id, fee, validity_months, processing_sla_days, requires_inspection, description, eligibility_criteria, is_active) VALUES
(1, 'LIC-TRD-001', 'General Commercial Trade License', 1, 250.00, 12, 5, FALSE, 'Mandatory baseline municipal trade credential authorizing lawful commercial operation within the municipal boundaries.', 'Commercial lease or ownership title, verified business registration, tax compliance declaration.', TRUE),
(2, 'LIC-FOD-002', 'Commercial Food Service & Sanitation Permit', 2, 450.00, 12, 10, TRUE, 'Health authority certification ensuring food safety standards, hygienic preparation facilities, and kitchen plumbing conformity.', 'Commercial kitchen layout plan, certified food handler certificates, grease trap verification.', TRUE),
(3, 'LIC-FIR-003', 'Municipal Fire Safety & Occupancy Certificate', 3, 350.00, 12, 7, TRUE, 'Statutory fire prevention certificate validating emergency egress, fire suppression equipment, and structural occupancy limits.', 'Architectural floor plan with emergency exits, extinguisher maintenance certificates, smoke alarm test log.', TRUE),
(4, 'LIC-IND-004', 'Light Industrial & Manufacturing Operating Permit', 4, 800.00, 24, 14, TRUE, 'Zoning and structural authorization for industrial machinery, production operations, and assembly floor installations.', 'Zoning clearance certificate, noise impact mitigation plan, machinery layout, electrical safety audit.', TRUE),
(5, 'LIC-MED-005', 'Clinical Pharmacy & Medical Facility License', 2, 600.00, 12, 10, TRUE, 'Supervised regulatory permit for dispensing pharmaceuticals, outpatient clinic operation, and sterile equipment storage.', 'Registered pharmacist credential, clinical waste disposal protocol, cold storage equipment calibration.', TRUE),
(6, 'LIC-ENV-006', 'Hazardous Materials & Environmental Clearance', 5, 500.00, 12, 14, TRUE, 'Environmental oversight clearance ensuring responsible handling of commercial chemical effluent, emission limits, and recycling.', 'Chemical inventory manifest, spill response contingency protocol, certified hazardous waste haulage contract.', TRUE),
(7, 'LIC-LOG-007', 'Commercial Freight & Fleet Operating Permit', 1, 400.00, 12, 5, FALSE, 'Municipal logistics authorization permitting commercial vehicles, depot staging, and cross-district parcel freight dispatch.', 'Vehicle registration schedules, depot off-street parking validation, commercial driver operator records.', TRUE);

-- 7. License Type Categories (M:N)
INSERT INTO license_type_categories (license_type_id, category_id) VALUES
(1, 1), -- Trade License -> Retail
(1, 2), -- Trade License -> Food
(1, 3), -- Trade License -> Manufacturing
(1, 4), -- Trade License -> Healthcare
(1, 5), -- Trade License -> Logistics
(1, 6), -- Trade License -> Professional
(2, 2), -- Food Permit -> Food
(3, 1), -- Fire Safety -> Retail
(3, 2), -- Fire Safety -> Food
(3, 3), -- Fire Safety -> Manufacturing
(3, 4), -- Fire Safety -> Healthcare
(4, 3), -- Industrial Permit -> Manufacturing
(5, 4), -- Medical Permit -> Healthcare
(6, 3), -- Environmental Clearance -> Manufacturing
(6, 4), -- Environmental Clearance -> Healthcare
(7, 5); -- Freight Permit -> Logistics

-- 8. License Requirements
INSERT INTO license_requirements (id, license_type_id, requirement_code, title, description, document_type, is_mandatory, allowed_extensions) VALUES
-- Requirements for General Trade License (1)
(1, 1, 'REQ-LEASE', 'Premises Lease Agreement or Title Deed', 'Proof of legal occupancy for the commercial registered address.', 'LEASE_AGREEMENT', TRUE, 'pdf,jpg,jpeg,png'),
(2, 1, 'REQ-ID', 'Government-Issued Owner Identification', 'Official national photo ID or passport of the primary applicant.', 'ID_PROOF', TRUE, 'pdf,jpg,jpeg,png'),
(3, 1, 'REQ-TAX-CLEAR', 'Municipal Property Tax Clearance', 'Certificate confirming zero municipal tax arrears on the premises.', 'TAX_CLEARANCE', FALSE, 'pdf'),

-- Requirements for Food Sanitation Permit (2)
(4, 2, 'REQ-KITCHEN-PLAN', 'Commercial Kitchen & Sanitary Blueprint', 'Detailed plan of food preparation, refrigeration, dishwashing, and ventilation areas.', 'KITCHEN_PLAN', TRUE, 'pdf,jpg,jpeg,png'),
(5, 2, 'REQ-FOOD-CERT', 'Certified Food Handler Certifications', 'Staff credentials issued by recognized municipal sanitary institutes.', 'FOOD_HANDLER_CERT', TRUE, 'pdf'),
(6, 2, 'REQ-WATER-TEST', 'Potable Water Quality Test Report', 'Laboratory water potability assay performed within the last 90 days.', 'WATER_REPORT', TRUE, 'pdf'),

-- Requirements for Fire Safety Certificate (3)
(7, 3, 'REQ-FLOOR-PLAN', 'Architectural Egress & Floor Plan', 'Scaled floor plan indicating exit routes, fire doors, and extinguisher stations.', 'FLOOR_PLAN', TRUE, 'pdf,jpg,png'),
(8, 3, 'REQ-EXTINGUISHER', 'Extinguisher Inspection Certificate', 'Service inspection certificate for all portable fire suppression cylinders.', 'EXTINGUISHER_CERT', TRUE, 'pdf'),

-- Requirements for Light Industrial Permit (4)
(9, 4, 'REQ-MACHINERY-SPEC', 'Machinery Layout & Power Specifications', 'Engineering specs of heavy equipment and electrical power demand.', 'MACHINERY_SPEC', TRUE, 'pdf'),
(10, 4, 'REQ-NOISE-AUDIT', 'Acoustic & Noise Impact Study', 'Environmental noise dissipation report confirming industrial boundary limits.', 'NOISE_AUDIT', TRUE, 'pdf'),

-- Requirements for Medical / Pharmacy License (5)
(11, 5, 'REQ-PHARM-DEGREE', 'Head Pharmacist License & Degree', 'State board practicing credential of the registered clinical supervisor.', 'PHARMACIST_LICENSE', TRUE, 'pdf'),
(12, 5, 'REQ-BIO-DISPOSAL', 'Biohazard Waste Collection Contract', 'Contract with authorized medical waste disposal entity.', 'BIO_CONTRACT', TRUE, 'pdf'),

-- Requirements for Environmental Clearance (6)
(13, 6, 'REQ-HAZ-MANIFEST', 'Hazardous Chemical Inventory Manifest', 'List of stored chemical precursors and safety data sheets (MSDS).', 'CHEMICAL_MANIFEST', TRUE, 'pdf'),

-- Requirements for Freight & Fleet (7)
(14, 7, 'REQ-FLEET-LIST', 'Fleet Vehicle Registrations & Insurance', 'Copies of commercial vehicle registrations and comprehensive insurance.', 'FLEET_SCHEDULE', TRUE, 'pdf');

-- 9. Businesses (Owned by Marcus Vance, user_id = 1)
INSERT INTO businesses (id, owner_id, category_id, business_name, registration_number, address_line1, address_line2, city, state, postal_code, contact_email, contact_phone, description) VALUES
(1, 1, 2, 'Hearthstone Coffee Roasters', 'REG-2025-9941', '404 Grand Avenue', 'Suite 101', 'Civic Metro', 'Metropolitan State', '10001', 'info@hearthstoneroasters.demo', '+1 (555) 789-0123', 'Artisanal coffee roastery, espresso cafe, and wholesale bean dispatch.'),
(2, 1, 1, 'Apex Modern Goods', 'REG-2025-3312', '128 High Street', 'Shop 4', 'Civic Metro', 'Metropolitan State', '10002', 'contact@apexmoderngoods.demo', '+1 (555) 789-0124', 'Designer home furnishing, lifestyle accessories, and curated consumer retail.'),
(3, 1, 4, 'Horizon Biotech Lab & Clinic', 'REG-2025-7788', '89 Innovation Boulevard', 'Floor 2', 'Civic Metro', 'Metropolitan State', '10003', 'operations@horizonbiotech.demo', '+1 (555) 789-0125', 'Clinical diagnostic lab and outpatient wellness screening facility.');

-- 10. Applications
INSERT INTO applications (id, application_number, business_id, license_type_id, owner_id, application_type, parent_license_id, status, submission_date, reviewed_by, reviewed_at, decision_remarks, created_at) VALUES
(1, 'APP-2026-0001', 1, 1, 1, 'NEW', NULL, 'APPROVED', DATE_SUB(NOW(), INTERVAL 20 DAY), 2, DATE_SUB(NOW(), INTERVAL 18 DAY), 'All statutory documentation verified. Premises compliant with commercial regulations.', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(2, 'APP-2026-0002', 1, 2, 1, 'NEW', NULL, 'UNDER_REVIEW', DATE_SUB(NOW(), INTERVAL 5 DAY), 2, NULL, NULL, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(3, 'APP-2026-0003', 1, 3, 1, 'NEW', NULL, 'INSPECTION_REQUIRED', DATE_SUB(NOW(), INTERVAL 10 DAY), 2, DATE_SUB(NOW(), INTERVAL 8 DAY), 'Documentation verified. Physical on-site fire safety inspection mandated prior to final approval.', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(4, 'APP-2026-0004', 2, 1, 1, 'NEW', NULL, 'CORRECTION_REQUIRED', DATE_SUB(NOW(), INTERVAL 4 DAY), 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Uploaded Lease Agreement is missing the landlord signature page. Please upload the complete executed document.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(5, 'APP-2026-0005', 3, 5, 1, 'NEW', NULL, 'SUBMITTED', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, NULL, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 11. Application Assignments
INSERT INTO application_assignments (id, application_id, assigned_to, assigned_by, role_type, assigned_at, notes) VALUES
(1, 1, 2, 4, 'OFFICER', DATE_SUB(NOW(), INTERVAL 20 DAY), 'Assigned for trade statutory check.'),
(2, 2, 2, 4, 'OFFICER', DATE_SUB(NOW(), INTERVAL 5 DAY), 'Food sanitation review underway.'),
(3, 3, 3, 2, 'INSPECTOR', DATE_SUB(NOW(), INTERVAL 7 DAY), 'Dispatched for physical premises egress and extinguisher audit.'),
(4, 4, 2, 4, 'OFFICER', DATE_SUB(NOW(), INTERVAL 4 DAY), 'Requested missing signature page.');

-- 12. Application Status History
INSERT INTO application_status_history (application_id, from_status, to_status, changed_by, remarks, created_at) VALUES
(1, 'DRAFT', 'SUBMITTED', 1, 'Application submitted with supporting documents.', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(1, 'SUBMITTED', 'UNDER_REVIEW', 2, 'Officer assigned and intake verification started.', DATE_SUB(NOW(), INTERVAL 19 DAY)),
(1, 'UNDER_REVIEW', 'APPROVED', 2, 'Approved. All requirements fulfilled.', DATE_SUB(NOW(), INTERVAL 18 DAY)),

(2, 'DRAFT', 'SUBMITTED', 1, 'Application submitted.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 'SUBMITTED', 'UNDER_REVIEW', 2, 'Reviewing kitchen sanitary specifications.', DATE_SUB(NOW(), INTERVAL 4 DAY)),

(3, 'DRAFT', 'SUBMITTED', 1, 'Application submitted.', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 'SUBMITTED', 'UNDER_REVIEW', 2, 'Reviewing floor egress diagrams.', DATE_SUB(NOW(), INTERVAL 9 DAY)),
(3, 'UNDER_REVIEW', 'INSPECTION_REQUIRED', 2, 'Dispatched to Municipal Fire Bureau for on-site audit.', DATE_SUB(NOW(), INTERVAL 8 DAY)),

(4, 'DRAFT', 'SUBMITTED', 1, 'Application submitted.', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 'SUBMITTED', 'CORRECTION_REQUIRED', 2, 'Incomplete lease document detected.', DATE_SUB(NOW(), INTERVAL 2 DAY)),

(5, 'DRAFT', 'SUBMITTED', 1, 'Application submitted and fees processed.', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 13. Application Payments (Simulated)
INSERT INTO application_payments (id, application_id, amount, transaction_reference, payment_method, payment_status, paid_at) VALUES
(1, 1, 250.00, 'TXN-MUNI-2026-9001', 'SIMULATED_TREASURY_TRANSFER', 'SUCCESSFUL', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(2, 2, 450.00, 'TXN-MUNI-2026-9002', 'SIMULATED_TREASURY_TRANSFER', 'SUCCESSFUL', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 3, 350.00, 'TXN-MUNI-2026-9003', 'SIMULATED_TREASURY_TRANSFER', 'SUCCESSFUL', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(4, 4, 250.00, 'TXN-MUNI-2026-9004', 'SIMULATED_TREASURY_TRANSFER', 'SUCCESSFUL', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(5, 5, 600.00, 'TXN-MUNI-2026-9005', 'SIMULATED_TREASURY_TRANSFER', 'SUCCESSFUL', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 14. Inspections
INSERT INTO inspections (id, application_id, inspector_id, scheduled_date, completed_date, outcome, summary_notes, created_at) VALUES
(1, 3, 3, DATE_ADD(NOW(), INTERVAL 2 DAY), NULL, 'PENDING', 'Scheduled on-site examination of fire suppression gear and exit sign illumination.', DATE_SUB(NOW(), INTERVAL 7 DAY));

-- 15. Issued Licenses (Approved application #1)
INSERT INTO issued_licenses (id, license_number, application_id, business_id, license_type_id, owner_id, issue_date, expiry_date, status, qr_verification_code, created_at) VALUES
(1, 'LIC-2026-8841', 1, 1, 1, 1, DATE_SUB(CURDATE(), INTERVAL 18 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 18 DAY), INTERVAL 12 MONTH), 'ACTIVE', 'QR-VERIFY-8841-2026-MUNI', DATE_SUB(NOW(), INTERVAL 18 DAY));

-- 16. Notifications
INSERT INTO notifications (user_id, title, message, notification_type, link_url, is_read, created_at) VALUES
(1, 'License Issued: LIC-2026-8841', 'Congratulations! Your General Commercial Trade License has been issued. You can now download your digital certificate.', 'SUCCESS', '/owner/license-certificate.html?id=1', FALSE, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(1, 'Fire Safety Inspection Scheduled', 'An on-site inspection for Application APP-2026-0003 has been scheduled with Inspector David Thorne.', 'INFO', '/owner/application-details.html?id=3', FALSE, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(1, 'Action Required: Document Correction', 'Application APP-2026-0004 requires correction: Upload complete executed lease with landlord signature page.', 'WARNING', '/owner/application-details.html?id=4', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 'New Application Intake: APP-2026-0005', 'A new Clinical Pharmacy & Medical Facility License filing has been received for review.', 'INFO', '/staff/review.html?id=5', FALSE, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 17. Audit Logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES
(1, 'CREATE_BUSINESS', 'BUSINESS', '1', '{"name": "Hearthstone Coffee Roasters", "category": "FOOD_HOSPITALITY"}', '127.0.0.1', DATE_SUB(NOW(), INTERVAL 26 DAY)),
(1, 'SUBMIT_APPLICATION', 'APPLICATION', '1', '{"applicationNumber": "APP-2026-0001", "fee": 250.00}', '127.0.0.1', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(2, 'APPROVE_APPLICATION', 'APPLICATION', '1', '{"decision": "APPROVED", "remarks": "Compliant"}', '127.0.0.1', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(2, 'ISSUE_LICENSE', 'ISSUED_LICENSE', '1', '{"licenseNumber": "LIC-2026-8841"}', '127.0.0.1', DATE_SUB(NOW(), INTERVAL 18 DAY));
