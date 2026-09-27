// Données des produits
const products = [
    {
        id: 1,
        name: "T-shirt Classique",
        category: "homme",
        price: 29.99,
        description: "Confortable et élégant",
        emoji: "👕"
    },
    {
        id: 2,
        name: "Jeans Slim Fit",
        category: "homme",
        price: 59.99,
        description: "Coupe moderne et ajustée",
        emoji: "👖"
    },
    {
        id: 3,
        name: "Robe Midi",
        category: "femme",
        price: 79.99,
        description: "Élégante et intemporelle",
        emoji: "👗"
    },
    {
        id: 4,
        name: "Chemise Formelle",
        category: "femme",
        price: 69.99,
        description: "Parfaite pour les occasions",
        emoji: "👔"
    },
    {
        id: 5,
        name: "Sweat à Capuche",
        category: "enfant",
        price: 39.99,
        description: "Chaud et confortable",
        emoji: "🧥"
    },
    {
        id: 6,
        name: "Pantalon Enfant",
        category: "enfant",
        price: 34.99,
        description: "Robuste et pratique",
        emoji: "👖"
    },
    {
        id: 7,
        name: "Casquette Baseball",
        category: "accessoires",
        price: 24.99,
        description: "Casual et tendance",
        emoji: "🧢"
    },
    {
        id: 8,
        name: "Écharpe Laine",
        category: "accessoires",
        price: 44.99,
        description: "Chaude et douce",
        emoji: "🧣"
    },
    {
        id: 9,
        name: "Blouson Cuir",
        category: "homme",
        price: 149.99,
        description: "Look rock et stylé",
        emoji: "🧥"
    },
    {
        id: 10,
        name: "Leggings Sport",
        category: "femme",
        price: 44.99,
        description: "Parfait pour le sport",
        emoji: "🩳"
    },
    {
        id: 11,
        name: "Chaussures Baskets",
        category: "accessoires",
        price: 89.99,
        description: "Confortables et stylées",
        emoji: "👟"
    },
    {
        id: 12,
        name: "Sac à Main",
        category: "accessoires",
        price: 99.99,
        description: "Pratique et élégant",
        emoji: "👜"
    }
];

// Panier
let cart = [];

// Éléments du DOM
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const shopBtn = document.getElementById('shop-btn');

let currentFilter = 'all';

// Afficher les produits
function displayProducts(productsToShow = products) {
    productsGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price.toFixed(2)} €</p>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Ajouter</button>
                    <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">❤️</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Filtrer les produits
function filterProducts(category) {
    currentFilter = category;
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    displayProducts(filtered);
}

// Ajouter au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    showNotification(`${product.name} ajouté au panier!`);
}

// Ajouter à la liste de souhaits (simple notification)
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} ajouté à votre liste de souhaits!`);
}

// Mettre à jour l'interface du panier
function updateCartUI() {
    // Mettre à jour le nombre d'articles
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Mettre à jour le contenu du panier
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Votre panier est vide</p>';
        cartTotalElement.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)} € x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €</div>
            </div>
            <div class="cart-item-qty">
                <button onclick="updateQuantity(${item.id}, -1)" class="btn btn-secondary">-</button>
                <input type="number" value="${item.quantity}" class="qty-input" readonly>
                <button onclick="updateQuantity(${item.id}, 1)" class="btn btn-secondary">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="btn btn-danger">✕</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    // Calculer et afficher le total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = total.toFixed(2);
}

// Mettre à jour la quantité
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Supprimer du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Article supprimé du panier');
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 300;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Ajouter animations aux notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Événements des filtres
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProducts(btn.dataset.filter);
    });
});

// Événements du panier
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

continueShoppingBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

shopBtn.addEventListener('click', () => {
    document.getElementById('produits').scrollIntoView({ behavior: 'smooth' });
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Votre panier est vide!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Paiement de ${total.toFixed(2)} € en cours...\n\nCeci est une démonstration.\nEn production, intégrez un système de paiement (Stripe, PayPal, etc.)`);
    cart = [];
    updateCartUI();
    cartModal.style.display = 'none';
    showNotification('Commande confirmée! Merci de votre achat.');
});

// Fermer la modale en cliquant en dehors
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Initialisation
displayProducts();