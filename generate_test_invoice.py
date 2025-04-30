from PIL import Image, ImageDraw, ImageFont
import os

# Create a blank white image
width, height = 1100, 1500
image = Image.new('RGB', (width, height), 'white')
draw = ImageDraw.Draw(image)

# Try to load a font
try:
    font_large = ImageFont.truetype('FreeSans.ttf', 40)
    font_medium = ImageFont.truetype('FreeSans.ttf', 30)
    font_small = ImageFont.truetype('FreeSans.ttf', 20)
except IOError:
    # If the font is not available, use default
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Draw company header
draw.text((50, 50), "ABC Technologies Pvt. Ltd.", fill="black", font=font_large)
draw.text((50, 100), "123 Tech Park, Bangalore, Karnataka, India", fill="black", font=font_small)
draw.text((50, 130), "GSTIN: 22AAAAA0000A1Z5", fill="black", font=font_small)
draw.text((50, 160), "PAN: AAAAA0000A", fill="black", font=font_small)
draw.text((50, 190), "contact@abctech.com | +91 9876543210", fill="black", font=font_small)

# Draw a horizontal line
draw.line([(50, 240), (width - 50, 240)], fill="black", width=2)

# Draw Invoice heading
draw.text((width // 2 - 100, 280), "INVOICE", fill="black", font=font_large)

# Draw Invoice details
draw.text((700, 350), "Invoice No: INV-001", fill="black", font=font_medium)
draw.text((700, 390), "Date: 14-03-2025", fill="black", font=font_medium)
draw.text((700, 430), "Due Date: 31-03-2025", fill="black", font=font_medium)

# Draw client details
draw.text((50, 350), "Bill To:", fill="black", font=font_medium)
draw.text((50, 390), "Demo Corp", fill="black", font=font_small)
draw.text((50, 420), "Business District", fill="black", font=font_small)
draw.text((50, 450), "Mumbai, Maharashtra", fill="black", font=font_small)
draw.text((50, 480), "GSTIN: 27BBBBB0000B1Z5", fill="black", font=font_small)

# Draw a horizontal line
draw.line([(50, 550), (width - 50, 550)], fill="black", width=2)

# Draw table headers
draw.text((60, 580), "Description", fill="black", font=font_medium)
draw.text((550, 580), "Quantity", fill="black", font=font_medium)
draw.text((700, 580), "Unit Price", fill="black", font=font_medium)
draw.text((900, 580), "Amount", fill="black", font=font_medium)

# Draw a horizontal line
draw.line([(50, 620), (width - 50, 620)], fill="black", width=1)

# Draw table rows
items = [
    ("Software License - Enterprise", "1", "₹ 25,000.00", "₹ 25,000.00"),
    ("Technical Support (3 months)", "1", "₹ 15,000.00", "₹ 15,000.00"),
    ("Implementation Services", "40", "₹ 1,000.00", "₹ 40,000.00")
]

y_position = 650
for item in items:
    draw.text((60, y_position), item[0], fill="black", font=font_small)
    draw.text((550, y_position), item[1], fill="black", font=font_small)
    draw.text((700, y_position), item[2], fill="black", font=font_small)
    draw.text((900, y_position), item[3], fill="black", font=font_small)
    y_position += 40

# Draw a horizontal line
draw.line([(50, 800), (width - 50, 800)], fill="black", width=1)

# Draw subtotal and tax
draw.text((700, 830), "Subtotal:", fill="black", font=font_small)
draw.text((900, 830), "₹ 80,000.00", fill="black", font=font_small)

draw.text((700, 870), "GST (18%):", fill="black", font=font_small)
draw.text((900, 870), "₹ 14,400.00", fill="black", font=font_small)

# Draw a horizontal line
draw.line([(700, 910), (width - 50, 910)], fill="black", width=1)

# Draw total
draw.text((700, 930), "Total:", fill="black", font=font_medium)
draw.text((900, 930), "₹ 94,400.00", fill="black", font=font_medium)

# Draw payment instructions
draw.text((50, 1050), "Payment Instructions:", fill="black", font=font_medium)
draw.text((50, 1090), "Bank: HDFC Bank", fill="black", font=font_small)
draw.text((50, 1120), "Account No: 12345678901234", fill="black", font=font_small)
draw.text((50, 1150), "IFSC: HDFC0001234", fill="black", font=font_small)
draw.text((50, 1180), "Please mention invoice number in payment reference", fill="black", font=font_small)

# Draw footer
draw.text((width // 2 - 200, 1300), "Thank you for your business!", fill="black", font=font_medium)

# Save the image
output_dir = "static/uploads"
os.makedirs(output_dir, exist_ok=True)
file_path = os.path.join(output_dir, "test_invoice.png")
image.save(file_path)

print(f"Test invoice generated and saved to {file_path}")