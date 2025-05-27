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
        
        // Set up event listeners
        setupEventListeners();
        
        // Set up collar type dropdown
        setupCollarTypeDropdown();
    } catch (error) {
        console.error('Error initializing add customer page:', error);
    }
});

// Set up all event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Logout link
    if (document.getElementById('logout-link')) {
        document.getElementById('logout-link').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Customer form submission
    if (document.getElementById('customer-form')) {
        document.getElementById('customer-form').addEventListener('submit', function(e) {
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
        
        collarTypeDropdown.addEventListener('change', function() {
            console.log('Collar type changed to:', this.value);
            
            // Update collar style options based on collar type
            if (this.value === 'کالر') {
                console.log('Showing collar style dropdown');
                // Set up collar style options
                if (collarStyleDropdown) {
                    collarStyleDropdown.innerHTML = `
                        <option value="">منتخب کریں</option>
                        <option value="بینڈ">بینڈ</option>
                        <option value="کٹ">کٹ</option>
                        <option value="چورس">چورس</option>
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
                        <option value="گول">گول</option>
                        <option value="وی شیپ">وی شیپ</option>
                    `;
                    
                    // Update label
                    const label = document.getElementById('collar-ben-label');
                    if (label) label.textContent = 'بین اسٹائل';
                }
            }
        });
    } catch (error) {
        console.error('Error setting up collar type dropdown:', error);
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
                tera: document.getElementById('tera') ? document.getElementById('tera').value : '',
                collar_type: document.getElementById('collar_type') ? document.getElementById('collar_type').value : '',
                collar_style: document.getElementById('collar_style') ? document.getElementById('collar_style').value : '',
                chati: document.getElementById('chati') ? document.getElementById('chati').value : '',
                kamar: document.getElementById('kamar') ? document.getElementById('kamar').value : '',
                gira: document.getElementById('gira') ? document.getElementById('gira').value : '',
                moza: document.getElementById('moza') ? document.getElementById('moza').value : '',
                front_pocket_size: document.getElementById('front_pocket_size') ? document.getElementById('front_pocket_size').value : '',
                double_side_pocket: document.getElementById('double_side_pocket') ? document.getElementById('double_side_pocket').value : '',
                single_pocket: document.getElementById('single_pocket') ? document.getElementById('single_pocket').value : '',
                silai: document.getElementById('silai') ? document.getElementById('silai').value : '',
                front_pocket: document.getElementById('front_pocket') ? document.getElementById('front_pocket').value : '',
                button_color: document.getElementById('button_color') ? document.getElementById('button_color').value : '',
                button: document.getElementById('button') ? document.getElementById('button').value : '',
                button_size: document.getElementById('button_size') ? document.getElementById('button_size').value : '',
                cuff_plate: document.getElementById('cuff_plate') ? document.getElementById('cuff_plate').value : '',
                cuff_style: document.getElementById('cuff_style') ? document.getElementById('cuff_style').value : '',
                cuff_kaj: document.getElementById('cuff_kaj') ? document.getElementById('cuff_kaj').value : '',
                chak_patti: document.getElementById('chak_patti') ? document.getElementById('chak_patti').value : '',
                chak_patti_kaj: document.getElementById('chak_patti_kaj') ? document.getElementById('chak_patti_kaj').value : '',
                daman: document.getElementById('daman') ? document.getElementById('daman').value : '',
                shoulder_style: document.getElementById('shoulder_style') ? document.getElementById('shoulder_style').value : '',
                sleeve_type: document.getElementById('sleeve_type') ? document.getElementById('sleeve_type').value : '',
                gol_asteen: document.getElementById('gol_asteen') ? document.getElementById('gol_asteen').value : '',
                extra_demand: document.getElementById('extra_demand') ? document.getElementById('extra_demand').value : '',
                shalwar_lambai: document.getElementById('shalwar_lambai') ? document.getElementById('shalwar_lambai').value : '',
                shalwar_type: document.getElementById('shalwar_type') ? document.getElementById('shalwar_type').value : '',
                shalwar: document.getElementById('shalwar') ? document.getElementById('shalwar').value : '',
                pacha: document.getElementById('pacha') ? document.getElementById('pacha').value : '',
                lib: document.getElementById('lib') ? document.getElementById('lib').value : '',
                ander: document.getElementById('ander') ? document.getElementById('ander').value : '',
                shalwar_pocket: document.getElementById('shalwar_pocket') ? document.getElementById('shalwar_pocket').value : '',
                patti: document.getElementById('patti') ? document.getElementById('patti').value : ''
            }
        };
        
        console.log('Customer data prepared:', customerData);
        
        // For demo/development purposes
        // Simulate API call and success
        setTimeout(() => {
            console.log('Simulated successful save');
            alert('Customer saved successfully!');
            
            // Reset form
            const form = document.getElementById('customer-form');
            if (form) form.reset();
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }, 1000);
        
        // In real implementation:
        // window.api.send('add-customer', customerData);
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
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Error logging out. Please try closing the application.');
    }
}
