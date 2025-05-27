// Check if user is logged in
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard DOM loaded');

    try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            // Redirect to login if not logged in
            console.log('No user found, redirecting to login');
            window.location.href = 'index.html';
            return;
        }

        // Set up navigation event listeners
        setupEventListeners();

        // Set up collar type dropdown
        setupCollarTypeDropdown();

        // Load dashboard by default
        showDashboardView();

        // Load all customers
        loadCustomers();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
});

// Set up all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');

    // Navigation menu links
    document.getElementById('dashboard-link').addEventListener('click', function (e) {
        e.preventDefault();
        showDashboardView();
    });

    document.getElementById('add-customer-link').addEventListener('click', function (e) {
        e.preventDefault();
        showAddCustomerView();
    });

    document.getElementById('manage-customers-link').addEventListener('click', function (e) {
        e.preventDefault();
        showManageCustomersView();
    });

    document.getElementById('logout-link').addEventListener('click', function (e) {
        e.preventDefault();
        logout();
    });

    // Dashboard cards navigation
    document.getElementById('add-customer-card').addEventListener('click', function () {
        console.log('Add customer card clicked');
        showAddCustomerView();
    });

    document.getElementById('manage-customers-card').addEventListener('click', function () {
        console.log('Manage customers card clicked');
        showManageCustomersView();
    });

    // Cancel button in Add Customer form
    document.getElementById('cancel-add-customer').addEventListener('click', function () {
        console.log('Cancel button clicked');
        showDashboardView();
    });    // Customer form submission
    document.getElementById('customer-form').addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Customer form submitted');
        saveCustomer();
    });

    // Search button
    document.getElementById('search-btn').addEventListener('click', searchCustomers);
}

// View functions
function showDashboardView() {
    document.getElementById('dashboard-view').style.display = 'block';
    document.getElementById('add-customer-view').style.display = 'none';
    document.getElementById('manage-customers-view').style.display = 'none';
    document.getElementById('customer-details-view').style.display = 'none';

    // Update active nav link
    setActiveNavLink('dashboard-link');
}

function showAddCustomerView() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('add-customer-view').style.display = 'block';
    document.getElementById('manage-customers-view').style.display = 'none';
    document.getElementById('customer-details-view').style.display = 'none';

    // Auto-set current date
    document.getElementById('orderDate').valueAsDate = new Date();

    // Update active nav link
    setActiveNavLink('add-customer-link');
}

function showManageCustomersView() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('add-customer-view').style.display = 'none';
    document.getElementById('manage-customers-view').style.display = 'block';
    document.getElementById('customer-details-view').style.display = 'none';

    // Update active nav link
    setActiveNavLink('manage-customers-link');

    // Load the latest customers
    loadCustomers();
}

function showCustomerDetailsView(customer) {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('add-customer-view').style.display = 'none';
    document.getElementById('manage-customers-view').style.display = 'none';
    document.getElementById('customer-details-view').style.display = 'block';

    // Clear previous content
    const detailsView = document.getElementById('customer-details-view');
    detailsView.innerHTML = '';

    // Create form with customer details
    createCustomerDetailsForm(detailsView, customer);
}

// Helper functions
function setActiveNavLink(linkId) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to specified link
    document.getElementById(linkId).classList.add('active');
}

function logout() {
    // Clear session
    sessionStorage.removeItem('user');

    // Redirect to login
    window.location.href = 'index.html';
}

// Customer CRUD operations
function saveCustomer() {
    console.log('Saving customer');

    // Get form values
    const customerData = {
        codeNumber: document.getElementById('codeNumber').value,
        orderDate: document.getElementById('orderDate').value,
        name: document.getElementById('name').value,
        returnDate: document.getElementById('returnDate').value,
        cellNumber: document.getElementById('cellNumber').value,
        address: document.getElementById('address').value,
        age: document.getElementById('age').value,
        cuttingNo: document.getElementById('cuttingNo').value,
        quantity: document.getElementById('quantity').value,
        enteredBy: document.getElementById('enteredBy').value,

        // Measurements
        measurements: {
            // Shalwar Qameez
            lambai: document.getElementById('lambai').value,
            asteen: document.getElementById('asteen').value,
            tera: document.getElementById('tera').value,
            collar_type: document.getElementById('collar_type').value,
            collar_style: document.getElementById('collar_style').value,
            chati: document.getElementById('chati').value,
            kamar: document.getElementById('kamar').value,
            gira: document.getElementById('gira').value,
            moza: document.getElementById('moza').value,
            double_side_pocket: document.getElementById('double_side_pocket').value,
            single_pocket: document.getElementById('single_pocket').value,
            front_pocket: document.getElementById('front_pocket').value,
            silai: document.getElementById('silai').value,
            button_color: document.getElementById('button_color').value,
            button: document.getElementById('button').value,
            button_size: document.getElementById('button_size').value,

            // Shalwar
            shalwar_lambai: document.getElementById('shalwar_lambai').value,
            shalwar_type: document.getElementById('shalwar_type').value,
            shalwar: document.getElementById('shalwar').value,
            pacha: document.getElementById('pacha').value,
            lib: document.getElementById('lib').value,
            ander: document.getElementById('ander').value,
            shalwar_pocket: document.getElementById('shalwar_pocket').value,
            patti: document.getElementById('patti').value,

            // Cuff/Plate
            cuff_plate: document.getElementById('cuff_plate').value,
            cuff_kaj: document.getElementById('cuff_kaj').value,
            chak_patti: document.getElementById('chak_patti').value,
            chak_patti_kaj: document.getElementById('chak_patti_kaj').value,
            daman: document.getElementById('daman').value,
            extra_demand: document.getElementById('extra_demand').value,
            shoulder_style: document.getElementById('shoulder_style').value,
            sleeve_type: document.getElementById('sleeve_type').value,
            gol_asteen: document.getElementById('gol_asteen').value
        }
    };

    try {
        // Send to main process
        window.api.send('add-customer', customerData);

        // For development/demo purposes, show success message and return to dashboard
        // In a real app, you would wait for the response from the main process
        alert('Customer saved successfully!');
        document.getElementById('customer-form').reset();
        showDashboardView();
    } catch (error) {
        console.error('Error saving customer:', error);
        alert('Error saving customer. Please try again.');
    }
}

// Handle add-customer response
window.api.receive('add-customer-response', (response) => {
    if (response.success) {
        // Show success message
        alert('Customer added successfully!');

        // Reset form
        document.getElementById('customer-form').reset();

        // Go back to dashboard
        showDashboardView();
    } else {
        alert('Error adding customer: ' + response.error);
    }
});

function loadCustomers() {
    window.api.send('get-customers');
}

// Handle get-customers response
window.api.receive('get-customers-response', (response) => {
    if (response.success) {
        displayCustomers(response.customers);
    } else {
        console.error('Error loading customers:', response.error);
    }
});

function searchCustomers() {
    const query = document.getElementById('search-input').value;

    if (query.trim() === '') {
        loadCustomers();
        return;
    }

    window.api.send('search-customers', { query });
}

// Handle search-customers response
window.api.receive('search-customers-response', (response) => {
    if (response.success) {
        displayCustomers(response.customers);
    } else {
        console.error('Error searching customers:', response.error);
    }
});

function displayCustomers(customers) {
    const tableBody = document.getElementById('customers-table-body');
    tableBody.innerHTML = '';

    if (customers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="text-center">No customers found</td>';
        tableBody.appendChild(row);
        return;
    }

    customers.forEach(customer => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${customer.codeNumber || '-'}</td>
            <td>${customer.name}</td>
            <td>${customer.cellNumber || '-'}</td>
            <td>${formatDate(customer.orderDate)}</td>
            <td>${formatDate(customer.returnDate)}</td>
            <td>
                <button class="btn btn-sm btn-info view-btn" data-id="${customer._id}">View</button>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${customer._id}">Edit</button>
                <button class="btn btn-sm btn-success print-btn" data-id="${customer._id}">Print</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function () {
            const customerId = this.getAttribute('data-id');
            // Open customer detail page
            window.location.href = `customer-detail.html?id=${customerId}`;
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const customerId = this.getAttribute('data-id');
            const customer = customers.find(c => c._id === customerId);

            if (customer) {
                showCustomerDetailsView(customer);
            }
        });
    });

    document.querySelectorAll('.print-btn').forEach(button => {
        button.addEventListener('click', function () {
            const customerId = this.getAttribute('data-id');
            // Open customer detail page with print mode
            window.location.href = `customer-detail.html?id=${customerId}&print=true`;
        });
    });
}

function formatDate(dateString) {
    if (!dateString) return '-';

    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function createCustomerDetailsForm(container, customer) {
    // Create a form with customer details for editing
    const form = document.createElement('div');

    // Build HTML content with safe string concatenation instead of template literals
    let htmlContent = '<h2>Customer Details</h2>';
    htmlContent += '<div class="row mb-4">';
    htmlContent += '<div class="col-md-6">';
    htmlContent += '<h4>Basic Information</h4>';
    htmlContent += '<p><strong>Code Number:</strong> ' + (customer.codeNumber || '-') + '</p>';
    htmlContent += '<p><strong>Name:</strong> ' + customer.name + '</p>';
    htmlContent += '<p><strong>Cell Number:</strong> ' + (customer.cellNumber || '-') + '</p>';
    htmlContent += '<p><strong>Address:</strong> ' + (customer.address || '-') + '</p>';
    htmlContent += '<p><strong>Order Date:</strong> ' + formatDate(customer.orderDate) + '</p>';
    htmlContent += '<p><strong>Return Date:</strong> ' + formatDate(customer.returnDate) + '</p>';
    htmlContent += '</div>';

    htmlContent += '<div class="col-md-6">';
    htmlContent += '<h4>Measurements</h4>';
    // Display measurement values
    if (customer.measurements) {
        htmlContent += '<p><strong>شلوار لمبائی:</strong> ' + (customer.measurements.shalwar_lambai || '-') + '</p>';
        htmlContent += '<p><strong>لمبائی:</strong> ' + (customer.measurements.lambai || '-') + '</p>';
        htmlContent += '<p><strong>آستین:</strong> ' + (customer.measurements.asteen || '-') + '</p>';
    } else {
        htmlContent += '<p>No measurement data available</p>';
    }
    htmlContent += '</div>';
    htmlContent += '</div>';

    htmlContent += '<div class="row">';
    htmlContent += '<div class="col-md-12 text-center">';
    htmlContent += '<button class="btn btn-primary edit-customer-btn">Edit Customer</button>';
    htmlContent += '<button class="btn btn-success ms-2 print-customer-btn">Print</button>';
    htmlContent += '<button class="btn btn-secondary ms-2 back-btn">Back to List</button>';
    htmlContent += '</div>';
    htmlContent += '</div>';

    form.innerHTML = htmlContent;

    container.appendChild(form);

    // Add event listeners
    container.querySelector('.edit-customer-btn').addEventListener('click', function () {
        // Load edit form with customer data
        loadEditForm(container, customer);
    });

    container.querySelector('.print-customer-btn').addEventListener('click', function () {
        printCustomerDetails(customer);
    });

    container.querySelector('.back-btn').addEventListener('click', showManageCustomersView);
}

function loadEditForm(container, customer) {
    // Create a form with input fields for editing
    // This would be similar to the add customer form but with values pre-filled
    // Then handle the update operations
    // For brevity, this function is omitted
}

function printCustomerDetails(customer) {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');

    // Create HTML content for printing
    const content = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Customer Measurements - ${customer.name}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                max-height: 80px;
            }
            .customer-info {
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
            }
            .customer-info div {
                flex: 1;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            table, th, td {
                border: 1px solid #ddd;
            }
            th, td {
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
            }
            .urdu-text {
                font-family: 'Noto Nastaliq Urdu', serif;
                direction: rtl;
                text-align: right;
            }
        </style>
    </head>
    <body>        <div class="header">
            <img src="../assets/img/logo-pic.png" alt="Noor & Sons Tailors And Fabrics">
            <h2>Noor & Sons Tailors And Fabrics</h2>
            <p>We offer you stitching of your choice</p>
        </div>
        
        <div class="customer-info">
            <div>
                <p><strong>Name:</strong> ${customer.name}</p>
                <p><strong>Cell Number:</strong> ${customer.cellNumber || '-'}</p>
                <p><strong>Code Number:</strong> ${customer.codeNumber || '-'}</p>
            </div>
            <div>
                <p><strong>Order Date:</strong> ${formatDate(customer.orderDate)}</p>
                <p><strong>Return Date:</strong> ${formatDate(customer.returnDate)}</p>
                <p><strong>Address:</strong> ${customer.address || '-'}</p>
            </div>
        </div>
        
        <h3>Measurements</h3>
        <table>
            <tr>
                <th class="urdu-text">میپ</th>
                <th>Value</th>
                <th class="urdu-text">میپ</th>
                <th>Value</th>
            </tr>
            <tr>
                <td class="urdu-text">شلوار لمبائی</td>
                <td>${customer.measurements?.shalwar_lambai || '-'}</td>
                <td class="urdu-text">لمبائی</td>
                <td>${customer.measurements?.lambai || '-'}</td>
            </tr>
            <tr>
                <td class="urdu-text">آستین</td>
                <td>${customer.measurements?.asteen || '-'}</td>
                <td class="urdu-text">تیرا</td>
                <td>${customer.measurements?.tera || '-'}</td>
            </tr>
            <!-- Add more measurement rows as needed -->
        </table>
        
        <div class="footer">
            <p>Thank you for choosing Noor & Sons Tailors And Fabrics.</p>
            <p>For any inquiries, please contact us.</p>
        </div>
    </body>
    </html>
    `;

    // Write content to new window
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();

    // Print after content is loaded
    printWindow.onload = function () {
        printWindow.print();
    };
}

// Set up event listeners for the collar type dropdown
function setupCollarTypeDropdown() {
    const collarTypeDropdown = document.getElementById('collar_type');
    const collarStyleDropdown = document.getElementById('collar_style');
    const collarBenLabel = document.getElementById('collar-ben-label');
    const collarBenOptions = document.querySelector('.collar-ben-options');

    if (!collarTypeDropdown || !collarStyleDropdown) {
        console.warn('Collar type dropdown elements not found');
        return; // Elements don't exist yet
    }

    collarTypeDropdown.addEventListener('change', function () {
        const selectedValue = this.value;

        // Clear previous options
        collarStyleDropdown.innerHTML = '<option value="">منتخب کریں</option>';

        if (selectedValue === 'بین') {
            collarBenLabel.textContent = 'بین اسٹائل';
            if (collarBenOptions) collarBenOptions.style.display = 'flex';

            // Add options for ben
            const benOptions = ["چورس", "کٹ", "گول"];
            benOptions.forEach(option => {
                const optElement = document.createElement('option');
                optElement.value = option;
                optElement.textContent = option;
                collarStyleDropdown.appendChild(optElement);
            });

        } else if (selectedValue === 'کالر') {
            collarBenLabel.textContent = 'کالر اسٹائل';
            if (collarBenOptions) collarBenOptions.style.display = 'flex';

            // Add options for collar
            const collarOptions = ["انگلش", "فرنچ", "نوک والا"];
            collarOptions.forEach(option => {
                const optElement = document.createElement('option');
                optElement.value = option;
                optElement.textContent = option;
                collarStyleDropdown.appendChild(optElement);
            });

        } else {
            collarBenLabel.textContent = 'اسٹائل';
            if (collarBenOptions) collarBenOptions.style.display = 'none';
        }
    });

    // Trigger the change event to initialize the dropdown correctly
    if (collarTypeDropdown.value) {
        collarTypeDropdown.dispatchEvent(new Event('change'));
    }
}
