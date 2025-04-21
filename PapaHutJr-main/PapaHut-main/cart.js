// Cart state
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// UI updates
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<tr><td colspan='3'>Your cart is empty.</td></tr>";
        cartTotalElement.textContent = "0.00";
        updateCheckoutButton(0);
        return;
    }

    try {
        cart.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <div class="cart-item-details">
                        <strong>${item.name}</strong>
                        ${item.toppings?.length ? 
                            `<br><small class="toppings">Extra: ${item.toppings.map(t => t.name).join(", ")}</small>` 
                            : ""}
                    </div>
                </td>
                <td>$${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                <td>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, ${(item.quantity || 1) - 1})" ${(item.quantity || 1) <= 1 ? 'disabled' : ''}>-</button>
                        <span>${item.quantity || 1}</span>
                        <button onclick="updateQuantity(${index}, ${(item.quantity || 1) + 1})">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </td>
            `;
            cartItemsContainer.appendChild(row);
            total += (item.price * (item.quantity || 1));
        });
        
        cartTotalElement.textContent = total.toFixed(2);
        updateCheckoutButton(total);
        saveCart();
    } catch (error) {
        console.error("Error:", error);
        showNotification("Error displaying cart items", "error");
    }
}

// Cart operations
function updateCheckoutButton(total) {
    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) {
        checkoutBtn.disabled = total <= 0;
        checkoutBtn.classList[total <= 0 ? 'add' : 'remove']('disabled');
        checkoutBtn.onclick = proceedToCheckout;
    }
}

function proceedToCheckout() {
    if (!cart.length) {
        showNotification("Your cart is empty", "error");
        return;
    }
    
    try {
        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("cartTotal", total.toFixed(2));
        window.location.href = "checkout.html";
    } catch (error) {
        console.error("Error:", error);
        showNotification("Error proceeding to checkout", "error");
    }
}

function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return;
    try {
        cart[index].quantity = newQuantity;
        saveCart();
        updateCartDisplay();
        showNotification("Quantity updated");
    } catch (error) {
        showNotification("Error updating quantity", "error");
    }
}

function removeFromCart(index) {
    try {
        if (index >= 0 && index < cart.length) {
            const removedItem = cart[index];
            cart.splice(index, 1);
            saveCart();
            updateCartDisplay();
            showNotification(`${removedItem.name} removed from cart`);
        }
    } catch (error) {
        showNotification("Error removing item", "error");
    }
}

function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    } catch (error) {
        showNotification("Error saving cart", "error");
    }
}

function clearCart() {
    try {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification("Cart cleared");
    } catch (error) {
        showNotification("Error clearing cart", "error");
    }
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? "block" : "none";
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

// Init
document.addEventListener("DOMContentLoaded", () => {
    updateCartDisplay();
    const clearCartBtn = document.getElementById("clear-cart");
    if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);
});
