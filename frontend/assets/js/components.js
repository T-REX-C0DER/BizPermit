/**
 * BizPermit Shared Component Renderers & UI Utilities
 */

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size: 20px;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatStatusBadge(status) {
  const map = {
    DRAFT: { label: 'Draft', class: 'badge-draft' },
    SUBMITTED: { label: 'Submitted', class: 'badge-submitted' },
    UNDER_REVIEW: { label: 'Under Review', class: 'badge-review' },
    CORRECTION_REQUIRED: { label: 'Action Required', class: 'badge-correction' },
    INSPECTION_REQUIRED: { label: 'Inspection Required', class: 'badge-review' },
    APPROVED: { label: 'Approved', class: 'badge-approved' },
    REJECTED: { label: 'Rejected', class: 'badge-rejected' },
    WITHDRAWN: { label: 'Withdrawn', class: 'badge-draft' },
    ACTIVE: { label: 'Active', class: 'badge-active' },
    EXPIRED: { label: 'Expired', class: 'badge-rejected' },
    PASSED: { label: 'Passed', class: 'badge-passed' },
    FAILED: { label: 'Failed', class: 'badge-failed' },
    PENDING: { label: 'Pending', class: 'badge-draft' },
    REQUIRES_FOLLOWUP: { label: 'Requires Followup', class: 'badge-correction' },
    VERIFIED: { label: 'Verified', class: 'badge-approved' }
  };
  const item = map[status] || { label: status, class: 'badge-draft' };
  return `<span class="badge ${item.class}">${item.label}</span>`;
}

// Render Public Header
function renderPublicHeader(activeLink = 'home') {
  const header = document.getElementById('public-header');
  if (!header) return;

  const user = API.getUser();
  const token = API.getToken();

  let authButtons = `
    <a href="/login.html" class="btn btn-secondary btn-sm">Sign In</a>
    <a href="/register.html" class="btn btn-primary btn-sm">Get Started</a>
  `;

  if (token && user) {
    const dashboardLink = Auth.getDefaultRedirect(user.roles);
    authButtons = `
      <a href="${dashboardLink}" class="btn btn-primary btn-sm" style="display:flex;align-items:center;gap:6px;">
        <span class="material-symbols-outlined" style="font-size:16px;">dashboard</span>
        <span>Dashboard</span>
      </a>
      <button onclick="Auth.logout()" class="btn btn-secondary btn-sm" title="Sign Out">
        <span class="material-symbols-outlined" style="font-size:16px;">logout</span>
      </button>
    `;
  }

  header.innerHTML = `
    <div class="container">
      <a href="/" class="brand-logo">
        <div class="brand-icon">
          <span class="material-symbols-outlined" style="font-size: 22px;">account_balance</span>
        </div>
        <div class="brand-text">
          <span class="brand-name">BizPermit</span>
          <span class="brand-sub">Municipal Licensure</span>
        </div>
      </a>
      <nav class="public-nav">
        <a href="/" class="${activeLink === 'home' ? 'active' : ''}">Home</a>
        <a href="/licenses.html" class="${activeLink === 'licenses' ? 'active' : ''}">Explore Licenses</a>
        <a href="/how-it-works.html" class="${activeLink === 'how-it-works' ? 'active' : ''}">How It Works</a>
        <a href="/standards.html" class="${activeLink === 'standards' ? 'active' : ''}">Municipal Standards</a>
        <a href="/help.html" class="${activeLink === 'help' ? 'active' : ''}">Help &amp; FAQs</a>
      </nav>
      <div class="header-actions">
        ${authButtons}
        <button class="mobile-menu-btn" onclick="toggleMobileNav()">
          <span class="material-symbols-outlined">menu</span>
        </button>
      </div>
    </div>
  `;
}

function toggleMobileNav() {
  const nav = document.querySelector('.public-nav');
  if (nav) {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '80px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = '#ffffff';
    nav.style.padding = '1.5rem 2rem';
    nav.style.borderBottom = '1px solid #e8e8ec';
    nav.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
  }
}

// Render Public Footer
function renderPublicFooter() {
  const footer = document.getElementById('public-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <div class="brand-logo" style="margin-bottom: 1.25rem;">
            <div class="brand-icon">
              <span class="material-symbols-outlined" style="font-size: 22px;">account_balance</span>
            </div>
            <div class="brand-text">
              <span class="brand-name">BizPermit</span>
              <span class="brand-sub">Municipal Licensure</span>
            </div>
          </div>
          <p style="font-size: 0.85rem; max-width: 320px; margin-bottom: 1.25rem;">
            Smart business license management system integrating 4 distinct database architectures: MySQL, MongoDB, Neo4j, and Redis.
          </p>
          <div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;background:#f4f4f5;font-size:0.75rem;font-weight:600;color:#52525b;">
            <span class="material-symbols-outlined" style="font-size:14px;color:#16834a;">check_circle</span>
            <span>Multi-Database DBMS Verified</span>
          </div>
        </div>

        <div class="footer-column">
          <h4>Portal Framework</h4>
          <ul>
            <li><a href="/licenses.html">License Catalog</a></li>
            <li><a href="/how-it-works.html">Application Workflow</a></li>
            <li><a href="/standards.html">Statutory Standards</a></li>
            <li><a href="/help.html">Document Checklists</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Workspaces</h4>
          <ul>
            <li><a href="/owner/dashboard.html">Business Owner Portal</a></li>
            <li><a href="/staff/dashboard.html">Licensing Officer Desk</a></li>
            <li><a href="/staff/inspections.html">Inspector Field Audit</a></li>
            <li><a href="/admin/dashboard.html">Municipal Administration</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h4>Governance</h4>
          <ul>
            <li><a href="/standards.html">Municipal Code Revision: 2026.2</a></li>
            <li><a href="/help.html#faq">Licensing FAQs</a></li>
            <li><a href="/help.html#support">Contact Municipal Clerk</a></li>
            <li><a href="/admin/license-graph.html">Neo4j Dependency Graph</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 BizPermit Civic Architecture. Academic DBMS Implementation with 4 Database Engines (MySQL, MongoDB, Neo4j, Redis).</p>
        <div style="display:flex;gap:1.5rem;font-weight:600;font-size:0.75rem;">
          <span>MySQL 8+</span>
          <span>MongoDB 7.0+</span>
          <span>Neo4j 5.20+</span>
          <span>Redis / Memurai</span>
        </div>
      </div>
    </div>
  `;
}

// Render Dashboard Sidebar
function renderSidebar(activeItem = 'dashboard', workspace = 'owner') {
  const sidebar = document.getElementById('dashboard-sidebar');
  if (!sidebar) return;

  const user = API.getUser() || { full_name: 'Authorized User', email: 'user@bizpermit.demo', roles: [] };

  let navItems = [];

  if (workspace === 'owner') {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/owner/dashboard.html' },
      { id: 'businesses', label: 'My Businesses', icon: 'storefront', href: '/owner/businesses.html' },
      { id: 'find-license', label: 'Find Licenses (Neo4j)', icon: 'hub', href: '/owner/find-license.html' },
      { id: 'applications', label: 'My Applications', icon: 'assignment', href: '/owner/applications.html' },
      { id: 'documents', label: 'Documents Vault', icon: 'folder_open', href: '/owner/documents.html' },
      { id: 'payments', label: 'Payments & Receipts', icon: 'receipt_long', href: '/owner/payments.html' },
      { id: 'licenses', label: 'My Licenses', icon: 'verified', href: '/owner/licenses.html' },
      { id: 'notifications', label: 'Notifications', icon: 'notifications', href: '/owner/notifications.html' },
      { id: 'profile', label: 'Profile & Settings', icon: 'manage_accounts', href: '/owner/profile.html' }
    ];
  } else if (workspace === 'staff') {
    navItems = [
      { id: 'dashboard', label: 'Staff Dashboard', icon: 'dashboard', href: '/staff/dashboard.html' },
      { id: 'assigned', label: 'Assigned Applications', icon: 'inbox', href: '/staff/assigned.html' },
      { id: 'inspections', label: 'Field Inspections', icon: 'fact_check', href: '/staff/inspections.html' },
      { id: 'history', label: 'Decision History', icon: 'history', href: '/staff/history.html' }
    ];
  } else if (workspace === 'admin') {
    navItems = [
      { id: 'dashboard', label: 'Overview', icon: 'dashboard', href: '/admin/dashboard.html' },
      { id: 'users', label: 'User Directory', icon: 'group', href: '/admin/users.html' },
      { id: 'departments', label: 'Departments', icon: 'domain', href: '/admin/departments.html' },
      { id: 'staff', label: 'Staff Roster', icon: 'badge', href: '/admin/staff.html' },
      { id: 'license-types', label: 'License Types', icon: 'format_list_bulleted', href: '/admin/license-types.html' },
      { id: 'requirements', label: 'Document Rules', icon: 'rule', href: '/admin/requirements.html' },
      { id: 'license-graph', label: 'Neo4j Graph Explorer', icon: 'account_tree', href: '/admin/license-graph.html' },
      { id: 'applications', label: 'All Applications', icon: 'folder_shared', href: '/admin/applications.html' },
      { id: 'inspections', label: 'All Inspections', icon: 'fact_check', href: '/admin/inspections.html' },
      { id: 'reports', label: 'Reports & Analytics', icon: 'analytics', href: '/admin/reports.html' },
      { id: 'audit-logs', label: 'Audit Trail', icon: 'security', href: '/admin/audit-logs.html' }
    ];
  }

  const navHtml = navItems.map(item => `
    <a href="${item.href}" class="sidebar-link ${activeItem === item.id ? 'active' : ''}">
      <span class="material-symbols-outlined">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join('');

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <a href="/" class="brand-logo">
        <div class="brand-icon" style="width:32px;height:32px;border-radius:8px;">
          <span class="material-symbols-outlined" style="font-size: 18px;">account_balance</span>
        </div>
        <div class="brand-text">
          <span class="brand-name" style="font-size:1rem;">BizPermit</span>
          <span class="brand-sub">${workspace.toUpperCase()} PORTAL</span>
        </div>
      </a>
    </div>

    <div class="sidebar-nav">
      <span class="sidebar-label">Navigation</span>
      ${navHtml}

      <span class="sidebar-label" style="margin-top:1.5rem;">Switch Workspace</span>
      <a href="/owner/dashboard.html" class="sidebar-link" style="font-size:0.8rem;">
        <span class="material-symbols-outlined" style="font-size:18px;">person</span>
        <span>Owner Workspace</span>
      </a>
      <a href="/staff/dashboard.html" class="sidebar-link" style="font-size:0.8rem;">
        <span class="material-symbols-outlined" style="font-size:18px;">supervisor_account</span>
        <span>Staff Workspace</span>
      </a>
      <a href="/admin/dashboard.html" class="sidebar-link" style="font-size:0.8rem;">
        <span class="material-symbols-outlined" style="font-size:18px;">admin_panel_settings</span>
        <span>Admin Workspace</span>
      </a>
    </div>

    <div class="sidebar-footer">
      <div style="display:flex;align-items:center;gap:10px;overflow:hidden;">
        <div style="width:34px;height:34px;border-radius:50%;background:#09090b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;flex-shrink:0;">
          ${(user.full_name || 'U').charAt(0)}
        </div>
        <div style="overflow:hidden;line-height:1.2;">
          <div style="font-weight:700;font-size:0.8rem;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">${user.full_name || 'User'}</div>
          <div style="font-size:0.7rem;color:#71717a;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">${user.email || ''}</div>
        </div>
      </div>
      <button onclick="Auth.logout()" title="Sign Out" style="background:none;border:none;cursor:pointer;color:#71717a;" onmouseover="this.style.color='#000'" onmouseout="this.style.color='#71717a'">
        <span class="material-symbols-outlined" style="font-size:20px;">logout</span>
      </button>
    </div>
  `;
}

// Render Topbar on Dashboard Pages
function renderTopbar(pageTitle = 'Dashboard') {
  const topbar = document.getElementById('dashboard-topbar');
  if (!topbar) return;

  const user = API.getUser() || { full_name: 'User' };

  topbar.innerHTML = `
    <div class="topbar-left">
      <button class="mobile-menu-btn" style="display:block;margin-right:0.5rem;" onclick="document.querySelector('.dashboard-sidebar').classList.toggle('open')">
        <span class="material-symbols-outlined">menu</span>
      </button>
      <h2 style="font-size:1.35rem;font-weight:800;letter-spacing:-0.02em;">${pageTitle}</h2>
    </div>
    <div class="topbar-right">
      <a href="/owner/notifications.html" style="position:relative;display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#f4f4f5;color:#18181b;" title="Notifications">
        <span class="material-symbols-outlined" style="font-size:20px;">notifications</span>
      </a>
      <a href="/licenses.html" class="btn btn-secondary btn-sm" target="_blank" style="display:flex;align-items:center;gap:4px;">
        <span class="material-symbols-outlined" style="font-size:16px;">open_in_new</span>
        <span>Public Catalog</span>
      </a>
    </div>
  `;
}
