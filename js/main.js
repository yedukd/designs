// main.js - Updated to load products from JSON files

// Function to load all products from the products folder
async function loadProducts() {
    try {
        // Load the products index file
        const response = await fetch('products/index.json');
        const productFiles = await response.json();
        
        // Load each product file
        const products = await Promise.all(
            productFiles.map(async (filename) => {
                const productResponse = await fetch(`products/${filename}`);
                return await productResponse.json();
            })
        );
        
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Function to create star rating display
function createStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '⯨';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

// Function to render products with smooth transitions
function renderProducts(products, filterCategory = 'all') {
    const grid = document.getElementById('productsGrid');
    const productCount = document.querySelector('.product-count');
    const sectionTitle = document.querySelector('.section-header h2');
    
    // Filter products by category
    let filteredProducts = products;
    if (filterCategory !== 'all') {
        filteredProducts = products.filter(p => 
            p.category.toLowerCase() === filterCategory.toLowerCase()
        );
    }
    
    // Add fade-out class
    grid.classList.add('fade-out');
    
    // Wait for fade-out animation, then update content
    setTimeout(() => {
        // Update product count and title
        productCount.textContent = `${filteredProducts.length} products`;
        sectionTitle.textContent = filterCategory === 'all' ? 'All Sarees' : filterCategory;
        
        // Clear existing products
        grid.innerHTML = '';
        
        // Render new products
        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // Handle both single image (old format) and multiple images (new format)
            const images = product.images || (product.image ? [product.image] : []);
            const mainImage = images.length > 0 ? images[0] : null;
            
            card.innerHTML = `
                <div class="product-image-wrapper">
                    <div class="product-image">
                        ${mainImage 
                            ? `<img src="${mainImage}" alt="${product.title}" class="main-image">`
                            : '<div class="placeholder-icon">🖼️</div>'
                        }
                    </div>
                    ${images.length > 1 ? `
                        <div class="image-indicators">
                            ${images.map((_, index) => `
                                <span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="product-info">
                    <div class="product-title">${product.title}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">₹${product.price}</div>
                    <button class="btn-buy" onclick="openWhatsAppForProduct('${product.title.replace(/'/g, "\\'")}')">Buy Now</button>
                </div>
            `;
            
            grid.appendChild(card);
            
            // Add image switching functionality if multiple images exist
            if (images.length > 1) {
                setupImageSwitching(card, images);
            }
        });
        
        // Remove fade-out and trigger fade-in
        grid.classList.remove('fade-out');
        grid.classList.add('fade-in');
        
    }, 300); // Match this with CSS transition duration
}

// Function to setup image switching on hover/click
function setupImageSwitching(card, images) {
    const imageElement = card.querySelector('.main-image');
    const indicators = card.querySelectorAll('.indicator');
    let currentIndex = 0;
    let autoSwitchInterval;
    
    // Auto-switch images on hover
    card.addEventListener('mouseenter', () => {
        autoSwitchInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            imageElement.src = images[currentIndex];
            updateIndicators(indicators, currentIndex);
        }, 1500);
    });
    
    card.addEventListener('mouseleave', () => {
        clearInterval(autoSwitchInterval);
        currentIndex = 0;
        imageElement.src = images[0];
        updateIndicators(indicators, 0);
    });
    
    // Click on indicators to switch images
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.stopPropagation();
            clearInterval(autoSwitchInterval);
            currentIndex = index;
            imageElement.src = images[index];
            updateIndicators(indicators, index);
        });
    });
}

// Function to update active indicator
function updateIndicators(indicators, activeIndex) {
    indicators.forEach((ind, idx) => {
        ind.classList.toggle('active', idx === activeIndex);
    });
}

// Navigation button functionality with filtering
function initNavigation(products) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Get category from button text
            const category = this.textContent.trim();
            
            // Filter and render products
            if (category === 'All Sarees') {
                renderProducts(products, 'all');
            } else {
                renderProducts(products, category);
            }
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    const products = await loadProducts();
    renderProducts(products, 'all');
    initNavigation(products);
    initDropdowns();
    initButtons();
    initWhatsApp();
});

// Initialize WhatsApp functionality
function initWhatsApp() {
    const whatsappFloat = document.getElementById('whatsappFloat');
    const whatsappModal = document.getElementById('whatsappModal');
    const closeModal = document.getElementById('closeWhatsappModal');
    const whatsappForm = document.getElementById('whatsappForm');
    
    let currentProduct = null;
    
    // Open modal when clicking floating button
    whatsappFloat.addEventListener('click', () => {
        currentProduct = null;
        whatsappModal.classList.add('active');
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        whatsappModal.classList.remove('active');
        whatsappForm.reset();
    });
    
    // Close on outside click
    whatsappModal.addEventListener('click', (e) => {
        if (e.target === whatsappModal) {
            whatsappModal.classList.remove('active');
            whatsappForm.reset();
        }
    });
    
    // Handle form submission
    whatsappForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const query = document.getElementById('customerQuery').value;
        
        // Build WhatsApp message
        let message = `Hi! I'm ${name}%0A`;
        message += `Phone: ${phone}%0A%0A`;
        message += `${query}`;
        
        if (currentProduct) {
            message += `%0A%0AProduct: ${currentProduct}`;
        }
        
        // Open WhatsApp with pre-filled message
        const whatsappNumber = '919497475082'; // Your WhatsApp number
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        
        // Close modal and reset form
        whatsappModal.classList.remove('active');
        whatsappForm.reset();
    });
    
    // Store reference for buy button clicks
    window.openWhatsAppForProduct = function(productTitle) {
        currentProduct = productTitle;
        document.getElementById('customerQuery').value = `I'm interested in buying "${productTitle}". Please provide more details.`;
        whatsappModal.classList.add('active');
    };
}

// Initialize dropdown functionality
function initDropdowns() {
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutDropdown = document.getElementById('aboutDropdown');
    
    const guideBtn = document.getElementById('guideBtn');
    const guideDropdown = document.getElementById('guideDropdown');
    
    // About dropdown - toggle on click
    aboutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        aboutDropdown.classList.toggle('active');
        guideDropdown.classList.remove('active');
    });
    
    // Guide dropdown - toggle on click
    guideBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        guideDropdown.classList.toggle('active');
        aboutDropdown.classList.remove('active');
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!aboutBtn.contains(e.target)) {
            aboutDropdown.classList.remove('active');
        }
        if (!guideBtn.contains(e.target)) {
            guideDropdown.classList.remove('active');
        }
    });
}

// Initialize button functionality
function initButtons() {
    const shopNowBtn = document.getElementById('shopNowBtn');
    const productsSection = document.getElementById('productsSection');
    
    shopNowBtn.addEventListener('click', () => {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}