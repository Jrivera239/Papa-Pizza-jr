// State
let currentPizza = null;

// Init
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pizzaName = urlParams.get('type');
    const basePrice = parseFloat(urlParams.get('price'));
    const image = urlParams.get('image');
    const description = urlParams.get('description');

    if (!pizzaName || !basePrice) {
        showNotification('Error loading pizza details', 'error');
        setTimeout(() => window.location.href = 'menu.html', 2000);
        return;
    }

    currentPizza = { 
        name: pizzaName,
        basePrice: basePrice,
        image: image,
        description: description,
        toppings: []
    };
    
    document.getElementById('pizza-name').textContent = pizzaName;
    document.getElementById('base-price').textContent = basePrice.toFixed(2);
    document.getElementById('total-price').textContent = basePrice.toFixed(2);

    const toppingsForm = document.getElementById('toppings-form');
    if (toppingsForm) toppingsForm.addEventListener('change', updateTotalPrice);

    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) addToCartBtn.addEventListener('click', addCustomPizzaToCart);
});

// Price calc
function updateTotalPrice() {
    if (!currentPizza) return;
    
    let totalPrice = currentPizza.basePrice;
    const selectedToppings = [];
    
    document.querySelectorAll('.topping:checked').forEach(topping => {
        const price = parseFloat(topping.value) || 0;
        totalPrice += price;
        selectedToppings.push({
            name: topping.parentElement.textContent.split('(')[0].trim(),
            price: price
        });
    });
    
    currentPizza.toppings = selectedToppings;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

// Cart ops
function addCustomPizzaToCart() {
    if (!currentPizza) {
        showNotification('Error adding pizza to cart', 'error');
        return;
    }

    try {
        const totalPrice = parseFloat(document.getElementById('total-price').textContent);
        const toppingsText = currentPizza.toppings.map(t => t.name).join(', ');
        
        const cartItem = {
            name: currentPizza.name,
            price: totalPrice,
            image: currentPizza.image,
            description: currentPizza.description,
            toppings: currentPizza.toppings,
            customizations: toppingsText,
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        showNotification('Pizza added to cart!');
        setTimeout(() => window.location.href = 'cart.html', 1500);
    } catch (error) {
        showNotification('Error adding pizza to cart', 'error');
    }
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



