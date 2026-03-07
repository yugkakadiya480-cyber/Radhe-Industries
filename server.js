const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'images', 'uploads'))); // Serve uploads

const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const UPLOAD_DIR = path.join(__dirname, 'images', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
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
            // Initialize with default data if missing
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
    // Hardcoded credentials as requested
    if (username === 'admin' && password === 'admin') {
        // Simple token for demo purposes
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
    // Check Auth (Simple Header check)
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
        image: req.file ? `images/uploads/${req.file.filename}` : "images/accessories.svg" // Fallback if no image
    };

    products.push(newProduct);
    writeData(products);

    res.status(201).json(newProduct);
});

// PUT /api/products/:id (Admin only)
app.put('/api/products/:id', upload.single('image'), (req, res) => {
    // Check Auth
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

    // Update fields
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
    // Check Auth
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

// POST /api/contact
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log("New Contact Form Submission:");
    console.log(`From: ${name} <${email}>`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // In a real app, send email here

    res.json({ success: true, message: "Thank you for contacting us!" });
});

// Explicit root route - serves index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all: serve any .html file by name, fallback to index.html
app.get('*', (req, res) => {
    const reqPath = req.path;
    // Try to serve the exact file first
    const filePath = path.join(__dirname, reqPath);
    if (reqPath.endsWith('.html') || reqPath.endsWith('.png') || reqPath.endsWith('.jpg') ||
        reqPath.endsWith('.jpeg') || reqPath.endsWith('.webp') || reqPath.endsWith('.css') ||
        reqPath.endsWith('.js') || reqPath.endsWith('.gif') || reqPath.endsWith('.ico') ||
        reqPath.endsWith('.json') || reqPath.endsWith('.svg')) {
        res.sendFile(filePath, (err) => {
            if (err) res.status(404).send('File not found');
        });
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Start Server (local dev) or export for Vercel (serverless)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
