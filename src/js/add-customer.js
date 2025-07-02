// Check if user is logged in
document.addEventListener('DOMContentLoaded', function () {
    console.log('Add Customer page loaded');

    try {
        // For development, we'll skip the user check
        console.log('Bypassing user check for development');

        // Auto-set current date for order date field
        const orderDateInput = document.getElementById('orderDate');
        if (orderDateInput) {
            orderDateInput.valueAsDate = new Date();
            console.log('Set order date to today');
        }

        // Auto-generate code number
        generateCodeNumber();

        // Set up event listeners
        setupEventListeners();

        // Set up collar type dropdown
        setupCollarTypeDropdown();

        // Set up cuff plate dropdown
        setupCuffPlateDropdown();
    } catch (error) {
        console.error('Error initializing add customer page:', error);
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

    // Customer form submission
    if (document.getElementById('customer-form')) {
        document.getElementById('customer-form').addEventListener('submit', function (e) {
            e.preventDefault();
            saveCustomer();
        });
    }
}

// Setup collar type dropdown
function setupCollarTypeDropdown() {
    console.log('Setting up collar type dropdown');

    try {
        const collarTypeDropdown = document.getElementById('collar_type');
        const collarStyleDropdown = document.getElementById('collar_style');

        if (!collarTypeDropdown) {
            console.error('collar_type dropdown not found');
            return;
        }

        collarTypeDropdown.addEventListener('change', function () {
            console.log('Collar type changed to:', this.value);            // Update collar style options based on collar type
            if (this.value === 'کالر') {
                console.log('Showing collar style dropdown');
                // Set up collar style options
                if (collarStyleDropdown) {
                    collarStyleDropdown.innerHTML = `
                        <option value="">منتخب کریں</option>
                        <option value="کالر انگلش">کالر انگلش</option>
                        <option value="کالر فرنچ">کالر فرنچ</option>
                        <option value="کالر نوک والا">کالر نوک والا</option>
                    `;

                    // Update label
                    const label = document.getElementById('collar-ben-label');
                    if (label) label.textContent = 'کالر اسٹائل';
                }
            } else if (this.value === 'بین') {
                console.log('Showing ben style dropdown');
                // Set up ben style options
                if (collarStyleDropdown) {
                    collarStyleDropdown.innerHTML = `
                        <option value="">منتخب کریں</option>
                        <option value="بین گول تیار">بین گول تیار</option>
                        <option value="بین کٹ تیار">بین کٹ تیار</option>
                        <option value="بین چورس تیار">بین چورس تیار</option>
                    `;

                    // Update label
                    const label = document.getElementById('collar-ben-label');
                    if (label) label.textContent = 'بین اسٹائل';
                }

                // Show ben half/full dropdown
                const benHalfFullOptions = document.getElementById('ben-half-full-options');
                if (benHalfFullOptions) {
                    benHalfFullOptions.classList.remove('hidden');
                }
            } else {
                // Hide ben half/full dropdown for other selections
                const benHalfFullOptions = document.getElementById('ben-half-full-options');
                if (benHalfFullOptions) {
                    benHalfFullOptions.classList.add('hidden');
                    // Reset the dropdown value
                    const benHalfFullDropdown = document.getElementById('ben_half_full');
                    if (benHalfFullDropdown) {
                        benHalfFullDropdown.value = '';
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error setting up collar type dropdown:', error);
    }
}

// Setup cuff plate dropdown functionality
function setupCuffPlateDropdown() {
    console.log('Setting up cuff plate dropdown');

    try {
        const cuffPlateDropdown = document.getElementById('cuff_plate');
        const golAsteenField = document.getElementById('gol_asteen');

        console.log('Cuff plate dropdown found:', !!cuffPlateDropdown);
        console.log('Gol asteen field found:', !!golAsteenField);

        if (!cuffPlateDropdown) {
            console.error('cuff_plate dropdown not found');
            return;
        }

        if (!golAsteenField) {
            console.error('gol_asteen field not found');
            return;
        }

        // Try different methods to find the container
        let golAsteenContainer = golAsteenField.closest('.col-md-3');

        // If col-md-3 doesn't work, try other common Bootstrap classes
        if (!golAsteenContainer) {
            golAsteenContainer = golAsteenField.closest('.col');
        }

        // If still not found, try parent element
        if (!golAsteenContainer) {
            golAsteenContainer = golAsteenField.parentElement;
        }

        console.log('Gol asteen container found:', !!golAsteenContainer);
        console.log('Container class:', golAsteenContainer ? golAsteenContainer.className : 'none');

        if (!golAsteenContainer) {
            console.error('gol_asteen container not found');
            return;
        }

        // Initially hide gol_asteen field
        golAsteenContainer.style.display = 'none';
        console.log('Initially hid gol_asteen field');

        cuffPlateDropdown.addEventListener('change', function () {
            console.log('Cuff plate changed to:', this.value);

            if (this.value === 'NO') {
                console.log('Showing گول آستین option');
                golAsteenContainer.style.display = 'block';
                console.log('Set display to block');
            } else {
                console.log('Hiding گول آستین option');
                golAsteenContainer.style.display = 'none';
                // Reset the field value when hiding
                golAsteenField.value = '';
                console.log('Set display to none and cleared value');
            }
        });

        // Check initial state
        console.log('Initial cuff plate value:', cuffPlateDropdown.value);
        if (cuffPlateDropdown.value === 'NO') {
            golAsteenContainer.style.display = 'block';
            console.log('Set initial display to block for NO value');
        }
    } catch (error) {
        console.error('Error setting up cuff plate dropdown:', error);
    }
}

// Customer save operation
function saveCustomer() {
    console.log('Saving customer');

    try {
        // Get form values
        const customerData = {
            codeNumber: document.getElementById('codeNumber') ? document.getElementById('codeNumber').value : '',
            orderDate: document.getElementById('orderDate') ? document.getElementById('orderDate').value : '',
            name: document.getElementById('name') ? document.getElementById('name').value : '',
            returnDate: document.getElementById('returnDate') ? document.getElementById('returnDate').value : '',
            cellNumber: document.getElementById('cellNumber') ? document.getElementById('cellNumber').value : '',
            address: document.getElementById('address') ? document.getElementById('address').value : '',
            age: document.getElementById('age') ? document.getElementById('age').value : '',
            cuttingNo: document.getElementById('cuttingNo') ? document.getElementById('cuttingNo').value : '',
            quantity: document.getElementById('quantity') ? document.getElementById('quantity').value : '',
            enteredBy: document.getElementById('enteredBy') ? document.getElementById('enteredBy').value : 'User',

            // Measurements
            measurements: {
                lambai: document.getElementById('lambai') ? document.getElementById('lambai').value : '',
                asteen: document.getElementById('asteen') ? document.getElementById('asteen').value : '',
                tera: document.getElementById('tera') ? document.getElementById('tera').value : '', collar_type: document.getElementById('collar_type') ? document.getElementById('collar_type').value : '', collar_measurement: document.getElementById('collar_measurement') ? document.getElementById('collar_measurement').value : '',
                collar_ben_width_churai: document.getElementById('collar_ben_width_churai') ? document.getElementById('collar_ben_width_churai').value : '',
                collar_style: document.getElementById('collar_style') ? document.getElementById('collar_style').value : '',
                ben_half_full: document.getElementById('ben_half_full') ? document.getElementById('ben_half_full').value : '',
                chati: document.getElementById('chati') ? document.getElementById('chati').value : '',
                kamar: document.getElementById('kamar') ? document.getElementById('kamar').value : '',
                gira: document.getElementById('gira') ? document.getElementById('gira').value : '',
                moza: document.getElementById('moza') ? document.getElementById('moza').value : '',
                front_pocket_size: document.getElementById('front_pocket_size') ? document.getElementById('front_pocket_size').value : '', double_side_pocket: document.getElementById('double_side_pocket') ? document.getElementById('double_side_pocket').value : '',
                silai: document.getElementById('silai') ? document.getElementById('silai').value : '',
                front_pocket: document.getElementById('front_pocket') ? document.getElementById('front_pocket').value : '',
                button_color: document.getElementById('button_color') ? document.getElementById('button_color').value : '',
                button: document.getElementById('button') ? document.getElementById('button').value : '',
                button_size: document.getElementById('button_size') ? document.getElementById('button_size').value : '',
                cuff_plate: document.getElementById('cuff_plate') ? document.getElementById('cuff_plate').value : '',
                cuff_style: document.getElementById('cuff_style') ? document.getElementById('cuff_style').value : '', cuff_kaj: document.getElementById('cuff_kaj') ? document.getElementById('cuff_kaj').value : '',
                cuff_length: document.getElementById('cuff_length') ? document.getElementById('cuff_length').value : '',
                chak_patti: document.getElementById('chak_patti') ? document.getElementById('chak_patti').value : '',
                chak_patti_kaj: document.getElementById('chak_patti_kaj') ? document.getElementById('chak_patti_kaj').value : '',
                daman: document.getElementById('daman') ? document.getElementById('daman').value : '',
                shoulder_style: document.getElementById('shoulder_style') ? document.getElementById('shoulder_style').value : '',
                sleeve_type: document.getElementById('sleeve_type') ? document.getElementById('sleeve_type').value : '',
                gol_asteen: document.getElementById('gol_asteen') ? document.getElementById('gol_asteen').value : '',
                extra_demand: document.getElementById('extra_demand') ? document.getElementById('extra_demand').value : '',
                shalwar_lambai: document.getElementById('shalwar_lambai') ? document.getElementById('shalwar_lambai').value : '', shalwar_type: document.getElementById('shalwar_type') ? document.getElementById('shalwar_type').value : '',
                pacha: document.getElementById('pacha') ? document.getElementById('pacha').value : '',
                lib: document.getElementById('lib') ? document.getElementById('lib').value : '', ander: document.getElementById('ander') ? document.getElementById('ander').value : '', shalwar_pocket: document.getElementById('shalwar_pocket') ? document.getElementById('shalwar_pocket').value : '', patti: document.getElementById('patti') ? document.getElementById('patti').value : '',
                gum_patti: document.getElementById('gum_patti') ? document.getElementById('gum_patti').value : '',
                patti_churai: document.getElementById('patti_churai') ? document.getElementById('patti_churai').value : '',
                patti_lambai: document.getElementById('patti_lambai') ? document.getElementById('patti_lambai').value : ''
            }
        };
        console.log('Customer data prepared:', customerData);

        // Validate required fields
        if (!customerData.name || !customerData.cellNumber || !customerData.orderDate) {
            alert('Please fill in all required fields (Name, Cell Number, Order Date)');
            return;
        }

        // Generate unique ID
        customerData.id = 'C_' + Date.now();
        customerData.createdAt = new Date().toISOString();        // Save to localStorage
        try {
            let customers = JSON.parse(localStorage.getItem('customers') || '[]'); customers.push(customerData);
            localStorage.setItem('customers', JSON.stringify(customers));

            console.log('Customer saved successfully to localStorage');

            alert('Customer saved successfully!');

            // Reset form
            const form = document.getElementById('customer-form');
            if (form) form.reset();

            // Set order date back to today
            const orderDateInput = document.getElementById('orderDate');
            if (orderDateInput) {
                orderDateInput.valueAsDate = new Date();
            }

            // Redirect to manage customers page to see the saved data
            window.location.href = 'manage-customers.html';
        } catch (storageError) {
            console.error('Error saving to localStorage:', storageError);
            alert('Error saving customer data. Please try again.');
        }
    } catch (error) {
        console.error('Error saving customer:', error);
        alert('Error saving customer. Please try again.');
    }
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

// Generate unique code number
function generateCodeNumber() {
    try {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const nextNumber = customers.length + 1;
        const codeNumber = 'C' + nextNumber.toString().padStart(3, '0');

        const codeNumberInput = document.getElementById('codeNumber');
        if (codeNumberInput) {
            codeNumberInput.value = codeNumber;
            console.log('Generated code number:', codeNumber);
        }
    } catch (error) {
        console.error('Error generating code number:', error);
    }
}
