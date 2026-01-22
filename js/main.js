// Product data
const products = [
    {
        title: 'Personalized Photo Frame',
        description: 'Beautiful wooden frame with custom engraving',
        rating: 4.8,
        reviews: 127,
        image: 'assets/photo-frame.jpg'
    },
    {
        title: 'Luxury Jewelry Box',
        description: 'Elegant velvet-lined jewelry organizer',
        rating: 4.9,
        reviews: 89,
        image: 'assets/jewelry-box.jpg'
    },
    {
        title: 'Scented Candle Set',
        description: 'Set of 3 premium aromatherapy candles',
        rating: 4.7,
        reviews: 203,
        image: null
    },
    {
        title: 'Birthday Crown',
        description: 'Sparkly birthday crown for special celebrations',
        rating: 4.5,
        reviews: 156,
        image: 'assets/birthday-crown.jpg'
    },
    {
        title: 'Leather Journal',
        description: 'Handcrafted leather-bound notebook',
        rating: 4.9,
        reviews: 94,
        image: 'assets/leather-journal.jpg'
    },
    {
        title: 'Tea Gift Set',
        description: 'Assorted premium tea collection',
        rating: 4.6,
        reviews: 178,
        image: 'assets/tea-set.jpg'
    },
    {
        title: 'Personalized Mug',
        description: 'Custom ceramic mug with name',
        rating: 4.7,
        reviews: 245,
        image: 'assets/personalized-mug.jpg'
    },
    {
        title: 'Succulent Plant Set',
        description: 'Set of 4 mini succulent plants',
        rating: 4.8,
        reviews: 167,
        image: 'assets/succulent-plants.jpg'
    },
    {
        title: 'Wine Accessory Kit',
        description: 'Complete wine opener and stopper set',
        rating: 4.6,
        reviews: 132,
        image: 'assets/wine-kit.jpg'
    },
    {
        title: 'Chocolate Gift Box',
        description: 'Assorted gourmet chocolates',
        rating: 4.9,
        reviews: 289,
        image: 'assets/chocolate-box.jpg'
    },
    {
        title: 'Aromatherapy Diffuser',
        description: 'LED color-changing essential oil diffuser',
        rating: 4.7,
        reviews: 198,
        image: 'assets/diffuser.jpg'
    },
    {
        title: 'Custom Keychain',
        description: 'Personalized metal keychain with engraving',
        rating: 4.5,
        reviews: 211,
        image: 'assets/keychain.jpg'
    }
];

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

// Function to render products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.title}">`
                    : '<div class="placeholder-icon">🖼️</div>'
                }
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">
                    <span class="stars">${createStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Navigation button functionality
function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    initNavigation();
});