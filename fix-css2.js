const fs = require('fs');
const path = require('path');

const targetCss = `        .promo-card {
            background: #fff;
            width: 100%;
            border-radius: 15px;
            overflow: hidden;
            border: 1px solid #eaeaea;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
            border-bottom-right-radius: 40px;
            display: flex;
            flex-direction: column;
        }

        .promo-card .img-wrapper {
            width: 100%;
            height: 280px;
            overflow: hidden;
        }

        .promo-card .img-wrapper img,
        .zoom-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            padding: 10px;
            transition: transform 0.5s ease;
        }

        .promo-card:hover .zoom-img,
        .product-card:hover .zoom-img {
            transform: scale(1.1);
            cursor: zoom-in;
        }`;

const filesToUpdate = ['product-200ml.html', 'product-225ml.html', 'product-250ml.html', 'product-300ml.html', 'product-watti.html'];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    
    // Find where .promo-card starts and where </style> ends
    const startIdx = content.indexOf('        .promo-card {');
    const endIdx = content.indexOf('    </style>');
    
    if (startIdx !== -1 && endIdx !== -1) {
        content = content.substring(0, startIdx) + targetCss + '\\n' + content.substring(endIdx);
        fs.writeFileSync(path.join(__dirname, file), content);
        console.log('Fixed CSS in ' + file);
    } else {
        console.log('Could not find tags in ' + file);
    }
});
