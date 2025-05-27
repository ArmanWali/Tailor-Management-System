// Get customer ID from URL params
const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get('id');
const printMode = urlParams.get('print') === 'true';

// DOM elements for displaying/inputting customer data
const elements = {
    codeNumber: document.getElementById('input-codeNumber'),
    orderDate: document.getElementById('input-orderDate'),
    name: document.getElementById('input-name'),
    returnDate: document.getElementById('input-returnDate'),
    cellNumber: document.getElementById('input-cellNumber'),
    address: document.getElementById('input-address'),
    cuttingNo: document.getElementById('input-cuttingNo'),
    age: document.getElementById('input-age'),
    quantity: document.getElementById('input-quantity'),
    enteredBy: document.getElementById('input-enteredBy'),

    // Measurements - Shalwar Qameez
    lambai: document.getElementById('input-lambai'),
    asteen: document.getElementById('input-asteen'),
    tera: document.getElementById('input-tera'),
    collar_type: document.getElementById('input-collar_type'),
    collar_ben_options: document.getElementById('collar-ben-options'),
    collar_ben_label: document.getElementById('collar-ben-label'),
    collar_style: document.getElementById('input-collar_style'),
    chati: document.getElementById('input-chati'),
    kamar: document.getElementById('input-kamar'),
    gira: document.getElementById('input-gira'),
    moza: document.getElementById('input-moza'),
    double_side_pocket: document.getElementById('input-double_side_pocket'),
    single_pocket: document.getElementById('input-single_pocket'),
    front_pocket: document.getElementById('input-front_pocket'),
    silai: document.getElementById('input-silai'),
    button_color: document.getElementById('input-button_color'),
    button: document.getElementById('input-button'),
    button_size: document.getElementById('input-button_size'),

    // Measurements - Shalwar
    shalwar_lambai: document.getElementById('input-shalwar_lambai'),
    shalwar_type: document.getElementById('input-shalwar_type'),
    shalwar: document.getElementById('input-shalwar'),
    pacha: document.getElementById('input-pacha'),
    lib: document.getElementById('input-lib'),
    ander: document.getElementById('input-ander'),
    shalwar_pocket: document.getElementById('input-shalwar_pocket'),
    patti: document.getElementById('input-patti'),

    // Cuff/Plate options
    cuff_plate: document.getElementById('input-cuff_plate'),
    cuff_kaj: document.getElementById('input-cuff_kaj'),
    chak_patti: document.getElementById('input-chak_patti'),
    chak_patti_kaj: document.getElementById('input-chak_patti_kaj'),
    daman: document.getElementById('input-daman'),
    extra_demand: document.getElementById('input-extra_demand'),
    shoulder_style: document.getElementById('input-shoulder_style'),
    sleeve_type: document.getElementById('input-sleeve_type'),
    gol_asteen: document.getElementById('input-gol_asteen'),
};

// Button event listeners
document.getElementById('back-btn').addEventListener('click', () => {
    window.history.back();
});

document.getElementById('print-btn').addEventListener('click', () => {
    try {
        generatePDF();
    } catch (error) {
        console.error('PDF generation failed, falling back to browser print:', error);
        window.print();
    }
});

// Collar/Ben dropdown functionality
elements.collar_type.addEventListener('change', function () {
    const collarBenOptions = elements.collar_ben_options;
    const collarBenLabel = elements.collar_ben_label;
    const collarStyleDropdown = elements.collar_style;
    const selectedValue = this.value;

    // Clear previous options
    collarStyleDropdown.innerHTML = '<option value="">منتخب کریں</option>';

    if (selectedValue === 'بین') {
        collarBenLabel.textContent = 'بین اسٹائل';
        collarBenOptions.style.display = 'flex'; // Use flex to maintain layout

        // Add option for ben
        const option = document.createElement('option');
        option.value = "چورس / کٹ / گول (for ben)";
        option.textContent = "چورس / کٹ / گول (for ben)";
        collarStyleDropdown.appendChild(option);

    } else if (selectedValue === 'کالر') {
        collarBenLabel.textContent = 'کالر اسٹائل';
        collarBenOptions.style.display = 'flex'; // Use flex to maintain layout

        // Add option for collar
        const option = document.createElement('option');
        option.value = "انگلش / فرنچ / نوک والا (for collar)";
        option.textContent = "انگلش / فرنچ / نوک والا (for collar)";
        collarStyleDropdown.appendChild(option);

    } else {
        collarBenLabel.textContent = 'اسٹائل';
        collarBenOptions.style.display = 'none';
    }
});

// Load customer data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (!customerId) {
        alert('Customer ID not provided');
        window.history.back();
        return;
    }

    // Request customer data from main process
    window.api.send('get-customer', { id: customerId });
});

// Handle customer data response
window.api.receive('get-customer-response', (response) => {
    if (response.success) {
        displayCustomerData(response.customer);
        // Automatically print if in print mode
        if (printMode) {
            setTimeout(() => {
                try {
                    generatePDF();
                } catch (error) {
                    console.error('PDF generation failed, falling back to browser print:', error);
                    window.print();
                }

                // Go back to previous page after print dialog is closed
                setTimeout(() => {
                    window.history.back();
                }, 1000);
            }, 1000);
        }
    } else {
        alert('Failed to load customer data');
        console.error('Error:', response.error);
    }
});

// Display customer data in the view (and set form values)
function displayCustomerData(customer) {
    // Set document title
    document.title = `Customer: ${customer.name} - Noor & Sons Tailors`;

    // Display basic info
    elements.codeNumber.value = customer.codeNumber || '';
    elements.orderDate.value = customer.orderDate || '';
    elements.name.value = customer.name || '';
    elements.returnDate.value = customer.returnDate || '';
    elements.cellNumber.value = customer.cellNumber || '';
    elements.address.value = customer.address || '';
    elements.cuttingNo.value = customer.cuttingNo || '';
    elements.age.value = customer.age || '';
    elements.quantity.value = customer.quantity || '';
    elements.enteredBy.value = customer.enteredBy || '';

    // Display measurements
    if (customer.measurements) {
        const m = customer.measurements;

        // Shalwar Qameez
        elements.lambai.value = m.lambai || '';
        elements.asteen.value = m.asteen || '';
        elements.tera.value = m.tera || '';

        // Set collar type and trigger change to populate style dropdown
        elements.collar_type.value = m.collar_type || '';
        elements.collar_type.dispatchEvent(new Event('change'));

        // Set collar/ben style after options are populated
        setTimeout(() => {
            elements.collar_style.value = m.collar_style || m.ben_style || '';
        }, 0);

        elements.chati.value = m.chati || '';
        elements.kamar.value = m.kamar || '';
        elements.gira.value = m.gira || '';
        elements.moza.value = m.moza || '';
        elements.double_side_pocket.value = m.double_side_pocket || '';
        elements.single_pocket.value = m.single_pocket || '';
        elements.front_pocket.value = m.front_pocket || '';
        elements.silai.value = m.silai || '';
        elements.button_color.value = m.button_color || '';
        elements.button.value = m.button || '';
        elements.button_size.value = m.button_size || '';

        // Shalwar
        elements.shalwar_lambai.value = m.shalwar_lambai || '';
        elements.shalwar_type.value = m.shalwar_type || '';
        elements.shalwar.value = m.shalwar || '';
        elements.pacha.value = m.pacha || '';
        elements.lib.value = m.lib || '';
        elements.ander.value = m.ander || '';
        elements.shalwar_pocket.value = m.shalwar_pocket || '';
        elements.patti.value = m.patti || '';

        // Cuff/Plate options
        elements.cuff_plate.value = m.cuff_plate || '';
        elements.cuff_kaj.value = m.cuff_kaj || '';
        elements.chak_patti.value = m.chak_patti || '';
        elements.chak_patti_kaj.value = m.chak_patti_kaj || '';
        elements.daman.value = m.daman || '';
        elements.extra_demand.value = m.extra_demand || '';
        elements.shoulder_style.value = m.shoulder_style || '';
        elements.sleeve_type.value = m.sleeve_type || '';
        elements.gol_asteen.value = m.gol_asteen || '';
    }
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    // Format as YYYY-MM-DD for input type="date"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to generate PDF from customer details
function generatePDF() {
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            console.error('jsPDF is not available');
            alert('PDF generation library not loaded. Please try again.');
            return;
        }

        const customer = {
            name: elements.name.value,
            codeNumber: elements.codeNumber.value,
            orderDate: elements.orderDate.value,
            returnDate: elements.returnDate.value,
            cellNumber: elements.cellNumber.value,
            address: elements.address.value
        };
        // Create a new PDF
        const doc = new jsPDF('p', 'mm', 'a4');

        // Try to add logo using data URL
        try {
            const logoImg = document.querySelector('.logo-img');
            if (logoImg && logoImg.complete) {
                // Create a canvas to get image data
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = logoImg.naturalWidth;
                canvas.height = logoImg.naturalHeight;
                ctx.drawImage(logoImg, 0, 0);

                // Get base64 data URL and add to PDF
                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 75, 10, 60, 20);
            } else {
                console.log('Logo image not available, using text header only');
            }
        } catch (imgError) {
            console.log('Unable to add logo to PDF:', imgError);
        }

        // Add header
        doc.setFontSize(20);
        doc.text('Noor & Sons Tailors And Fabrics', 105, 35, { align: 'center' });
        doc.setFontSize(12);
        doc.text('We offer you stitching of your choice', 105, 42, { align: 'center' });

        // Add customer information
        doc.setFontSize(14);
        doc.text('Customer Details', 15, 55);

        doc.setFontSize(11);
        doc.text(`Name: ${customer.name}`, 15, 65);
        doc.text(`Code Number: ${customer.codeNumber}`, 15, 72);
        doc.text(`Cell Number: ${customer.cellNumber}`, 15, 79);

        doc.text(`Order Date: ${customer.orderDate}`, 120, 65);
        doc.text(`Return Date: ${customer.returnDate}`, 120, 72);
        doc.text(`Address: ${customer.address}`, 120, 79);

        // Add measurements heading
        doc.setFontSize(14);
        doc.text('Measurements / ناپ', 15, 95);

        // Add measurements table
        // Create array for table with both Urdu and English labels
        const measurementRows = [
            // Shalwar Qameez
            ['Length / لمبائی', elements.lambai.value, 'Shalwar Length / شلوار لمبائی', elements.shalwar_lambai.value],
            ['Sleeve / آستین', elements.asteen.value, 'Shalwar / شلوار', elements.shalwar.value],
            ['Tera / تیرا', elements.tera.value, 'Pacha / پاچہ', elements.pacha.value],
            ['Ben-Collar / بین - کالر', elements.collar_type.value, 'Lib / لب', elements.lib.value],
            ['Style / اسٹائل', elements.collar_style.value, 'Ander / اندر', elements.ander.value],
            ['Chest / چھاتی', elements.chati.value, 'Shalwar Pocket / شلوار پاکٹ', elements.shalwar_pocket.value],
            ['Waist / کمر', elements.kamar.value, 'Patti / پٹی', elements.patti.value],
            ['Gira / گیرہ', elements.gira.value, 'Daman / دامن', elements.daman.value],
            ['Moza / موزہ', elements.moza.value, 'Shalwar Type / قسم', elements.shalwar_type.value],
            ['Double Side Pocket / ڈبل سائیڈ پاکٹ', elements.double_side_pocket.value, 'Cuff Plate / کف پلیٹ', elements.cuff_plate.value],
            ['Single Pocket / سنگل پاکٹ', elements.single_pocket.value, 'Cuff Kaj / کف کاج', elements.cuff_kaj.value],
            ['Front Pocket / فرنٹ پاکٹ', elements.front_pocket.value, 'Chak Patti / چک پٹی', elements.chak_patti.value],
            ['Silai / سلائی', elements.silai.value, 'Chak Patti Kaj / چک پٹی کاج', elements.chak_patti_kaj.value],
            ['Button Color / رنگ بٹن', elements.button_color.value, 'Shoulder / شولڈر', elements.shoulder_style.value],
            ['Button / بٹن', elements.button.value, 'Sleeve Type / آستین', elements.sleeve_type.value],
            ['Button Size / بٹن سائز', elements.button_size.value, 'Gol Asteen / گول آستین', elements.gol_asteen.value]
        ];

        // If there's any extra demand, add it as a separate row
        if (elements.extra_demand.value) {
            measurementRows.push(['Extra Demand / اینکشرا دیماند', elements.extra_demand.value, '', '']);
        }

        doc.autoTable({
            startY: 100,
            head: [['Measurement / ناپ', 'Value / قیمت', 'Measurement / ناپ', 'Value / قیمت']],
            body: measurementRows,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        // Add signature lines
        const finalY = doc.lastAutoTable.finalY + 20;

        doc.text('Customer Signature: ___________________', 15, finalY);
        doc.text('Tailor Signature: ___________________', 120, finalY);

        // Footer
        doc.setFontSize(10);
        doc.text('Thank you for choosing Noor & Sons Tailors And Fabrics.', 105, 280, { align: 'center' });

        // Save PDF with customer name
        const fileName = `Customer_${customer.name.replace(/\s+/g, '_')}_${customer.codeNumber}.pdf`;

        // Open PDF in new window and print
        doc.output('dataurlnewwindow', { filename: fileName });
    } catch (error) {
        console.error('Error in PDF generation:', error);
        alert('Unable to generate PDF. Falling back to browser print.');
        window.print();
    }
}
