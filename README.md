# Product Catalog Template 2025-2026

Professional B2B product catalog template with 7 double-page spreads in 3D isometric perspective view.

## Overview

This template provides a complete, ready-to-use product catalog system designed for wholesale and business applications. It features a modern, clean aesthetic with a professional teal and white color scheme.

## Features

- **7 Double-Page Spreads** - Complete catalog layout with cover, table of contents, product grids, and detailed listings
- **3D Isometric View** - Professional presentation with perspective depth and shadows
- **Responsive Design** - Adapts to different screen sizes while maintaining professional appearance
- **Print-Ready** - Optimized CSS for printing to PDF or physical media
- **Customizable** - Easy-to-modify color scheme, typography, and content

## Spread Breakdown

### Spread 1: Cover Page
- **Left Page:** Gradient teal background with large image placeholder and curved white swoosh
- **Right Page:** Brand logo, catalog title, year badge, and contact information

### Spread 2: Table of Contents & Company Introduction
- **Left Page:** Interactive table of contents with teal buttons and page numbers
- **Right Page:** Company introduction with three-column text layout

### Spreads 3-4: Product Grid Layouts
- **3-column grid** with 120x120px product placeholders
- Product cells include SKU codes (COMP_XX format), descriptions, and price fields
- 36 total product slots across both spreads

### Spreads 5-6: Detailed Product Listings
- **2-column layout** for detailed product views
- 150x150px product images with comprehensive descriptions
- Product specifications with dotted leader tables
- SKU codes in PD0XX format

### Spread 7: Contact Information & Back Cover
- **Left Page:** Complete contact information including office address, phone, email, and business hours
- **Right Page:** Thank you message with brand logo and footer

## Color Palette

```css
--primary-teal: #00A79D       /* Main brand color */
--secondary-white: #FFFFFF    /* Clean backgrounds */
--text-primary: #2C3E50       /* Dark gray-blue for headings */
--text-secondary: #7F8C8D     /* Medium gray for body text */
--background-neutral: #F5F5F5 /* Light gray placeholders */
--background-beige: #E8E2D8   /* Page background */
```

## Typography Hierarchy

- **H1 Headlines:** 48-56pt, Bold, Letter-spacing: -0.02em
- **H2 Section Headers:** 24-28pt, Bold
- **H3 Product Titles:** 14-16pt, SemiBold, Letter-spacing: 0.01em
- **Body Text:** 9-11pt, Regular, Line-height: 1.4-1.6
- **Caption Text:** 7-8pt, Regular

## File Structure

```
product-catalog/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling system
└── README.md          # This documentation file
```

## Customization Guide

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-teal: #00A79D;      /* Change to your brand color */
    --text-primary: #2C3E50;       /* Adjust text color */
}
```

### Adding Your Products

1. **Product Grid Items:** Replace placeholder content in product-cell divs
2. **Product Images:** Replace SVG placeholders with actual product images
3. **SKU Codes:** Update COMP_XX and PD0XX codes with your SKU system
4. **Prices:** Replace PRICE_XX placeholders with actual pricing

### Updating Contact Information

Edit the contact sections in Spread 1 and Spread 7:

```html
<div class="contact-item">
    <span class="icon">📞</span> +1 (555) 123-4567
</div>
```

### Modifying Layout Grid

Adjust grid columns in `styles.css`:

```css
.product-grid {
    grid-template-columns: repeat(3, 1fr);  /* Change 3 to desired columns */
}
```

## Usage Instructions

### Viewing the Template

1. Open `index.html` in a modern web browser
2. The catalog will display with 3D perspective effects
3. Hover over spreads to see interactive depth animation

### Printing to PDF

1. Open `index.html` in Chrome or Firefox
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. Select "Save as PDF" as destination
4. Adjust settings:
   - **Layout:** Portrait
   - **Margins:** None
   - **Background graphics:** Enabled
5. Save the PDF

### Exporting for Professional Printing

For high-quality professional printing:

1. Use Chrome for best print preview
2. Set paper size to A4 or Letter
3. Enable background graphics
4. Save as PDF with high quality settings
5. Provide PDF to your printing service

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Technical Specifications

### Layout Grid System
- **Page Margins:** 30px all sides
- **Column Gutter:** 20px
- **Baseline Grid:** 8px increments
- **Section Spacing:** 40px between major sections

### Visual Elements
- **Border Radius:** 8px for standard elements, 25px for buttons
- **Drop Shadow:** 0 10px 30px rgba(0,0,0,0.15)
- **3D Perspective:** 2000px with 30-degree isometric angle

### Spread Dimensions
- **Default Width:** 1400px
- **Default Height:** 900px
- **Aspect Ratio:** 14:9

## License

This template is provided as-is for commercial and personal use.

## Support

For questions or customization assistance, please refer to standard HTML/CSS documentation or consult with a web developer.

---

**Version:** 1.0
**Created:** 2025
**Last Updated:** November 2025
