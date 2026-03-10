const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

// Pathing adjustment for Vercel: use process.cwd() to reach project root
const ROOT_DIR = process.cwd();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files ONLY in local development
// On Vercel, static files are served natively by the Vercel CDN from the root.
if (!process.env.VERCEL) {
    app.use(express.static(ROOT_DIR));
    app.use('/uploads', express.static(path.join(ROOT_DIR, 'images', 'uploads')));
}

const DATA_FILE = path.join(ROOT_DIR, 'data', 'products.json');
const UPLOAD_DIR = path.join(ROOT_DIR, 'images', 'uploads');

// Ensure upload directory exists (Note: this will only work in local dev or with persistent storage)
if (!fs.existsSync(UPLOAD_DIR)) {
    try {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    } catch (e) {
        console.warn("Could not create upload directory (expected on Vercel):", e.message);
    }
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Helper to read data
const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            const defaultData = [];
            fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
            return defaultData;
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data:", err);
        return [];
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("Error writing data:", err);
        return false;
    }
};

// --- API Routes ---

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        res.json({ success: true, token: 'admin-token-' + Date.now() });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// GET /api/products
app.get('/api/products', (req, res) => {
    const products = readData();
    res.json(products);
});

// POST /api/products (Admin only)
app.post('/api/products', upload.single('image'), (req, res) => {
    const token = req.headers['authorization'];
    if (!token || !token.startsWith('Bearer admin-token-')) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { name, category, price, discount, description } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: "Name and Price are required" });
    }

    const products = readData();
    const newProduct = {
        id: Date.now(),
        name,
        category: category || "General",
        price: parseFloat(price),
        discount: discount ? parseFloat(discount) : 0,
        description: description || "",
        image: req.file ? `images/uploads/${req.file.filename}` : "images/accessories.svg"
    };

    products.push(newProduct);
    writeData(products);

    res.status(201).json(newProduct);
});

// PUT /api/products/:id (Admin only)
app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const token = req.headers['authorization'];
    if (!token || !token.startsWith('Bearer admin-token-')) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, category, price, discount, description } = req.body;

    const products = readData();
    const productIndex = products.findIndex(p => p.id == id);

    if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = {
        ...products[productIndex],
        name: name || products[productIndex].name,
        category: category || products[productIndex].category,
        price: price ? parseFloat(price) : products[productIndex].price,
        discount: discount ? parseFloat(discount) : products[productIndex].discount || 0,
        description: description || products[productIndex].description || "",
        image: req.file ? `images/uploads/${req.file.filename}` : products[productIndex].image
    };

    products[productIndex] = updatedProduct;
    writeData(products);

    res.json(updatedProduct);
});

// DELETE /api/products/:id (Admin only)
app.delete('/api/products/:id', (req, res) => {
    const token = req.headers['authorization'];
    if (!token || !token.startsWith('Bearer admin-token-')) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    let products = readData();
    const initialLength = products.length;

    products = products.filter(p => p.id != id);

    if (products.length === initialLength) {
        return res.status(404).json({ error: "Product not found" });
    }

    writeData(products);
    res.json({ success: true, message: "Product deleted" });
});

// --- Email Configuration ---
const nodemailer = require('nodemailer');

// These should be set in environment variables for security
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'your-email@gmail.com';
const SENDER_PASSWORD = process.env.SENDER_PASSWORD || 'your-app-password'; 
const RECEIVER_EMAIL = 'radheindustries8@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
    }
});

// POST /api/contact
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, country, message } = req.body;
    
    console.log(`Received contact request from ${name} (${email})`);

    const mailOptions = {
        from: SENDER_EMAIL,
        to: RECEIVER_EMAIL,
        subject: `New Contact Request from ${name}`,
        text: `
            New inquiry received from contact form:
            
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Country: ${country}
            
            Message:
            ${message}
        `,
        html: `
            <h3>New Inquiry Received</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    try {
        // Only attempt to send if credentials look somewhat valid
        if (SENDER_EMAIL !== 'your-email@gmail.com' && SENDER_PASSWORD !== 'your-app-password') {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully!");
        } else {
            console.warn("Email NOT sent: SENDER_EMAIL or SENDER_PASSWORD not configured. Logging to console instead.");
            console.log("Simulated Email Content:", mailOptions.text);
        }
        res.json({ success: true, message: "Thank you for contacting us! Your message has been received." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
    }
});

// Export for Vercel
module.exports = app;

// Add this for local development
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running locally at http://localhost:${PORT}`);
    });
}
