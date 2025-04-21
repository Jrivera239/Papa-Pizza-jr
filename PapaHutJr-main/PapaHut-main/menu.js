// Menu data
const menuItems = [
    { name: "Cheese Pizza", price: 8.99, image: "images/cheese_pizza.png.webp", description: "Classic cheese pizza with rich tomato sauce and melted mozzarella." },
    { name: "Pepperoni Pizza", price: 9.99, image: "images/pepperoni_pizza.png.webp", description: "A delicious pizza topped with crispy pepperoni and gooey cheese." },
    { name: "Veggie Pizza", price: 10.99, image: "images/veggie_pizza.png.webp", description: "Fresh vegetables including bell peppers, onions, olives, and mushrooms." },
    { name: "Meat Lovers Pizza", price: 12.99, image: "images/meat_lovers_pizza.png.webp", description: "Loaded with pepperoni, sausage, bacon, ham, and ground beef." },
    { name: "BBQ Chicken Pizza", price: 11.99, image: "images/bbq_chicken_pizza.png.webp", description: "Smoky BBQ sauce, grilled chicken, red onions, and melted cheese." },
    { name: "Professor's Deep Dish", price: 14.99, image: "images/Deepdish.webp", description: "Chicago-style deep dish pizza loaded with extra cheese, chunky tomato sauce, and your choice of two toppings." }
];

// State
let currentPizza = null;
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// UI
function displayMenu() {
    const menuSection = document.getElementById("pizza-list");
    if (!menuSection) return;
    
    menuSection.innerHTML = "";
    menuItems.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.style.animationDelay = `${index * 0.1}s`;
        menuItem.innerHTML = `
            <div class="menu-item-content">
                <img src="${item.image}" alt="${item.name}" class='menu-image' onerror="this.src='images/cheese_pizza.png.webp'">
                <h3>${item.name}</h3>
                <p class="description">${item.description}</p>
                <p class="price">Price: $${item.price.toFixed(2)}</p>
                <div class="button-group">
                    <button class="customize-btn" onclick="openCustomizeModal(${index})">Customize</button>
                    <button class="quick-add-btn" onclick="addToCartDirect(${index})">Quick Add</button>
                </div>
            </div>
        `;
        menuSection.appendChild(menuItem);
    });

    initializeFilters();
    updateCartCount();
}

// Filter handlers
function initializeFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterMenu(filter);
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function filterMenu(filter) {
    document.querySelectorAll('.menu-item').forEach(item => {
        const name = item.querySelector('h3').textContent.toLowerCase();
        switch(filter) {
            case 'vegetarian':
                item.style.display = name.includes('veggie') ? 'block' : 'none';
                break;
            case 'meat':
                item.style.display = name.includes('meat') || name.includes('pepperoni') || name.includes('bbq') ? 'block' : 'none';
                break;
            case 'specialty':
                item.style.display = name.includes('deep dish') || name.includes('bbq') ? 'block' : 'none';
                break;
            default:
                item.style.display = 'block';
        }
    });
}

// Modal ops
function openCustomizeModal(index) {
    currentPizza = menuItems[index];
    const modal = document.getElementById("customizeModal");
    if (!modal) return;

    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalPrice = document.getElementById("modalPrice");
    const customizeBtn = document.getElementById("customize-pizza-btn");

    if (!modalImage || !modalTitle || !modalDescription || !modalPrice || !customizeBtn) return;

    modalImage.src = currentPizza.image;
    modalTitle.textContent = currentPizza.name;
    modalDescription.textContent = currentPizza.description;
    modalPrice.textContent = `$${currentPizza.price.toFixed(2)}`;
    
    customizeBtn.onclick = () => {
        window.location.href = `customize.html?type=${encodeURIComponent(currentPizza.name)}&price=${currentPizza.price}&image=${encodeURIComponent(currentPizza.image)}&description=${encodeURIComponent(currentPizza.description)}`;
    };
    
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("show"), 10);
}

function closeModal() {
    const modal = document.getElementById("customizeModal");
    if (!modal) return;

    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
        currentPizza = null;
    }, 300);
}

// Cart ops
function addToCartDirect(index) {
    const pizza = menuItems[index];
    if (!pizza) return;

    try {
        const cartItem = {
            name: pizza.name,
            price: pizza.price,
            image: pizza.image,
            description: pizza.description,
            quantity: 1
        };
        
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.name === cartItem.name);
        existingItem ? existingItem.quantity++ : cart.push(cartItem);

        localStorage.setItem("cart", JSON.stringify(cart));
        showNotification(`${pizza.name} added to cart!`);
        updateCartCount();
    } catch (error) {
        showNotification("Error adding to cart", "error");
    }
}

function addToCartFromModal() {
    if (!currentPizza) return;
    addToCartDirect(menuItems.findIndex(item => item.name === currentPizza.name));
    closeModal();
}

// Utils
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.querySelectorAll('.notification').forEach(n => n.remove());
    document.body.appendChild(notification);
    notification.offsetHeight;
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? "block" : "none";
    }
}

function updateCart() {
    const cartSection = document.getElementById("cart-items");
    if (!cartSection) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartSection.innerHTML = "";
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * (item.quantity || 1);
        cartSection.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name || 'Unknown Item'}</span>
                    <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                    ${item.quantity > 1 ? `<span class="cart-item-quantity">x${item.quantity}</span>` : ''}
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateItemQuantity(${index}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateItemQuantity(${index}, ${item.quantity + 1})">+</button>
                    <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
                </div>
            </div>
        `;
    });
    
    updateCartCount();
}

function updateItemQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    cart[index].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
        showNotification("Item removed from cart");
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    displayMenu();
    updateCart();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('customizeModal')?.style.display === 'block') {
        closeModal();
    }
});
