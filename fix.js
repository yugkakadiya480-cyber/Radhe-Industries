const fs = require('fs');

// ==== 1. Fix PLACE ORDER ====
let pHtml = fs.readFileSync('place-order.html', 'utf8');

// Undo CSS layout
pHtml = pHtml.replace(/\.contact-layout\s*\{[\s\S]*?\}/, `.contact-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            margin-top: 4rem;
        }`);

// Undo inline centering
pHtml = pHtml.replace(/<div class="contact-form-wrapper"[^>]*>/, '<div class="contact-form-wrapper">');
pHtml = pHtml.replace(/<h2[^>]*>Order Details<\/h2>/, '<h2>Order Details</h2>');
pHtml = pHtml.replace(/<form id="contactForm"[^>]*>/, '<form id="contactForm">');

// Restore button wrapper
pHtml = pHtml.replace(/<div style="text-align: center; margin-top: 2rem;">\s*<button type="submit" class="btn btn-primary" style="padding: 1rem 3rem;">(.*?)<\/button>\s*<\/div>/g,
    '<button type="submit" class="btn btn-primary">$1</button>');

fs.writeFileSync('place-order.html', pHtml);

// ==== 2. Fix CONTACT US ====
let cHtml = fs.readFileSync('contact.html', 'utf8');

cHtml = cHtml.replace(/\.contact-layout\s*\{[\s\S]*?\}/, `.contact-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            margin-top: 4rem;
        }`);

// Remove everything inside <div class="container contact-layout"> ... </div>
// Down to <!-- Footer -->
const startContainer = cHtml.indexOf('<div class="container contact-layout">');
const endContainer = cHtml.indexOf('<!-- Footer -->');

const before = cHtml.substring(0, startContainer);
const after = cHtml.substring(endContainer);

const newContactDetails = `<div class="container contact-layout">
        <div class="contact-info-box">
            <h3 style="margin-bottom: 1.5rem;">Contact Information</h3>

            <div class="info-item">
                <i class="fa-solid fa-location-dot"></i>
                <p>Radhe Industries,<br>Morbi, Gujarat, India</p>
            </div>
            <div class="info-item">
                <i class="fa-solid fa-envelope"></i>
                <p>info@radheindustries.com</p>
            </div>
            <div class="info-item">
                <i class="fa-solid fa-phone"></i>
                <p>+91 99099 49953</p>
            </div>

            <hr style="border: 0; border-top: 1px solid #ddd; margin: 2rem 0;">

            <h4>Business Hours</h4>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p>Sat - Sun: Closed</p>
        </div>
    </div>
    
    `;

cHtml = before + newContactDetails + after;
fs.writeFileSync('contact.html', cHtml);

console.log("Fix completed");
