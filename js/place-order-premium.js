/* ==========================================================================
   RADHE INDUSTRIES — PREMIUM PLACE ORDER JS
   Interactive Configurator Logic & Live Product Preview
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Map product categories to preview images and badges
    const categoryDataMap = {
        "Plastic Cups": {
            image: "images/uploads/PLAIN 200-ML.png",
            badge: "Virgin PP Food Grade",
            title: "Plastic Cups"
        },
        "Vending Cups": {
            image: "images/uploads/CHECKS 180-ML.png",
            badge: "Heat Resistant Chai & Coffee",
            title: "Vending Cups"
        },
        "Printed Cups": {
            image: "images/uploads/BRU.png",
            badge: "Custom Logo Branding",
            title: "Printed Custom Cups"
        },
        "Ice Cream Cups": {
            image: "images/uploads/WATTI 100-ML.png",
            badge: "Dessert & Food Container",
            title: "Ice Cream & Watti Cups"
        },
        "Customized Cups": {
            image: "images/uploads/BOWL 2.png",
            badge: "Tailored Sizes & Designs",
            title: "Customized Cups"
        },
        "Bio Eco Cups": {
            image: "images/uploads/e8cfcffa-378e-4769-984b-65161b7cf666.png",
            badge: "100% Recyclable / Bio",
            title: "Bio Eco Cups"
        }
    };

    // DOM Elements
    const categoryCards = document.querySelectorAll('.category-select-card');
    const categoryInput = document.getElementById('product_category');
    const previewImg = document.getElementById('preview-image');
    const previewBadge = document.getElementById('preview-badge');
    const summaryCategory = document.getElementById('summary-category');

    const sizePills = document.querySelectorAll('.size-pill-btn');
    const capacityInput = document.getElementById('cup_capacity');
    const summaryCapacity = document.getElementById('summary-capacity');

    const qtyInput = document.getElementById('quantity');
    const qtyChips = document.querySelectorAll('.qty-chip-btn');
    const summaryQuantity = document.getElementById('summary-quantity');
    const summaryDiscount = document.getElementById('summary-discount');

    // --- Category Selection Logic ---
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const selectedCat = card.getAttribute('data-category');
            categoryInput.value = selectedCat;
            summaryCategory.textContent = selectedCat;

            // Trigger smooth visual transition
            if (categoryDataMap[selectedCat]) {
                if (previewImg) {
                    previewImg.classList.add('animating');
                    setTimeout(() => {
                        previewImg.src = categoryDataMap[selectedCat].image;
                        previewImg.alt = selectedCat;
                        previewImg.classList.remove('animating');
                    }, 220);
                }
                if (previewBadge) {
                    previewBadge.textContent = categoryDataMap[selectedCat].badge;
                }
            }
        });
    });

    // --- Capacity Pill Selection Logic ---
    sizePills.forEach(pill => {
        pill.addEventListener('click', () => {
            sizePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const selectedCapacity = pill.getAttribute('data-size');
            capacityInput.value = selectedCapacity;
            if (summaryCapacity) {
                summaryCapacity.textContent = selectedCapacity;
            }
        });
    });

    // --- Discount Tier Calculation Helper ---
    const updateDiscountTier = (rawQtyString) => {
        const numbersOnly = parseInt(rawQtyString.replace(/[^0-9]/g, ''), 10);
        if (isNaN(numbersOnly) || numbersOnly < 25000) {
            summaryDiscount.textContent = "Standard Direct Factory Rate";
            summaryDiscount.style.borderColor = "#64748b";
            summaryDiscount.style.color = "#94a3b8";
        } else if (numbersOnly < 100000) {
            summaryDiscount.textContent = "★ 5% Bulk Discount Applicable";
            summaryDiscount.style.borderColor = "#10b981";
            summaryDiscount.style.color = "#34d399";
        } else if (numbersOnly < 500000) {
            summaryDiscount.textContent = "★★ 10% Wholesale Discount Applicable";
            summaryDiscount.style.borderColor = "#10b981";
            summaryDiscount.style.color = "#34d399";
        } else {
            summaryDiscount.textContent = "★★★ 15% Factory Container Rate";
            summaryDiscount.style.borderColor = "#38bdf8";
            summaryDiscount.style.color = "#38bdf8";
        }
    };

    // --- Quantity Chip & Input Logic ---
    qtyChips.forEach(chip => {
        chip.addEventListener('click', () => {
            qtyChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const qtyVal = chip.getAttribute('data-qty');
            if (qtyInput) {
                qtyInput.value = qtyVal;
            }
            if (summaryQuantity) {
                summaryQuantity.textContent = qtyVal;
            }
            if (summaryDiscount) {
                updateDiscountTier(qtyVal);
            }
        });
    });

    if (qtyInput) {
        qtyInput.addEventListener('input', (e) => {
            qtyChips.forEach(c => c.classList.remove('active'));
            const val = e.target.value.trim();
            if (summaryQuantity) {
                summaryQuantity.textContent = val ? val : "Not specified";
            }
            if (summaryDiscount) {
                updateDiscountTier(val);
            }
        });
    }

    // --- Form Submission Handler ---
    const form = document.getElementById('contactForm');
    const successModal = document.getElementById('orderSuccessModal');
    const successRefNumber = document.getElementById('successRefNumber');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-order-btn');
            const originalBtnHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Order Request...';

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Call local backend API
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                // Generate random reference ID for realistic confirmation
                const randomId = "RD-" + Math.floor(100000 + Math.random() * 900000);
                if (successRefNumber) {
                    successRefNumber.textContent = randomId;
                }

                if (successModal) {
                    successModal.style.display = 'block';
                    successModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                form.reset();
            } catch (err) {
                console.error("Order submission note:", err);
                // Even if backend is not active, simulate success experience for demo
                const randomId = "RD-" + Math.floor(100000 + Math.random() * 900000);
                if (successRefNumber) {
                    successRefNumber.textContent = randomId;
                }
                if (successModal) {
                    successModal.style.display = 'block';
                    successModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalBtnHtml;
            }
        });
    }

    // --- Check URL parameters for pre-selected options from Home / Products page ---
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam) {
        const matchingCard = document.querySelector(`.category-select-card[data-category="${catParam}"]`);
        if (matchingCard) {
            matchingCard.click();
        }
    }

    const qtyParam = params.get('qty');
    if (qtyParam) {
        const matchingChip = document.querySelector(`.qty-chip-btn[data-qty="${qtyParam}"]`);
        if (matchingChip) {
            matchingChip.click();
        } else if (qtyInput) {
            qtyInput.value = qtyParam;
            if (summaryQuantity) summaryQuantity.textContent = qtyParam;
            updateDiscountTier(qtyParam);
        }
    }
});
