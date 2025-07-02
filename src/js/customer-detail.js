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
    setupCuffPlateDropdown();

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
        'front_pocket', 'silai', 'button_color', 'button',
        'button_size', 'cuff_plate', 'cuff_style', 'cuff_kaj', 'cuff_length', 'chak_patti', 'chak_patti_kaj', 'daman', 'shoulder_style', 'sleeve_type', 'extra_demand',
        'shalwar_lambai', 'shalwar_type', 'pacha', 'lib', 'ander',
        'shalwar_pocket', 'patti', 'gum_patti', 'patti_churai', 'patti_lambai'
    ]; elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
        if (!elements[id]) {
            console.warn(`⚠️ Element with ID '${id}' not found in DOM`);
        }
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
    }

    // Print button - Updated to use print preview
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            openPrintPreview();
        });
    }
}

// Setup collar dropdown functionality
function setupCollarDropdown() {
    if (elements.collar_type) {
        elements.collar_type.addEventListener('change', function () {
            const collarBenOptions = document.getElementById('collar-ben-options');
            const collarBenLabel = document.getElementById('collar_ben_label');
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

// Safe get value function
function safeGetValue(element) {
    if (!element) {
        console.warn('Element is null in safeGetValue');
        return '';
    }
    if (element.value === undefined) {
        console.warn('Element value is undefined in safeGetValue:', element);
        return '';
    }
    return element.value || '';
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
            }            // Pocket details
            safeSetValue(elements.front_pocket_size, m.front_pocket_size);
            safeSetValue(elements.double_side_pocket, m.double_side_pocket);
            safeSetValue(elements.front_pocket, m.front_pocket);

            // Sewing and buttons
            safeSetValue(elements.silai, m.silai);
            safeSetValue(elements.button_color, m.button_color);
            safeSetValue(elements.button, m.button);
            safeSetValue(elements.button_size, m.button_size);            // Cuff options
            safeSetValue(elements.cuff_plate, m.cuff_plate);
            // Trigger cuff plate visibility check after data is loaded
            if (elements.cuff_plate) {
                elements.cuff_plate.dispatchEvent(new Event('change'));
            }
            safeSetValue(elements.cuff_style, m.cuff_style); safeSetValue(elements.cuff_kaj, m.cuff_kaj);
            safeSetValue(elements.cuff_length, m.cuff_length);
            safeSetValue(elements.chak_patti, m.chak_patti);
            safeSetValue(elements.chak_patti_kaj, m.chak_patti_kaj);
            safeSetValue(elements.daman, m.daman);
            safeSetValue(elements.shoulder_style, m.shoulder_style);
            safeSetValue(elements.sleeve_type, m.sleeve_type);
            safeSetValue(elements.extra_demand, m.extra_demand);            // Trouser measurements
            safeSetValue(elements.shalwar_lambai, m.shalwar_lambai);
            safeSetValue(elements.shalwar_type, m.shalwar_type);
            safeSetValue(elements.pacha, m.pacha);
            safeSetValue(elements.lib, m.lib); safeSetValue(elements.ander, m.ander);
            safeSetValue(elements.shalwar_pocket, m.shalwar_pocket); safeSetValue(elements.patti, m.patti);
            safeSetValue(elements.gum_patti, m.gum_patti);
            safeSetValue(elements.patti_churai, m.patti_churai);
            safeSetValue(elements.patti_lambai, m.patti_lambai);
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
        console.log('Saving customer changes');        // Validate required fields
        if (!elements.name || !elements.name.value || !elements.cellNumber || !elements.cellNumber.value || !elements.orderDate || !elements.orderDate.value) {
            alert('Please fill in all required fields (Name, Cell Number, Order Date)');
            return;
        }

        // Get updated customer data
        const updatedCustomer = {
            ...originalCustomerData,            // Basic info
            name: safeGetValue(elements.name),
            cellNumber: safeGetValue(elements.cellNumber),
            age: safeGetValue(elements.age),
            address: safeGetValue(elements.address),
            quantity: safeGetValue(elements.quantity),
            cuttingNo: safeGetValue(elements.cuttingNo),
            orderDate: safeGetValue(elements.orderDate),
            returnDate: safeGetValue(elements.returnDate),
            lastModified: new Date().toISOString(),            // Measurements
            measurements: {
                lambai: safeGetValue(elements.lambai),
                asteen: safeGetValue(elements.asteen),
                tera: safeGetValue(elements.tera),
                chati: safeGetValue(elements.chati),
                kamar: safeGetValue(elements.kamar),
                gira: safeGetValue(elements.gira),
                moza: safeGetValue(elements.moza),
                gol_asteen: safeGetValue(elements.gol_asteen),
                collar_type: safeGetValue(elements.collar_type),
                collar_measurement: safeGetValue(elements.collar_measurement),
                collar_ben_width_churai: safeGetValue(elements.collar_ben_width_churai),
                collar_style: safeGetValue(elements.collar_style),
                ben_half_full: safeGetValue(elements.ben_half_full), front_pocket_size: safeGetValue(elements.front_pocket_size),
                double_side_pocket: safeGetValue(elements.double_side_pocket),
                front_pocket: safeGetValue(elements.front_pocket),
                silai: safeGetValue(elements.silai),
                button_color: safeGetValue(elements.button_color),
                button: safeGetValue(elements.button),
                button_size: safeGetValue(elements.button_size),
                cuff_plate: safeGetValue(elements.cuff_plate),
                cuff_style: safeGetValue(elements.cuff_style),
                cuff_kaj: safeGetValue(elements.cuff_kaj),
                cuff_length: safeGetValue(elements.cuff_length),
                chak_patti: safeGetValue(elements.chak_patti),
                chak_patti_kaj: safeGetValue(elements.chak_patti_kaj),
                daman: safeGetValue(elements.daman),
                shoulder_style: safeGetValue(elements.shoulder_style),
                sleeve_type: safeGetValue(elements.sleeve_type),
                extra_demand: safeGetValue(elements.extra_demand), shalwar_lambai: safeGetValue(elements.shalwar_lambai),
                shalwar_type: safeGetValue(elements.shalwar_type),
                pacha: safeGetValue(elements.pacha),
                lib: safeGetValue(elements.lib),
                ander: safeGetValue(elements.ander),
                shalwar_pocket: safeGetValue(elements.shalwar_pocket), patti: safeGetValue(elements.patti),
                gum_patti: safeGetValue(elements.gum_patti),
                patti_churai: safeGetValue(elements.patti_churai),
                patti_lambai: safeGetValue(elements.patti_lambai)
            }
        };

        // Update localStorage
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const customerIndex = customers.findIndex(c => (c.id || c._id) === customerId); if (customerIndex !== -1) {
            customers[customerIndex] = updatedCustomer;
            localStorage.setItem('customers', JSON.stringify(customers));            // Update original data
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

// ===================== NEW PRINT PREVIEW FUNCTIONS =====================

// Open live print preview window
function openPrintPreview() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');

    if (!customerId) {
        alert('No customer ID found. Cannot open print preview.');
        return;
    }

    // Use Electron API to open print preview
    if (window.electronAPI && window.electronAPI.openPrintPreview) {
        window.electronAPI.openPrintPreview(customerId);
    } else {
        // Fallback: open in new window/tab
        const printPreviewUrl = `print-preview.html?id=${customerId}`;
        window.open(printPreviewUrl, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
    }
}

// Print directly without preview
function printDirectly() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');

    if (!customerId) {
        alert('No customer ID found. Cannot print.');
        return;
    }

    // Open print preview first, then trigger print
    if (window.electronAPI && window.electronAPI.openPrintPreview) {
        window.electronAPI.openPrintPreview(customerId);
        // The print preview window will handle the printing
    } else {
        // Fallback: open legacy print form
        const printUrl = `print-form.html?id=${customerId}`;
        window.open(printUrl, '_blank');
    }
}

// Export current form to PDF
function exportToPDF() {
    if (window.electronAPI && window.electronAPI.exportToPDF) {
        // Listen for export response
        window.electronAPI.onExportPDFResponse((response) => {
            if (response.success) {
                alert(`PDF saved successfully to: ${response.path}`);
            } else {
                alert(`Error exporting PDF: ${response.error}`);
            }
        });

        // Trigger PDF export
        window.electronAPI.exportToPDF();
    } else {
        alert('PDF export is only available in the desktop app.');
    }
}

// Open legacy print form (backup)
function openLegacyPrintForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');

    if (customerId) {
        const printUrl = `print-form.html?id=${customerId}`;
        window.open(printUrl, '_blank');
    } else {
        alert('No customer ID found. Cannot generate print form.');
    }
}

// Quick print function (can be called from anywhere)
function quickPrint() {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');

    if (!customerId) {
        alert('No customer ID found. Cannot print.');
        return;
    }

    openPrintPreview();
}

// Keyboard shortcut handler
document.addEventListener('keydown', function (e) {
    // Ctrl+P or Cmd+P for print preview
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        openPrintPreview();
    }

    // Ctrl+Shift+P for direct print
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        printDirectly();
    }

    // Ctrl+E for export PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportToPDF();
    }
});

// Make functions available globally
window.openPrintPreview = openPrintPreview;
window.printDirectly = printDirectly;
window.exportToPDF = exportToPDF;
window.openLegacyPrintForm = openLegacyPrintForm;
window.quickPrint = quickPrint;

// Setup cuff plate dropdown functionality
function setupCuffPlateDropdown() {
    console.log('Setting up cuff plate dropdown');

    try {
        const cuffPlateDropdown = elements.cuff_plate;
        const golAsteenField = elements.gol_asteen;

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

        // Check initial state based on current value
        console.log('Initial cuff plate value:', cuffPlateDropdown.value);
        if (cuffPlateDropdown.value === 'NO') {
            golAsteenContainer.style.display = 'block';
            console.log('Set initial display to block for NO value');
        }
    } catch (error) {
        console.error('Error setting up cuff plate dropdown:', error);
    }
}


