// Get customer ID and mode from URL params
const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get('id');
const editMode = urlParams.get('edit') === 'true';
const printMode = urlParams.get('print') === 'true';

// Track current mode
let currentMode = editMode ? 'edit' : 'view';
let originalCustomerData = null;

// DOM elements for displaying/inputting customer data
const elements = {};

// Initialize elements after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    setupCollarDropdown();

    if (!customerId) {
        alert('Customer ID not provided');
        window.history.back();
        return;
    }

    // Load customer data
    loadCustomerData();
});

// Initialize all DOM elements
function initializeElements() {
    const elementIds = [
        'codeNumber', 'name', 'cellNumber', 'age', 'address', 'quantity',
        'cuttingNo', 'enteredBy', 'orderDate', 'returnDate',
        'lambai', 'asteen', 'tera', 'chati', 'kamar', 'gira', 'moza', 'gol_asteen',
        'collar_type', 'collar_measurement', 'collar_ben_width_churai', 'collar_style', 'ben_half_full', 'front_pocket_size', 'double_side_pocket',
        'single_pocket', 'front_pocket', 'silai', 'button_color', 'button',
        'button_size', 'cuff_plate', 'cuff_style', 'cuff_kaj', 'chak_patti', 'chak_patti_kaj', 'daman', 'shoulder_style', 'sleeve_type', 'extra_demand',
        'shalwar_lambai', 'shalwar_type', 'shalwar', 'pacha', 'lib', 'ander',
        'shalwar_pocket', 'patti', 'patti_churai'
    ];

    elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Edit button
    const editBtn = document.getElementById('edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            switchToEditMode();
        });
    }

    // Save button
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveCustomerChanges();
        });
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            cancelEdit();
        });
    }    // Print button
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const customerId = urlParams.get('id');

            if (customerId) {
                // Open the separate print form page
                const printUrl = `print-form.html?id=${customerId}`;
                window.open(printUrl, '_blank');
            } else {
                alert('No customer ID found. Cannot generate print form.');
            }
        });
    }
}

// Setup collar dropdown functionality
function setupCollarDropdown() {
    if (elements.collar_type) {
        elements.collar_type.addEventListener('change', function () {
            const collarBenOptions = document.getElementById('collar-ben-options');
            const collarBenLabel = document.getElementById('collar-ben-label');
            const collarStyleDropdown = elements.collar_style;
            const selectedValue = this.value;

            if (!collarStyleDropdown) return;

            // Clear previous options
            collarStyleDropdown.innerHTML = '<option value="">منتخب کریں</option>'; if (selectedValue === 'بین') {
                if (collarBenLabel) collarBenLabel.textContent = 'بین اسٹائل';
                if (collarBenOptions) collarBenOptions.classList.remove('hidden');

                // Add options for ben
                const benOptions = ["بین چورس تیار", "بین کٹ تیار", "بین گول تیار"];
                benOptions.forEach(option => {
                    const optElement = document.createElement('option');
                    optElement.value = option;
                    optElement.textContent = option;
                    collarStyleDropdown.appendChild(optElement);
                });

                // Show ben half/full dropdown
                const benHalfFullOptions = document.getElementById('ben-half-full-options');
                if (benHalfFullOptions) {
                    benHalfFullOptions.classList.remove('hidden');
                }
            } else if (selectedValue === 'کالر') {
                if (collarBenLabel) collarBenLabel.textContent = 'کالر اسٹائل';
                if (collarBenOptions) collarBenOptions.classList.remove('hidden');

                // Add options for collar
                const collarOptions = ["کالر انگلش", "کالر فرنچ", "کالر نوک والا"];
                collarOptions.forEach(option => {
                    const optElement = document.createElement('option');
                    optElement.value = option;
                    optElement.textContent = option;
                    collarStyleDropdown.appendChild(optElement);
                });

                // Hide ben half/full dropdown for collar
                const benHalfFullOptions = document.getElementById('ben-half-full-options');
                if (benHalfFullOptions) {
                    benHalfFullOptions.classList.add('hidden');
                    // Reset the dropdown value
                    if (elements.ben_half_full) {
                        elements.ben_half_full.value = '';
                    }
                }
            } else {
                if (collarBenLabel) collarBenLabel.textContent = 'اسٹائل';
                if (collarBenOptions) collarBenOptions.classList.add('hidden');

                // Hide ben half/full dropdown for other selections
                const benHalfFullOptions = document.getElementById('ben-half-full-options');
                if (benHalfFullOptions) {
                    benHalfFullOptions.classList.add('hidden');
                    // Reset the dropdown value
                    if (elements.ben_half_full) {
                        elements.ben_half_full.value = '';
                    }
                }
            }
        });
    }
}

// Load customer data from localStorage
function loadCustomerData() {
    try {
        console.log('Loading customer data for ID:', customerId);

        // Get customers from localStorage
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        console.log('All customers:', customers);

        // Find the customer with matching ID
        const customer = customers.find(c => (c.id || c._id) === customerId);

        if (customer) {
            console.log('Found customer:', customer);
            originalCustomerData = JSON.parse(JSON.stringify(customer)); // Deep copy
            displayCustomerData(customer);

            // Set initial mode
            if (editMode) {
                switchToEditMode();
            } else {
                switchToViewMode();
            }

            // Automatically print if in print mode
            if (printMode) {
                setTimeout(() => {
                    try {
                        generatePDF();
                    } catch (error) {
                        console.error('PDF generation failed, using browser print:', error);
                        window.print();
                    }

                    // Go back to previous page after print dialog is closed
                    setTimeout(() => {
                        window.history.back();
                    }, 1000);
                }, 1000);
            }
        } else {
            console.error('Customer not found with ID:', customerId);
            alert('Failed to load customer data - Customer not found');
            window.history.back();
        }
    } catch (error) {
        console.error('Error loading customer data:', error);
        alert('Failed to load customer data');
        window.history.back();
    }
}

// Helper function to safely set element value
function safeSetValue(element, value) {
    if (element && element.value !== undefined) {
        element.value = value || '';
    }
}

// Display customer data in the view
function displayCustomerData(customer) {
    try {
        // Set document title and page title
        document.title = `Customer: ${customer.name} - Noor & Sons Tailors`;
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = `Customer Details - ${customer.name}`;
        }

        // Display basic info
        safeSetValue(elements.codeNumber, customer.codeNumber);
        safeSetValue(elements.name, customer.name);
        safeSetValue(elements.cellNumber, customer.cellNumber);
        safeSetValue(elements.age, customer.age);
        safeSetValue(elements.address, customer.address);
        safeSetValue(elements.quantity, customer.quantity);
        safeSetValue(elements.cuttingNo, customer.cuttingNo);
        safeSetValue(elements.enteredBy, customer.enteredBy);
        safeSetValue(elements.orderDate, customer.orderDate);
        safeSetValue(elements.returnDate, customer.returnDate);

        // Display measurements
        if (customer.measurements) {
            const m = customer.measurements;

            // Shirt measurements
            safeSetValue(elements.lambai, m.lambai);
            safeSetValue(elements.asteen, m.asteen);
            safeSetValue(elements.tera, m.tera);
            safeSetValue(elements.chati, m.chati);
            safeSetValue(elements.kamar, m.kamar);
            safeSetValue(elements.gira, m.gira);
            safeSetValue(elements.moza, m.moza);
            safeSetValue(elements.gol_asteen, m.gol_asteen);            // Collar type and style
            safeSetValue(elements.collar_type, m.collar_type);
            safeSetValue(elements.collar_measurement, m.collar_measurement);
            safeSetValue(elements.collar_ben_width_churai, m.collar_ben_width_churai);
            if (elements.collar_type) {
                elements.collar_type.dispatchEvent(new Event('change'));
                setTimeout(() => {
                    safeSetValue(elements.collar_style, m.collar_style || m.ben_style);
                    safeSetValue(elements.ben_half_full, m.ben_half_full);
                }, 100);
            }

            // Pocket details
            safeSetValue(elements.front_pocket_size, m.front_pocket_size);
            safeSetValue(elements.double_side_pocket, m.double_side_pocket);
            safeSetValue(elements.single_pocket, m.single_pocket);
            safeSetValue(elements.front_pocket, m.front_pocket);

            // Sewing and buttons
            safeSetValue(elements.silai, m.silai);
            safeSetValue(elements.button_color, m.button_color);
            safeSetValue(elements.button, m.button);
            safeSetValue(elements.button_size, m.button_size);

            // Cuff options
            safeSetValue(elements.cuff_plate, m.cuff_plate);
            safeSetValue(elements.cuff_style, m.cuff_style);
            safeSetValue(elements.cuff_kaj, m.cuff_kaj);
            safeSetValue(elements.chak_patti, m.chak_patti);
            safeSetValue(elements.chak_patti_kaj, m.chak_patti_kaj);
            safeSetValue(elements.daman, m.daman);
            safeSetValue(elements.shoulder_style, m.shoulder_style);
            safeSetValue(elements.sleeve_type, m.sleeve_type);
            safeSetValue(elements.extra_demand, m.extra_demand);

            // Trouser measurements
            safeSetValue(elements.shalwar_lambai, m.shalwar_lambai);
            safeSetValue(elements.shalwar_type, m.shalwar_type);
            safeSetValue(elements.shalwar, m.shalwar);
            safeSetValue(elements.pacha, m.pacha);
            safeSetValue(elements.lib, m.lib); safeSetValue(elements.ander, m.ander);
            safeSetValue(elements.shalwar_pocket, m.shalwar_pocket);
            safeSetValue(elements.patti, m.patti);
            safeSetValue(elements.patti_churai, m.patti_churai);
        }

        console.log('Customer data displayed successfully');
    } catch (error) {
        console.error('Error displaying customer data:', error);
        alert('Error displaying customer data. Some fields may not be shown correctly.');
    }
}

// Switch to edit mode
function switchToEditMode() {
    currentMode = 'edit';

    // Update UI elements
    const modeIndicator = document.getElementById('mode-indicator');
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn'); if (modeIndicator) {
        modeIndicator.textContent = 'Edit Mode';
        modeIndicator.className = 'badge bg-warning me-2';
    }

    if (editBtn) editBtn.classList.add('hidden');
    if (saveBtn) saveBtn.classList.remove('hidden');
    if (cancelBtn) cancelBtn.classList.remove('hidden');

    // Enable all form fields except enteredBy and codeNumber
    enableFormFields();

    console.log('Switched to edit mode');
}

// Switch to view mode
function switchToViewMode() {
    currentMode = 'view';

    // Update UI elements
    const modeIndicator = document.getElementById('mode-indicator');
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn'); if (modeIndicator) {
        modeIndicator.textContent = 'View Mode';
        modeIndicator.className = 'badge bg-info me-2';
    }

    if (editBtn) editBtn.classList.remove('hidden');
    if (saveBtn) saveBtn.classList.add('hidden');
    if (cancelBtn) cancelBtn.classList.add('hidden');

    // Disable all form fields
    disableFormFields();

    console.log('Switched to view mode');
}

// Enable form fields for editing
function enableFormFields() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Don't enable codeNumber and enteredBy fields
        if (input.id !== 'codeNumber' && input.id !== 'enteredBy') {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.classList.remove('read-only-field');
        }
    });
}

// Disable form fields for view mode
function disableFormFields() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.tagName.toLowerCase() === 'input' || input.tagName.toLowerCase() === 'textarea') {
            input.setAttribute('readonly', true);
        } else if (input.tagName.toLowerCase() === 'select') {
            input.setAttribute('disabled', true);
        }
        input.classList.add('read-only-field');
    });
}

// Save customer changes
function saveCustomerChanges() {
    try {
        console.log('Saving customer changes');

        // Validate required fields
        if (!elements.name.value || !elements.cellNumber.value || !elements.orderDate.value) {
            alert('Please fill in all required fields (Name, Cell Number, Order Date)');
            return;
        }

        // Get updated customer data
        const updatedCustomer = {
            ...originalCustomerData,
            // Basic info
            name: elements.name.value,
            cellNumber: elements.cellNumber.value,
            age: elements.age.value,
            address: elements.address.value,
            quantity: elements.quantity.value,
            cuttingNo: elements.cuttingNo.value,
            orderDate: elements.orderDate.value,
            returnDate: elements.returnDate.value,
            lastModified: new Date().toISOString(),

            // Measurements
            measurements: {
                lambai: elements.lambai.value,
                asteen: elements.asteen.value,
                tera: elements.tera.value,
                chati: elements.chati.value,
                kamar: elements.kamar.value,
                gira: elements.gira.value, moza: elements.moza.value,
                gol_asteen: elements.gol_asteen.value,
                collar_type: elements.collar_type.value,
                collar_measurement: elements.collar_measurement.value,
                collar_ben_width_churai: elements.collar_ben_width_churai.value,
                collar_style: elements.collar_style.value,
                ben_half_full: elements.ben_half_full.value,
                front_pocket_size: elements.front_pocket_size.value,
                double_side_pocket: elements.double_side_pocket.value,
                single_pocket: elements.single_pocket.value,
                front_pocket: elements.front_pocket.value,
                silai: elements.silai.value,
                button_color: elements.button_color.value,
                button: elements.button.value,
                button_size: elements.button_size.value,
                cuff_plate: elements.cuff_plate.value,
                cuff_style: elements.cuff_style.value,
                cuff_kaj: elements.cuff_kaj.value,
                chak_patti: elements.chak_patti.value,
                chak_patti_kaj: elements.chak_patti_kaj.value,
                daman: elements.daman.value,
                shoulder_style: elements.shoulder_style.value,
                sleeve_type: elements.sleeve_type.value,
                extra_demand: elements.extra_demand.value,
                shalwar_lambai: elements.shalwar_lambai.value,
                shalwar_type: elements.shalwar_type.value,
                shalwar: elements.shalwar.value,
                pacha: elements.pacha.value,
                lib: elements.lib.value, ander: elements.ander.value,
                shalwar_pocket: elements.shalwar_pocket.value,
                patti: elements.patti.value,
                patti_churai: elements.patti_churai.value
            }
        };

        // Update localStorage
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const customerIndex = customers.findIndex(c => (c.id || c._id) === customerId);

        if (customerIndex !== -1) {
            customers[customerIndex] = updatedCustomer;
            localStorage.setItem('customers', JSON.stringify(customers));

            // Update original data
            originalCustomerData = JSON.parse(JSON.stringify(updatedCustomer));

            alert('Customer data updated successfully!');
            switchToViewMode();

            console.log('Customer data saved successfully');
        } else {
            throw new Error('Customer not found in storage');
        }

    } catch (error) {
        console.error('Error saving customer data:', error);
        alert('Error saving customer data. Please try again.');
    }
}

// Cancel edit mode
function cancelEdit() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        // Restore original data
        displayCustomerData(originalCustomerData);
        switchToViewMode();
    }
}


