# Tailor Management System Database Schema

## Customer Collection

Each customer document contains the following fields:

### Basic Information
- `_id`: ObjectId (Auto-generated by MongoDB)
- `codeNumber`: String - Unique identifier for the customer
- `orderDate`: Date - When the order was placed
- `name`: String - Customer's name
- `returnDate`: Date - When the customer should return to collect the order
- `cellNumber`: String - Customer's contact number
- `address`: String - Customer's address
- `age`: Number - Customer's age
- `cuttingNo`: String - Cutting number reference
- `quantity`: Number - Number of items ordered
- `enteredBy`: String - User who entered the customer information

### Measurements
The `measurements` object contains all measurements for the customer:

#### Qameez (قمیص)
- `lambai`: String - Length (لمبائی)
- `asteen`: String - Sleeve (آستین)
- `tera`: String - Shoulder width (تیرا)
- `collar_type`: String - Collar type (بین / کالر) - Options: بین, کالر
- `collar_style`: String - Collar/Ben style
  - For بین: چورس, کٹ, گول
  - For کالر: انگلش, فرنچ, نوک والا
- `chati`: String - Chest (چھاتی)
- `kamar`: String - Waist (کمر)
- `gira`: String - Neck (گیرہ)
- `moza`: String - Cuff (موڑہ)
- `front_pocket_size`: String - Front pocket size (فرنٹ پاکٹ سائز)
- `double_side_pocket`: String - Double side pocket (ڈبل سائیڈ پاکٹ) - Yes/No
- `single_pocket`: String - Single pocket (سنگل پاکٹ) - Yes/No
- `front_pocket`: String - Front pocket style (فرنٹ پاکٹ) - Options: چورس, گول, نوک والا, NO
- `silai`: String - Stitching type (سلائی) - Options: ساده, چمک دار, ڈبل چمک دار, کم, چین
- `button_color`: String - Button color (رنگ بٹن) - Options: کراچی, عام
- `button`: String - Button details (بٹن)
- `button_size`: String - Button size (بٹن سائز)
- `cuff_plate`: String - Cuff/plate type (پلیٹ والا کف / پلیٹ کے بغیر) - Options: پلیٹ والا کف, پلیٹ کے بغیر, NO
- `cuff_style`: String - Cuff style (کف اسٹائل) - Options: چورس, گول, کٹ, سٹڈ, NO
- `cuff_kaj`: String - Cuff button style (کف کاج) - Options: سنگل, ڈبل, سیدہ
- `chak_patti`: String - Side slit style (چک پٹی) - Options: چورس, نوک, گول
- `chak_patti_kaj`: String - Side slit button style (چک پٹی کاج) - Options: سنگل, ڈبل, NO
- `daman`: String - Bottom style (دامن) - Options: گول, چورس
- `shoulder_style`: String - Shoulder style (شولڈر) - Options: نارمل, سیدها, ڈاؤن
- `sleeve_type`: String - Sleeve type (آستین) - Options: فل, فٹ, بافی
- `gol_asteen`: String - Round sleeve (گول آستین)
- `patti`: String - Border style (پٹی) - Options: پلیٹ والی, نوک والی, عام, گول
- `patti_churai`: String - Border width (پٹی چوڑائی)
- `extra_demand`: String - Additional requirements (ایکسٹرا ڈیمانڈ)

#### Shalwar (شلوار)
- `shalwar_lambai`: String - Shalwar length (شلوار لمبائی)
- `shalwar_type`: String - Shalwar type (عام / ٹروزر) - Options: عام, ٹروزر
- `shalwar`: String - Shalwar measurements (شلوار)
- `pacha`: String - Bottom width (پاچہ)
- `lib`: String - Waist measurements (لب)
- `ander`: String - Inner measurements (انسایڈ)
- `shalwar_pocket`: String - Shalwar pocket (شلوار پاکٹ) - Yes/No

## User Collection

Each user document contains:

- `_id`: ObjectId (Auto-generated by MongoDB)
- `username`: String - Username for login
- `password`: String - Hashed password
- `name`: String - Full name of the user
- `role`: String - User role (e.g., admin, tailor, staff)
- `createdAt`: Date - When the user account was created
- `lastLogin`: Date - When the user last logged in

## Order Collection (Optional - for future implementation)

Each order document contains:

- `_id`: ObjectId (Auto-generated by MongoDB)
- `customerId`: ObjectId - Reference to customer document
- `orderDate`: Date - When the order was placed
- `deliveryDate`: Date - When the order is to be delivered
- `status`: String - Order status (e.g., pending, in-progress, completed, delivered)
- `items`: Array - List of items in the order
- `totalAmount`: Number - Total order amount
- `paidAmount`: Number - Amount paid
- `balance`: Number - Remaining balance to be paid
