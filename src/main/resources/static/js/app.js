/**
 * StockSmart - Main Enterprise Frontend Application Logic
 * Full CRUD, Real-Time Chart Analytics, Dynamic Foreign Key Resolution & UI Management
 */

// Central State Dictionaries
const state = {
    products: [],
    categories: [],
    suppliers: [],
    locations: [],
    inventory: [],
    purchaseOrders: [],
    salesOrders: [],
    stockTransfers: [],
    stockAlerts: [],
    users: [],
    activeTab: 'dashboard',
    charts: {}
};

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
    initApp();
});

// App Initialization
async function initApp() {
    setupNavigation();
    setupThemeToggle();
    setupSearch();
    await fetchAllData();
    routeFromUrl();
}

// Global Fetch All Data from Backend APIs
async function fetchAllData() {
    try {
        const [
            productsRes,
            categoriesRes,
            suppliersRes,
            locationsRes,
            inventoryRes,
            purchaseRes,
            salesRes,
            transfersRes,
            alertsRes,
            usersRes
        ] = await Promise.all([
            fetch('/products').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/categories').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/suppliers').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/locations').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/inventory').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/purchase-orders').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/sales-orders').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/stock-transfers').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/stock-alerts').then(r => r.ok ? r.json() : []).catch(() => []),
            fetch('/users').then(r => r.ok ? r.json() : []).catch(() => [])
        ]);

        state.products = productsRes || [];
        state.categories = categoriesRes || [];
        state.suppliers = suppliersRes || [];
        state.locations = locationsRes || [];
        state.inventory = inventoryRes || [];
        state.purchaseOrders = purchaseRes || [];
        state.salesOrders = salesRes || [];
        state.stockTransfers = transfersRes || [];
        state.stockAlerts = alertsRes || [];
        state.users = usersRes || [];

        updateBadgeCounts();
        renderCurrentView();
    } catch (err) {
        console.error("Error fetching application data:", err);
        showToast("Error loading data from backend APIs", "error");
    }
}

// Helper Name Resolvers for Foreign Keys
function getProductName(id) {
    const item = state.products.find(p => p.id == id);
    return item ? `${item.name} (${item.symbol || 'N/A'})` : `Product #${id}`;
}

function getSupplierName(id) {
    const item = state.suppliers.find(s => s.id == id);
    return item ? item.name : `Supplier #${id}`;
}

function getLocationName(id) {
    const item = state.locations.find(l => l.id == id);
    return item ? `${item.name} (${item.city || ''})` : `Location #${id}`;
}

function getUserName(id) {
    const item = state.users.find(u => u.id == id);
    return item ? item.name : `User #${id}`;
}

// Update Nav Badges & Counts
function updateBadgeCounts() {
    document.getElementById('productCount').innerText = state.products.length;
    document.getElementById('inventoryCount').innerText = state.inventory.length;
    document.getElementById('purchaseCount').innerText = state.purchaseOrders.length;
    document.getElementById('salesCount').innerText = state.salesOrders.length;
    document.getElementById('alertCount').innerText = state.stockAlerts.length;
    
    const alertNavBadge = document.getElementById('alertNavBadge');
    if (alertNavBadge) {
        alertNavBadge.innerText = state.stockAlerts.length;
        alertNavBadge.style.display = state.stockAlerts.length > 0 ? 'inline-block' : 'none';
    }
}

// Navigation Setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    window.addEventListener('popstate', () => routeFromUrl());
}

function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.getAttribute('data-tab') === tabName) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update URL without page reload
    const pageUrl = tabName === 'dashboard' ? '/' : `/${tabName}-page`;
    window.history.pushState({ tab: tabName }, '', pageUrl);

    renderCurrentView();
}

function routeFromUrl() {
    const path = window.location.pathname.replace('/', '').replace('-page', '');
    const tabName = path || 'dashboard';
    switchTab(tabName);
}

// Theme Toggle
function setupThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        btn.querySelector('i').className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        
        // Re-render charts if on dashboard
        if (state.activeTab === 'dashboard') {
            renderDashboardCharts();
        }
    });
}

// Global Live Search
function setupSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterCurrentView(query);
    });
}

function filterCurrentView(query) {
    if (!query) {
        renderCurrentView();
        return;
    }
    
    if (state.activeTab === 'products') {
        const filtered = state.products.filter(p => 
            p.name.toLowerCase().includes(query) || (p.symbol && p.symbol.toLowerCase().includes(query))
        );
        renderProductsTable(filtered);
    } else if (state.activeTab === 'suppliers') {
        const filtered = state.suppliers.filter(s => 
            s.name.toLowerCase().includes(query) || (s.email && s.email.toLowerCase().includes(query))
        );
        renderSuppliersTable(filtered);
    }
}

// Dynamic View Switcher
function renderCurrentView() {
    const views = ['dashboard', 'products', 'categories', 'suppliers', 'locations', 'inventory', 'purchase-orders', 'sales-orders', 'stock-transfers', 'stock-alerts', 'users'];
    
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) {
            if (v === state.activeTab) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });

    switch (state.activeTab) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'products':
            renderProductsTable(state.products);
            break;
        case 'categories':
            renderCategoriesTable(state.categories);
            break;
        case 'suppliers':
            renderSuppliersTable(state.suppliers);
            break;
        case 'locations':
            renderLocationsTable(state.locations);
            break;
        case 'inventory':
            renderInventoryTable(state.inventory);
            break;
        case 'purchase-orders':
            renderPurchaseOrdersTable(state.purchaseOrders);
            break;
        case 'sales-orders':
            renderSalesOrdersTable(state.salesOrders);
            break;
        case 'stock-transfers':
            renderStockTransfersTable(state.stockTransfers);
            break;
        case 'stock-alerts':
            renderStockAlertsTable(state.stockAlerts);
            break;
        case 'users':
            renderUsersTable(state.users);
            break;
    }
}

// ==========================================================================
// VIEW RENDERING LOGIC
// ==========================================================================

// Dashboard View
function renderDashboard() {
    updateBadgeCounts();
    renderDashboardCharts();
    renderRecentAlertsWidget();
}

function renderDashboardCharts() {
    const stockCtx = document.getElementById('stockChart');
    const orderCtx = document.getElementById('orderChart');
    
    if (!stockCtx || !orderCtx) return;

    // Destroy previous chart instances
    if (state.charts.stock) state.charts.stock.destroy();
    if (state.charts.order) state.charts.order.destroy();

    const productLabels = state.products.slice(0, 6).map(p => p.name);
    const productQuantities = state.products.slice(0, 6).map(p => p.quantity);

    // Stock Bar Chart
    state.charts.stock = new Chart(stockCtx, {
        type: 'bar',
        data: {
            labels: productLabels.length ? productLabels : ['No Products'],
            datasets: [{
                label: 'Stock Quantity',
                data: productQuantities.length ? productQuantities : [0],
                backgroundColor: 'rgba(37, 99, 235, 0.75)',
                borderColor: '#2563eb',
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.5)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Orders Doughnut Chart
    const pendingPO = state.purchaseOrders.filter(o => o.status === 'PENDING').length;
    const completedPO = state.purchaseOrders.filter(o => o.status === 'COMPLETED').length;
    const pendingSO = state.salesOrders.filter(o => o.status === 'PENDING').length;
    const completedSO = state.salesOrders.filter(o => o.status === 'COMPLETED').length;

    state.charts.order = new Chart(orderCtx, {
        type: 'doughnut',
        data: {
            labels: ['Purchase Pending', 'Purchase Completed', 'Sales Pending', 'Sales Completed'],
            datasets: [{
                data: [pendingPO, completedPO, pendingSO, completedSO],
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function renderRecentAlertsWidget() {
    const container = document.getElementById('recentAlertsWidget');
    if (!container) return;

    if (state.stockAlerts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 24px;">
                <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 36px;"></i>
                <p style="margin-top:8px;">All stock levels are optimal!</p>
            </div>
        `;
        return;
    }

    const html = state.stockAlerts.slice(0, 5).map(a => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:12px; border-bottom:1px solid var(--border-color);">
            <div>
                <span class="font-bold">${getProductName(a.productId)}</span>
                <div style="font-size:12px; color:var(--text-muted);">${getLocationName(a.locationId)}</div>
            </div>
            <div>
                <span class="badge ${a.alertType === 'OUT_OF_STOCK' ? 'badge-danger' : 'badge-warning'}">${a.alertType}</span>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// 1. PRODUCTS TABLE
function renderProductsTable(data) {
    const table = document.getElementById('productsTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-box-open"></i><h3>No Products Found</h3><p>Click "+ Add Product" to create your first item.</p></td></tr>`;
        return;
    }

    table.innerHTML = data.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td class="font-bold">${p.name}</td>
            <td><span class="badge badge-secondary">${p.symbol || 'N/A'}</span></td>
            <td>\$${Number(p.price).toFixed(2)}</td>
            <td>
                <span class="badge ${p.quantity > 10 ? 'badge-success' : p.quantity > 0 ? 'badge-warning' : 'badge-danger'}">
                    ${p.quantity} Units
                </span>
            </td>
            <td class="text-right">
                <button class="btn-icon" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/products', ${p.id}, 'Product')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 2. CATEGORIES TABLE
function renderCategoriesTable(data) {
    const table = document.getElementById('categoriesTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="4" class="empty-state"><i class="fa-solid fa-tags"></i><h3>No Categories Found</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(c => `
        <tr>
            <td>#${c.id}</td>
            <td class="font-bold">${c.name}</td>
            <td>${c.description || 'No description'}</td>
            <td class="text-right">
                <button class="btn-icon" onclick="editCategory(${c.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/categories', ${c.id}, 'Category')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 3. SUPPLIERS TABLE
function renderSuppliersTable(data) {
    const table = document.getElementById('suppliersTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-truck"></i><h3>No Suppliers Found</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(s => `
        <tr>
            <td>#${s.id}</td>
            <td class="font-bold">${s.name}</td>
            <td>${s.email || '-'}</td>
            <td>${s.phone || '-'}</td>
            <td>${s.contactPerson || '-'}</td>
            <td class="text-right">
                <button class="btn-icon" onclick="editSupplier(${s.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/suppliers', ${s.id}, 'Supplier')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 4. LOCATIONS TABLE
function renderLocationsTable(data) {
    const table = document.getElementById('locationsTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-warehouse"></i><h3>No Locations Found</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(l => `
        <tr>
            <td>#${l.id}</td>
            <td class="font-bold">${l.name}</td>
            <td>${l.address || '-'}</td>
            <td>${l.city || '-'}</td>
            <td>${l.state || '-'} (${l.pincode || '-'})</td>
            <td class="text-right">
                <button class="btn-icon" onclick="editLocation(${l.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/locations', ${l.id}, 'Location')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 5. INVENTORY TABLE
function renderInventoryTable(data) {
    const table = document.getElementById('inventoryTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-boxes-stacked"></i><h3>No Inventory Records</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(i => `
        <tr>
            <td>#${i.id}</td>
            <td class="font-bold">${getProductName(i.productId)}</td>
            <td>${getLocationName(i.locationId)}</td>
            <td><span class="font-bold">${i.quantity}</span> Units</td>
            <td><span class="badge badge-secondary">Min: ${i.minimumStock}</span></td>
            <td class="text-right">
                <button class="btn-icon" onclick="editInventory(${i.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/inventory', ${i.id}, 'Inventory Record')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 6. PURCHASE ORDERS TABLE
function renderPurchaseOrdersTable(data) {
    const table = document.getElementById('purchaseOrdersTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="8" class="empty-state"><i class="fa-solid fa-file-invoice-dollar"></i><h3>No Purchase Orders</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(po => `
        <tr>
            <td>#PO-${po.id}</td>
            <td class="font-bold">${getSupplierName(po.supplierId)}</td>
            <td>${getProductName(po.productId)}</td>
            <td>${getLocationName(po.locationId)}</td>
            <td>${po.quantity}</td>
            <td>\$${Number(po.totalAmount || 0).toFixed(2)}</td>
            <td><span class="badge ${po.status === 'COMPLETED' ? 'badge-success' : po.status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'}">${po.status || 'PENDING'}</span></td>
            <td class="text-right">
                <button class="btn-icon" onclick="editPurchaseOrder(${po.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/purchase-orders', ${po.id}, 'Purchase Order')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 7. SALES ORDERS TABLE
function renderSalesOrdersTable(data) {
    const table = document.getElementById('salesOrdersTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="8" class="empty-state"><i class="fa-solid fa-cart-shopping"></i><h3>No Sales Orders</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(so => `
        <tr>
            <td>#SO-${so.id}</td>
            <td class="font-bold">${getUserName(so.userId)}</td>
            <td>${getProductName(so.productId)}</td>
            <td>${getLocationName(so.locationId)}</td>
            <td>${so.quantity}</td>
            <td>\$${Number(so.totalAmount || 0).toFixed(2)}</td>
            <td><span class="badge ${so.status === 'COMPLETED' ? 'badge-success' : so.status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'}">${so.status || 'PENDING'}</span></td>
            <td class="text-right">
                <button class="btn-icon" onclick="editSalesOrder(${so.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/sales-orders', ${so.id}, 'Sales Order')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 8. STOCK TRANSFERS TABLE
function renderStockTransfersTable(data) {
    const table = document.getElementById('stockTransfersTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="7" class="empty-state"><i class="fa-solid fa-arrow-right-arrow-left"></i><h3>No Stock Transfers</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(st => `
        <tr>
            <td>#ST-${st.id}</td>
            <td class="font-bold">${getProductName(st.productId)}</td>
            <td>${getLocationName(st.fromLocationId)}</td>
            <td>${getLocationName(st.toLocationId)}</td>
            <td>${st.quantity} Units</td>
            <td><span class="badge ${st.status === 'COMPLETED' ? 'badge-success' : 'badge-info'}">${st.status || 'IN_TRANSIT'}</span></td>
            <td class="text-right">
                <button class="btn-icon" onclick="editStockTransfer(${st.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/stock-transfers', ${st.id}, 'Stock Transfer')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 9. STOCK ALERTS TABLE
function renderStockAlertsTable(data) {
    const table = document.getElementById('stockAlertsTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="8" class="empty-state"><i class="fa-solid fa-bell"></i><h3>No Stock Alerts</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(sa => `
        <tr>
            <td>#ALERT-${sa.id}</td>
            <td class="font-bold">${getProductName(sa.productId)}</td>
            <td>${getLocationName(sa.locationId)}</td>
            <td>${sa.currentStock} Units</td>
            <td>Min: ${sa.minimumStock} Units</td>
            <td><span class="badge ${sa.alertType === 'OUT_OF_STOCK' ? 'badge-danger' : 'badge-warning'}">${sa.alertType}</span></td>
            <td><span class="badge ${sa.status === 'RESOLVED' ? 'badge-success' : 'badge-danger'}">${sa.status}</span></td>
            <td class="text-right">
                <button class="btn-icon" onclick="editStockAlert(${sa.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon delete" onclick="deleteEntity('/stock-alerts', ${sa.id}, 'Stock Alert')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// 10. USERS TABLE
function renderUsersTable(data) {
    const table = document.getElementById('usersTableBody');
    if (!table) return;

    if (!data || data.length === 0) {
        table.innerHTML = `<tr><td colspan="4" class="empty-state"><i class="fa-solid fa-users"></i><h3>No Users Found</h3></td></tr>`;
        return;
    }

    table.innerHTML = data.map(u => `
        <tr>
            <td>#USER-${u.id}</td>
            <td class="font-bold">${u.name}</td>
            <td>${u.email}</td>
            <td class="text-right">
                <button class="btn-icon delete" onclick="deleteEntity('/users', ${u.id}, 'User')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// ==========================================================================
// MODAL DIALOG CONTROLLER & CRUD FORM GENERATION
// ==========================================================================
function openModal(title, bodyContent, onSubmit) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = bodyContent;
    
    const backdrop = document.getElementById('modalBackdrop');
    backdrop.classList.add('show');

    const form = document.getElementById('modalForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await onSubmit();
        closeModal();
    };
}

function closeModal() {
    const backdrop = document.getElementById('modalBackdrop');
    backdrop.classList.remove('show');
}

// Generic DELETE Handler
async function deleteEntity(endpoint, id, entityName) {
    if (!confirm(`Are you sure you want to delete this ${entityName}?`)) return;

    try {
        const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast(`${entityName} deleted successfully`, "success");
            await fetchAllData();
        } else {
            showToast(`Failed to delete ${entityName}`, "error");
        }
    } catch (err) {
        console.error(err);
        showToast("Error deleting item", "error");
    }
}

// --- PRODUCT FORMS ---
function openAddProductModal() {
    const content = `
        <div class="form-group">
            <label class="form-label">Product Name *</label>
            <input type="text" id="p_name" class="form-control" required placeholder="e.g. Wireless Mouse">
        </div>
        <div class="form-group">
            <label class="form-label">Symbol / SKU</label>
            <input type="text" id="p_symbol" class="form-control" placeholder="e.g. WM-100">
        </div>
        <div class="form-group">
            <label class="form-label">Price ($) *</label>
            <input type="number" step="0.01" id="p_price" class="form-control" required placeholder="29.99">
        </div>
        <div class="form-group">
            <label class="form-label">Initial Quantity *</label>
            <input type="number" id="p_quantity" class="form-control" required placeholder="50">
        </div>
    `;

    openModal("Add New Product", content, async () => {
        const payload = {
            name: document.getElementById('p_name').value,
            symbol: document.getElementById('p_symbol').value,
            price: parseFloat(document.getElementById('p_price').value),
            quantity: parseInt(document.getElementById('p_quantity').value)
        };
        await saveEntity('/products', 'POST', payload, 'Product');
    });
}

function editProduct(id) {
    const item = state.products.find(p => p.id == id);
    if (!item) return;

    const content = `
        <div class="form-group">
            <label class="form-label">Product Name *</label>
            <input type="text" id="p_name" class="form-control" value="${item.name}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Symbol / SKU</label>
            <input type="text" id="p_symbol" class="form-control" value="${item.symbol || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Price ($) *</label>
            <input type="number" step="0.01" id="p_price" class="form-control" value="${item.price}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity *</label>
            <input type="number" id="p_quantity" class="form-control" value="${item.quantity}" required>
        </div>
    `;

    openModal(`Edit Product #${id}`, content, async () => {
        const payload = {
            id: id,
            name: document.getElementById('p_name').value,
            symbol: document.getElementById('p_symbol').value,
            price: parseFloat(document.getElementById('p_price').value),
            quantity: parseInt(document.getElementById('p_quantity').value)
        };
        await saveEntity(`/products/${id}`, 'PUT', payload, 'Product');
    });
}

// --- CATEGORY FORMS ---
function openAddCategoryModal() {
    const content = `
        <div class="form-group">
            <label class="form-label">Category Name *</label>
            <input type="text" id="c_name" class="form-control" required placeholder="e.g. Electronics">
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" id="c_desc" class="form-control" placeholder="Short description">
        </div>
    `;

    openModal("Add New Category", content, async () => {
        const payload = {
            name: document.getElementById('c_name').value,
            description: document.getElementById('c_desc').value
        };
        await saveEntity('/categories', 'POST', payload, 'Category');
    });
}

function editCategory(id) {
    const item = state.categories.find(c => c.id == id);
    if (!item) return;

    const content = `
        <div class="form-group">
            <label class="form-label">Category Name *</label>
            <input type="text" id="c_name" class="form-control" value="${item.name}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" id="c_desc" class="form-control" value="${item.description || ''}">
        </div>
    `;

    openModal(`Edit Category #${id}`, content, async () => {
        const payload = {
            id: id,
            name: document.getElementById('c_name').value,
            description: document.getElementById('c_desc').value
        };
        await saveEntity(`/categories/${id}`, 'PUT', payload, 'Category');
    });
}

// --- SUPPLIER FORMS ---
function openAddSupplierModal() {
    const content = `
        <div class="form-group">
            <label class="form-label">Supplier Name *</label>
            <input type="text" id="s_name" class="form-control" required placeholder="Acme Logistics">
        </div>
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="s_email" class="form-control" placeholder="contact@acme.com">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" id="s_phone" class="form-control" placeholder="+1 555-0199">
        </div>
        <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" id="s_address" class="form-control" placeholder="123 Supply Street">
        </div>
        <div class="form-group">
            <label class="form-label">Contact Person</label>
            <input type="text" id="s_person" class="form-control" placeholder="John Doe">
        </div>
    `;

    openModal("Add New Supplier", content, async () => {
        const payload = {
            name: document.getElementById('s_name').value,
            email: document.getElementById('s_email').value,
            phone: document.getElementById('s_phone').value,
            address: document.getElementById('s_address').value,
            contactPerson: document.getElementById('s_person').value
        };
        await saveEntity('/suppliers', 'POST', payload, 'Supplier');
    });
}

function editSupplier(id) {
    const item = state.suppliers.find(s => s.id == id);
    if (!item) return;

    const content = `
        <div class="form-group">
            <label class="form-label">Supplier Name *</label>
            <input type="text" id="s_name" class="form-control" value="${item.name}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" id="s_email" class="form-control" value="${item.email || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" id="s_phone" class="form-control" value="${item.phone || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" id="s_address" class="form-control" value="${item.address || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Contact Person</label>
            <input type="text" id="s_person" class="form-control" value="${item.contactPerson || ''}">
        </div>
    `;

    openModal(`Edit Supplier #${id}`, content, async () => {
        const payload = {
            id: id,
            name: document.getElementById('s_name').value,
            email: document.getElementById('s_email').value,
            phone: document.getElementById('s_phone').value,
            address: document.getElementById('s_address').value,
            contactPerson: document.getElementById('s_person').value
        };
        await saveEntity(`/suppliers/${id}`, 'PUT', payload, 'Supplier');
    });
}

// --- LOCATION FORMS ---
function openAddLocationModal() {
    const content = `
        <div class="form-group">
            <label class="form-label">Location Name *</label>
            <input type="text" id="l_name" class="form-control" required placeholder="Central Warehouse">
        </div>
        <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" id="l_address" class="form-control" placeholder="456 Industrial Pkwy">
        </div>
        <div class="form-group">
            <label class="form-label">City</label>
            <input type="text" id="l_city" class="form-control" placeholder="Chicago">
        </div>
        <div class="form-group">
            <label class="form-label">State</label>
            <input type="text" id="l_state" class="form-control" placeholder="IL">
        </div>
        <div class="form-group">
            <label class="form-label">Pincode / ZIP</label>
            <input type="text" id="l_pincode" class="form-control" placeholder="60601">
        </div>
    `;

    openModal("Add Warehouse Location", content, async () => {
        const payload = {
            name: document.getElementById('l_name').value,
            address: document.getElementById('l_address').value,
            city: document.getElementById('l_city').value,
            state: document.getElementById('l_state').value,
            pincode: document.getElementById('l_pincode').value
        };
        await saveEntity('/locations', 'POST', payload, 'Location');
    });
}

function editLocation(id) {
    const item = state.locations.find(l => l.id == id);
    if (!item) return;

    const content = `
        <div class="form-group">
            <label class="form-label">Location Name *</label>
            <input type="text" id="l_name" class="form-control" value="${item.name}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" id="l_address" class="form-control" value="${item.address || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">City</label>
            <input type="text" id="l_city" class="form-control" value="${item.city || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">State</label>
            <input type="text" id="l_state" class="form-control" value="${item.state || ''}">
        </div>
        <div class="form-group">
            <label class="form-label">Pincode / ZIP</label>
            <input type="text" id="l_pincode" class="form-control" value="${item.pincode || ''}">
        </div>
    `;

    openModal(`Edit Location #${id}`, content, async () => {
        const payload = {
            id: id,
            name: document.getElementById('l_name').value,
            address: document.getElementById('l_address').value,
            city: document.getElementById('l_city').value,
            state: document.getElementById('l_state').value,
            pincode: document.getElementById('l_pincode').value
        };
        await saveEntity(`/locations/${id}`, 'PUT', payload, 'Location');
    });
}

// --- INVENTORY FORMS ---
function openAddInventoryModal() {
    const productOpts = state.products.map(p => `<option value="${p.id}">${p.name} (${p.symbol || 'N/A'})</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="inv_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Select Location *</label>
            <select id="inv_locationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity *</label>
            <input type="number" id="inv_quantity" class="form-control" required placeholder="100">
        </div>
        <div class="form-group">
            <label class="form-label">Minimum Stock Alert Threshold *</label>
            <input type="number" id="inv_minStock" class="form-control" required placeholder="15">
        </div>
    `;

    openModal("Add Inventory Record", content, async () => {
        const payload = {
            productId: parseInt(document.getElementById('inv_productId').value),
            locationId: parseInt(document.getElementById('inv_locationId').value),
            quantity: parseInt(document.getElementById('inv_quantity').value),
            minimumStock: parseInt(document.getElementById('inv_minStock').value)
        };
        await saveEntity('/inventory', 'POST', payload, 'Inventory Record');
    });
}

function editInventory(id) {
    const item = state.inventory.find(i => i.id == id);
    if (!item) return;

    const productOpts = state.products.map(p => `<option value="${p.id}" ${p.id == item.productId ? 'selected' : ''}>${p.name}</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}" ${l.id == item.locationId ? 'selected' : ''}>${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="inv_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Select Location *</label>
            <select id="inv_locationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity *</label>
            <input type="number" id="inv_quantity" class="form-control" value="${item.quantity}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Minimum Stock Threshold *</label>
            <input type="number" id="inv_minStock" class="form-control" value="${item.minimumStock}" required>
        </div>
    `;

    openModal(`Edit Inventory #${id}`, content, async () => {
        const payload = {
            id: id,
            productId: parseInt(document.getElementById('inv_productId').value),
            locationId: parseInt(document.getElementById('inv_locationId').value),
            quantity: parseInt(document.getElementById('inv_quantity').value),
            minimumStock: parseInt(document.getElementById('inv_minStock').value)
        };
        await saveEntity(`/inventory/${id}`, 'PUT', payload, 'Inventory Record');
    });
}

// --- PURCHASE ORDER FORMS ---
function openAddPurchaseOrderModal() {
    const supplierOpts = state.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    const productOpts = state.products.map(p => `<option value="${p.id}">${p.name} ($${p.price})</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Supplier *</label>
            <select id="po_supplierId" class="form-select" required>${supplierOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="po_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Destination Location *</label>
            <select id="po_locationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity *</label>
            <input type="number" id="po_quantity" class="form-control" required placeholder="50">
        </div>
        <div class="form-group">
            <label class="form-label">Total Amount ($) *</label>
            <input type="number" step="0.01" id="po_totalAmount" class="form-control" required placeholder="1499.50">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select id="po_status" class="form-select">
                <option value="PENDING">PENDING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>
        </div>
    `;

    openModal("Create Purchase Order", content, async () => {
        const payload = {
            supplierId: parseInt(document.getElementById('po_supplierId').value),
            productId: parseInt(document.getElementById('po_productId').value),
            locationId: parseInt(document.getElementById('po_locationId').value),
            quantity: parseInt(document.getElementById('po_quantity').value),
            totalAmount: parseFloat(document.getElementById('po_totalAmount').value),
            status: document.getElementById('po_status').value
        };
        await saveEntity('/purchase-orders', 'POST', payload, 'Purchase Order');
    });
}

function editPurchaseOrder(id) {
    const item = state.purchaseOrders.find(po => po.id == id);
    if (!item) return;

    const supplierOpts = state.suppliers.map(s => `<option value="${s.id}" ${s.id == item.supplierId ? 'selected' : ''}>${s.name}</option>`).join('');
    const productOpts = state.products.map(p => `<option value="${p.id}" ${p.id == item.productId ? 'selected' : ''}>${p.name}</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}" ${l.id == item.locationId ? 'selected' : ''}>${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Supplier *</label>
            <select id="po_supplierId" class="form-select" required>${supplierOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="po_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Destination Location *</label>
            <select id="po_locationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity *</label>
            <input type="number" id="po_quantity" class="form-control" value="${item.quantity}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Total Amount ($) *</label>
            <input type="number" step="0.01" id="po_totalAmount" class="form-control" value="${item.totalAmount || 0}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select id="po_status" class="form-select">
                <option value="PENDING" ${item.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                <option value="COMPLETED" ${item.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                <option value="CANCELLED" ${item.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
            </select>
        </div>
    `;

    openModal(`Edit Purchase Order #${id}`, content, async () => {
        const payload = {
            id: id,
            supplierId: parseInt(document.getElementById('po_supplierId').value),
            productId: parseInt(document.getElementById('po_productId').value),
            locationId: parseInt(document.getElementById('po_locationId').value),
            quantity: parseInt(document.getElementById('po_quantity').value),
            totalAmount: parseFloat(document.getElementById('po_totalAmount').value),
            status: document.getElementById('po_status').value
        };
        await saveEntity(`/purchase-orders/${id}`, 'PUT', payload, 'Purchase Order');
    });
}

// --- SALES ORDER FORMS ---
function openAddSalesOrderModal() {
    const userOpts = state.users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
    const productOpts = state.products.map(p => `<option value="${p.id}">${p.name} ($${p.price})</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Customer / User *</label>
            <select id="so_userId" class="form-select" required>${userOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="so_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Fulfillment Location *</label>
            <select id="so_locationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity *</label>
            <input type="number" id="so_quantity" class="form-control" required placeholder="2">
        </div>
        <div class="form-group">
            <label class="form-label">Total Amount ($) *</label>
            <input type="number" step="0.01" id="so_totalAmount" class="form-control" required placeholder="199.00">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select id="so_status" class="form-select">
                <option value="PENDING">PENDING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>
        </div>
    `;

    openModal("Create Sales Order", content, async () => {
        const payload = {
            userId: parseInt(document.getElementById('so_userId').value),
            productId: parseInt(document.getElementById('so_productId').value),
            locationId: parseInt(document.getElementById('so_locationId').value),
            quantity: parseInt(document.getElementById('so_quantity').value),
            totalAmount: parseFloat(document.getElementById('so_totalAmount').value),
            status: document.getElementById('so_status').value
        };
        await saveEntity('/sales-orders', 'POST', payload, 'Sales Order');
    });
}

function editSalesOrder(id) {
    const item = state.salesOrders.find(so => so.id == id);
    if (!item) return;

    const userOpts = state.users.map(u => `<option value="${u.id}" ${u.id == item.userId ? 'selected' : ''}>${u.name}</option>`).join('');
    const productOpts = state.products.map(p => `<option value="${p.id}" ${p.id == item.productId ? 'selected' : ''}>${p.name}</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}" ${l.id == item.locationId ? 'selected' : ''}>${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Customer / User *</label>
            <select id="so_userId" class="form-select" required>${userOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="so_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Fulfillment Location *</label>
            <select id="so_locationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Quantity *</label>
            <input type="number" id="so_quantity" class="form-control" value="${item.quantity}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Total Amount ($) *</label>
            <input type="number" step="0.01" id="so_totalAmount" class="form-control" value="${item.totalAmount || 0}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select id="so_status" class="form-select">
                <option value="PENDING" ${item.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                <option value="COMPLETED" ${item.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
                <option value="CANCELLED" ${item.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
            </select>
        </div>
    `;

    openModal(`Edit Sales Order #${id}`, content, async () => {
        const payload = {
            id: id,
            userId: parseInt(document.getElementById('so_userId').value),
            productId: parseInt(document.getElementById('so_productId').value),
            locationId: parseInt(document.getElementById('so_locationId').value),
            quantity: parseInt(document.getElementById('so_quantity').value),
            totalAmount: parseFloat(document.getElementById('so_totalAmount').value),
            status: document.getElementById('so_status').value
        };
        await saveEntity(`/sales-orders/${id}`, 'PUT', payload, 'Sales Order');
    });
}

// --- STOCK TRANSFER FORMS ---
function openAddStockTransferModal() {
    const productOpts = state.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="st_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">From Location *</label>
            <select id="st_fromLocationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">To Location *</label>
            <select id="st_toLocationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Transfer Quantity *</label>
            <input type="number" id="st_quantity" class="form-control" required placeholder="20">
        </div>
        <div class="form-group">
            <label class="form-label">Transfer Status</label>
            <select id="st_status" class="form-select">
                <option value="IN_TRANSIT">IN_TRANSIT</option>
                <option value="COMPLETED">COMPLETED</option>
            </select>
        </div>
    `;

    openModal("New Stock Transfer", content, async () => {
        const payload = {
            productId: parseInt(document.getElementById('st_productId').value),
            fromLocationId: parseInt(document.getElementById('st_fromLocationId').value),
            toLocationId: parseInt(document.getElementById('st_toLocationId').value),
            quantity: parseInt(document.getElementById('st_quantity').value),
            status: document.getElementById('st_status').value
        };
        await saveEntity('/stock-transfers', 'POST', payload, 'Stock Transfer');
    });
}

function editStockTransfer(id) {
    const item = state.stockTransfers.find(st => st.id == id);
    if (!item) return;

    const productOpts = state.products.map(p => `<option value="${p.id}" ${p.id == item.productId ? 'selected' : ''}>${p.name}</option>`).join('');
    const locationOptsFrom = state.locations.map(l => `<option value="${l.id}" ${l.id == item.fromLocationId ? 'selected' : ''}>${l.name}</option>`).join('');
    const locationOptsTo = state.locations.map(l => `<option value="${l.id}" ${l.id == item.toLocationId ? 'selected' : ''}>${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="st_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">From Location *</label>
            <select id="st_fromLocationId" class="form-select" required>${locationOptsFrom}</select>
        </div>
        <div class="form-group">
            <label class="form-label">To Location *</label>
            <select id="st_toLocationId" class="form-select" required>${locationOptsTo}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Transfer Quantity *</label>
            <input type="number" id="st_quantity" class="form-control" value="${item.quantity}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Transfer Status</label>
            <select id="st_status" class="form-select">
                <option value="IN_TRANSIT" ${item.status === 'IN_TRANSIT' ? 'selected' : ''}>IN_TRANSIT</option>
                <option value="COMPLETED" ${item.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
            </select>
        </div>
    `;

    openModal(`Edit Stock Transfer #${id}`, content, async () => {
        const payload = {
            id: id,
            productId: parseInt(document.getElementById('st_productId').value),
            fromLocationId: parseInt(document.getElementById('st_fromLocationId').value),
            toLocationId: parseInt(document.getElementById('st_toLocationId').value),
            quantity: parseInt(document.getElementById('st_quantity').value),
            status: document.getElementById('st_status').value
        };
        await saveEntity(`/stock-transfers/${id}`, 'PUT', payload, 'Stock Transfer');
    });
}

// --- STOCK ALERT FORMS ---
function openAddStockAlertModal() {
    const productOpts = state.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="sa_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Location *</label>
            <select id="sa_locationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Current Stock *</label>
            <input type="number" id="sa_currentStock" class="form-control" required placeholder="5">
        </div>
        <div class="form-group">
            <label class="form-label">Minimum Stock *</label>
            <input type="number" id="sa_minimumStock" class="form-control" required placeholder="15">
        </div>
        <div class="form-group">
            <label class="form-label">Alert Type</label>
            <select id="sa_alertType" class="form-select">
                <option value="LOW_STOCK">LOW_STOCK</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select id="sa_status" class="form-select">
                <option value="OPEN">OPEN</option>
                <option value="RESOLVED">RESOLVED</option>
            </select>
        </div>
    `;

    openModal("Add Stock Alert", content, async () => {
        const payload = {
            productId: parseInt(document.getElementById('sa_productId').value),
            locationId: parseInt(document.getElementById('sa_locationId').value),
            currentStock: parseInt(document.getElementById('sa_currentStock').value),
            minimumStock: parseInt(document.getElementById('sa_minimumStock').value),
            alertType: document.getElementById('sa_alertType').value,
            status: document.getElementById('sa_status').value
        };
        await saveEntity('/stock-alerts', 'POST', payload, 'Stock Alert');
    });
}

function editStockAlert(id) {
    const item = state.stockAlerts.find(sa => sa.id == id);
    if (!item) return;

    const productOpts = state.products.map(p => `<option value="${p.id}" ${p.id == item.productId ? 'selected' : ''}>${p.name}</option>`).join('');
    const locationOpts = state.locations.map(l => `<option value="${l.id}" ${l.id == item.locationId ? 'selected' : ''}>${l.name}</option>`).join('');

    const content = `
        <div class="form-group">
            <label class="form-label">Select Product *</label>
            <select id="sa_productId" class="form-select" required>${productOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Location *</label>
            <select id="sa_locationId" class="form-select" required>${locationOpts}</select>
        </div>
        <div class="form-group">
            <label class="form-label">Current Stock *</label>
            <input type="number" id="sa_currentStock" class="form-control" value="${item.currentStock}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Minimum Stock *</label>
            <input type="number" id="sa_minimumStock" class="form-control" value="${item.minimumStock}" required>
        </div>
        <div class="form-group">
            <label class="form-label">Alert Type</label>
            <select id="sa_alertType" class="form-select">
                <option value="LOW_STOCK" ${item.alertType === 'LOW_STOCK' ? 'selected' : ''}>LOW_STOCK</option>
                <option value="OUT_OF_STOCK" ${item.alertType === 'OUT_OF_STOCK' ? 'selected' : ''}>OUT_OF_STOCK</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select id="sa_status" class="form-select">
                <option value="OPEN" ${item.status === 'OPEN' ? 'selected' : ''}>OPEN</option>
                <option value="RESOLVED" ${item.status === 'RESOLVED' ? 'selected' : ''}>RESOLVED</option>
            </select>
        </div>
    `;

    openModal(`Edit Stock Alert #${id}`, content, async () => {
        const payload = {
            id: id,
            productId: parseInt(document.getElementById('sa_productId').value),
            locationId: parseInt(document.getElementById('sa_locationId').value),
            currentStock: parseInt(document.getElementById('sa_currentStock').value),
            minimumStock: parseInt(document.getElementById('sa_minimumStock').value),
            alertType: document.getElementById('sa_alertType').value,
            status: document.getElementById('sa_status').value
        };
        await saveEntity(`/stock-alerts/${id}`, 'PUT', payload, 'Stock Alert');
    });
}

// --- USER FORMS ---
function openAddUserModal() {
    const content = `
        <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" id="u_name" class="form-control" required placeholder="Jane Smith">
        </div>
        <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input type="email" id="u_email" class="form-control" required placeholder="jane@company.com">
        </div>
        <div class="form-group">
            <label class="form-label">Password *</label>
            <input type="password" id="u_password" class="form-control" required placeholder="••••••••">
        </div>
    `;

    openModal("Register New User", content, async () => {
        const payload = {
            name: document.getElementById('u_name').value,
            email: document.getElementById('u_email').value,
            password: document.getElementById('u_password').value
        };
        await saveEntity('/users', 'POST', payload, 'User');
    });
}

// Generic SAVE HTTP POST/PUT Handler
async function saveEntity(endpoint, method, payload, entityName) {
    try {
        const res = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast(`${entityName} saved successfully!`, "success");
            await fetchAllData();
        } else {
            showToast(`Failed to save ${entityName}`, "error");
        }
    } catch (err) {
        console.error(err);
        showToast("Server error during save operation", "error");
    }
}

// Toast Notifications Component
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <div>${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Demo Data Seeder (Helper when database is fresh)
async function seedDemoData() {
    try {
        showToast("Seeding demo data...", "info");

        // 1. Categories
        await fetch('/categories', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'Laptops & PCs', description: 'Enterprise Workstations' }) });
        await fetch('/categories', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'Accessories', description: 'Computer Accessories & Peripherals' }) });

        // 2. Locations
        const loc1 = await fetch('/locations', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'Main Central Hub', address: '100 Tech Blvd', city: 'Seattle', state: 'WA', pincode: '98101' }) }).then(r => r.json());
        const loc2 = await fetch('/locations', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'East Coast Depot', address: '45 Supply Ave', city: 'Boston', state: 'MA', pincode: '02108' }) }).then(r => r.json());

        // 3. Suppliers
        const sup1 = await fetch('/suppliers', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'TechCorp Global', email: 'sales@techcorp.com', phone: '+1 800-555-0100', address: 'San Jose, CA', contactPerson: 'Alex Vance' }) }).then(r => r.json());

        // 4. Products
        const p1 = await fetch('/products', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'ProBook Laptop 15"', symbol: 'PB-15', price: 1299.99, quantity: 45 }) }).then(r => r.json());
        const p2 = await fetch('/products', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'Ergonomic Wireless Mouse', symbol: 'WM-200', price: 49.99, quantity: 150 }) }).then(r => r.json());
        const p3 = await fetch('/products', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'UltraWide Monitor 34"', symbol: 'MON-34', price: 599.00, quantity: 8 }) }).then(r => r.json());

        // 5. Users
        const u1 = await fetch('/users', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ name: 'Sarah Connor', email: 'sarah@stocksmart.com', password: 'password123' }) }).then(r => r.json());

        // 6. Inventory
        if (p1.id && loc1.id) {
            await fetch('/inventory', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ productId: p1.id, locationId: loc1.id, quantity: 45, minimumStock: 10 }) });
        }
        if (p3.id && loc1.id) {
            await fetch('/inventory', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ productId: p3.id, locationId: loc1.id, quantity: 8, minimumStock: 15 }) });
            // Stock Alert for Low Stock
            await fetch('/stock-alerts', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ productId: p3.id, locationId: loc1.id, currentStock: 8, minimumStock: 15, alertType: 'LOW_STOCK', status: 'OPEN' }) });
        }

        // 7. Orders
        if (sup1.id && p1.id && loc1.id) {
            await fetch('/purchase-orders', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ supplierId: sup1.id, productId: p1.id, locationId: loc1.id, quantity: 20, totalAmount: 25999.80, status: 'COMPLETED' }) });
        }
        if (u1.id && p2.id && loc1.id) {
            await fetch('/sales-orders', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ userId: u1.id, productId: p2.id, locationId: loc1.id, quantity: 5, totalAmount: 249.95, status: 'COMPLETED' }) });
        }

        showToast("Demo data seeded successfully!", "success");
        await fetchAllData();
    } catch (err) {
        console.error("Error seeding demo data:", err);
        showToast("Failed to seed demo data", "error");
    }
}
