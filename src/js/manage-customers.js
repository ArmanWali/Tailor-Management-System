// Check if user is logged in
document.addEventListener('DOMContentLoaded', function () {
    console.log('Manage Customers page loaded');

    try {
        // For development, we'll skip the user check
        console.log('Bypassing user check for development');

        // Set up event listeners
        setupEventListeners();

        // Load customers
        loadCustomers();
    } catch (error) {
        console.error('Error initializing manage customers page:', error);
    }
});

// Set up all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');

    // Back to dashboard button
    if (document.getElementById('back-to-dashboard')) {
        document.getElementById('back-to-dashboard').addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }

    // Logout link
    if (document.getElementById('logout-link')) {
        document.getElementById('logout-link').addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }

    // Search button
    if (document.getElementById('search-btn')) {
        document.getElementById('search-btn').addEventListener('click', function () {
            searchCustomers();
        });
    }
}

function loadCustomers() {
    console.log('Loading customers from localStorage');
    try {
        // Load customers from localStorage
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        console.log('Loaded customers:', customers);
        displayCustomers(customers);
    } catch (error) {
        console.error('Error loading customers:', error);
        alert('Error loading customer data');
    }
}

function searchCustomers() {
    console.log('Searching customers');

    try {
        const searchInput = document.getElementById('search-input');

        if (!searchInput) {
            console.error('search-input element not found');
            return;
        }

        const query = searchInput.value.trim();
        console.log('Search query:', query);

        if (query === '') {
            loadCustomers();
            return;
        }

        // Load customers from localStorage
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');

        // Filter customers based on name, code, or cell number containing the query
        const filteredCustomers = customers.filter(customer =>
            customer.name.toLowerCase().includes(query.toLowerCase()) ||
            customer.codeNumber.toLowerCase().includes(query.toLowerCase()) ||
            (customer.cellNumber && customer.cellNumber.includes(query))
        );

        // Display the filtered customers
        displayCustomers(filteredCustomers);
    } catch (error) {
        console.error('Error searching customers:', error);
    }
}

function displayCustomers(customers) {
    console.log('Displaying customers:', customers);

    try {
        const tableBody = document.getElementById('customers-table-body');

        if (!tableBody) {
            console.error('customers-table-body element not found');
            return;
        }

        // Clear existing rows
        tableBody.innerHTML = '';

        // Check if there are customers to display
        if (!customers || customers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="text-center">No customers found</td>';
            tableBody.appendChild(row);
            return;
        }
        // Add each customer as a row
        customers.forEach(customer => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${customer.codeNumber || '-'}</td>
                <td>${customer.name || '-'}</td>
                <td>${customer.cellNumber || '-'}</td>
                <td>${formatDate(customer.orderDate) || '-'}</td>
                <td>${formatDate(customer.returnDate) || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info view-btn" data-id="${customer.id || customer._id}">View</button>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${customer.id || customer._id}">Edit</button>
                    <button class="btn btn-sm btn-success print-btn" data-id="${customer.id || customer._id}">Print</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function () {
                const customerId = this.getAttribute('data-id');
                console.log('View button clicked for customer:', customerId);
                // Open customer detail page
                window.location.href = `customer-detail.html?id=${customerId}`;
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const customerId = this.getAttribute('data-id');
                console.log('Edit button clicked for customer:', customerId);
                // Open customer detail page in edit mode
                window.location.href = `customer-detail.html?id=${customerId}&edit=true`;
            });
        });
        document.querySelectorAll('.print-btn').forEach(button => {
            button.addEventListener('click', function () {
                const customerId = this.getAttribute('data-id');
                console.log('Print button clicked for customer:', customerId);
                // Find the customer from localStorage
                const customers = JSON.parse(localStorage.getItem('customers') || '[]');
                const customer = customers.find(c => (c.id || c._id) === customerId);
                if (customer) {
                    // Print customer details
                    printCustomerDetails(customer);
                } else {
                    alert('Customer not found');
                }
            });
        });
    } catch (error) {
        console.error('Error displaying customers:', error);
    }
}

function showCustomerDetailsView(customer) {
    console.log('Showing customer details view for:', customer);

    try {
        const manageCustomersView = document.getElementById('manage-customers-view');
        const customerDetailsView = document.getElementById('customer-details-view');

        if (manageCustomersView) manageCustomersView.classList.add('hidden');
        if (customerDetailsView) customerDetailsView.classList.remove('hidden');

        // Clear previous content
        if (customerDetailsView) {
            customerDetailsView.innerHTML = '';

            // Create customer details content
            const detailsContent = document.createElement('div');
            detailsContent.className = 'customer-details-content';

            detailsContent.innerHTML = `
                <h2>Customer Details</h2>
                <div class="row">
                    <div class="col-md-6">
                        <h4>Basic Information</h4>
                        <p><strong>Code Number:</strong> ${customer.codeNumber || '-'}</p>
                        <p><strong>Name:</strong> ${customer.name || '-'}</p>
                        <p><strong>Cell Number:</strong> ${customer.cellNumber || '-'}</p>
                        <p><strong>Order Date:</strong> ${formatDate(customer.orderDate)}</p>
                        <p><strong>Return Date:</strong> ${formatDate(customer.returnDate)}</p>
                    </div>
                    <div class="col-md-6">
                        <h4>Measurements</h4>
                        <p>Measurements would be displayed here</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12 text-center">
                        <button id="back-to-manage" class="btn btn-secondary">Back to List</button>
                        <button id="print-customer" class="btn btn-primary">Print</button>
                    </div>
                </div>
            `;

            customerDetailsView.appendChild(detailsContent);            // Add event listeners to the buttons
            const backButton = document.getElementById('back-to-manage');
            if (backButton) {
                backButton.addEventListener('click', function () {
                    if (manageCustomersView) manageCustomersView.classList.remove('hidden');
                    if (customerDetailsView) customerDetailsView.classList.add('hidden');
                });
            }

            const printButton = document.getElementById('print-customer');
            if (printButton) {
                printButton.addEventListener('click', function () {
                    printCustomerDetails(customer);
                });
            }
        }
    } catch (error) {
        console.error('Error showing customer details view:', error);
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

function printCustomerDetails(customer) {
    console.log('Printing customer details:', customer);

    try {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            console.error('Failed to open print window. Popup might be blocked.');
            alert('Failed to open print window. Please allow popups for this site.');
            return;
        }

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
                .customer-info {
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
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
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Noor & Sons Tailors</h1>
                <p>Customer Measurement Card</p>
            </div>
            
            <div class="customer-info">
                <p><strong>Name:</strong> ${customer.name || '-'}</p>
                <p><strong>Code Number:</strong> ${customer.codeNumber || '-'}</p>
                <p><strong>Cell Number:</strong> ${customer.cellNumber || '-'}</p>
                <p><strong>Order Date:</strong> ${formatDate(customer.orderDate)}</p>
                <p><strong>Return Date:</strong> ${formatDate(customer.returnDate)}</p>
            </div>
              <table>
                <thead>
                    <tr>
                        <th>Measurement</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateMeasurementRows(customer.measurements)}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Thank you for choosing Noor & Sons Tailors</p>
            </div>
        </body>
        </html>
        `;

        // Write content to the new window
        printWindow.document.open();
        printWindow.document.write(content);
        printWindow.document.close();

        // Print after content is loaded
        printWindow.onload = function () {
            printWindow.print();
        };
    } catch (error) {
        console.error('Error printing customer details:', error);
        alert('Error printing customer details. Please try again.');
    }
}

// Generate measurement rows for printing
function generateMeasurementRows(measurements) {
    if (!measurements) return '<tr><td colspan="2">No measurements available</td></tr>';

    const measurementLabels = {
        lambai: 'Lambai',
        asteen: 'Asteen',
        tera: 'Tera',
        collar_type: 'Collar Type',
        collar_style: 'Collar Style',
        chati: 'Chati',
        kamar: 'Kamar',
        gira: 'Gira',
        moza: 'Moza',
        front_pocket_size: 'Front Pocket Size',
        double_side_pocket: 'Double Side Pocket',
        single_pocket: 'Single Pocket',
        silai: 'Silai',
        front_pocket: 'Front Pocket',
        button_color: 'Button Color',
        button: 'Button',
        button_size: 'Button Size',
        cuff_plate: 'Cuff Plate',
        cuff_style: 'Cuff Style',
        cuff_kaj: 'Cuff Kaj',
        chak_patti: 'Chak Patti',
        chak_patti_kaj: 'Chak Patti Kaj',
        daman: 'Daman',
        shoulder_style: 'Shoulder Style',
        sleeve_type: 'Sleeve Type',
        gol_asteen: 'Gol Asteen',
        extra_demand: 'Extra Demand',
        shalwar_lambai: 'Shalwar Lambai',
        shalwar_type: 'Shalwar Type',
        shalwar: 'Shalwar',
        pacha: 'Pacha',
        lib: 'Lib',
        ander: 'Ander',
        shalwar_pocket: 'Shalwar Pocket',
        patti: 'Patti'
    };

    let rows = '';
    for (const [key, value] of Object.entries(measurements)) {
        if (value && value.trim() !== '') {
            const label = measurementLabels[key] || key;
            rows += `<tr><td>${label}</td><td>${value}</td></tr>`;
        }
    }

    return rows || '<tr><td colspan="2">No measurements available</td></tr>';
}

// Logout function
function logout() {
    console.log('Logging out');

    try {
        // Clear any stored user data
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');        // Redirect to login page
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try closing the application.');
    }
}
