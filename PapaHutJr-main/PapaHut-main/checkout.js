// Init
document.addEventListener("DOMContentLoaded", function () {
    const paymentMethodSelect = document.getElementById("payment-method");
    const paymentForm = document.getElementById("payment-form");
    const creditCardFields = document.getElementById("credit-card-fields");
    const paypalFields = document.getElementById("paypal-fields");
    const googlePayFields = document.getElementById("google-pay-fields");
    const deliveryTypeInputs = document.querySelectorAll('input[name="delivery-type"]');
    const deliveryAddressDiv = document.getElementById("delivery-address");
    const cartTotalElement = document.getElementById("cart-total");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    // Auth check
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Please login to place an order");
        window.location.href = "login.html";
        return;
    }

    initializeOrderSummary();

    // Payment UI
    function updatePaymentFields() {
        creditCardFields.classList.add("hidden");
        paypalFields.classList.add("hidden");
        googlePayFields.classList.add("hidden");

        paymentForm.classList.remove("hidden");
        const selectedMethod = paymentMethodSelect.value;
        if (selectedMethod === "credit-card") {
            creditCardFields.classList.remove("hidden");
        } else if (selectedMethod === "paypal") {
            paypalFields.classList.remove("hidden");
            paypalFields.innerHTML = "<p>You have selected PayPal. Please proceed with your PayPal email.</p>" +
                "<label for='paypal-email'>PayPal Email:</label>" +
                "<input type='email' id='paypal-email' placeholder='your-email@example.com'>";
        } else if (selectedMethod === "google-pay") {
            googlePayFields.classList.remove("hidden");
            googlePayFields.innerHTML = "<p>You have selected Google Pay. Please proceed with your Google Pay account.</p>";
        }
    }

    paymentMethodSelect.addEventListener("change", updatePaymentFields);

    // Order submit
    paymentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            alert("Please login to place an order");
            window.location.href = "login.html";
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalAmount = parseFloat(localStorage.getItem("cartTotal")) || 0;
        const selectedOrderMethod = document.querySelector('input[name="delivery-type"]:checked').value;

        const order = {
            id: Date.now(),
            userId: currentUser.id,
            userEmail: currentUser.email,
            items: cart,
            totalAmount: totalAmount,
            orderDate: new Date().toISOString(),
            paymentMethod: paymentMethodSelect.value,
            method: selectedOrderMethod, // ✅ Used for order tracking
            deliveryAddress: selectedOrderMethod === 'delivery' ? {
                street: document.getElementById("address")?.value,
                city: document.getElementById("city")?.value,
                zip: document.getElementById("zip")?.value
            } : null
        };

        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        localStorage.removeItem("cart");
        localStorage.removeItem("cartTotal");

        alert("Order placed successfully! Your order number is: " + order.id);
        window.location.href = "confirmation.html"; // your order status page
    });

    // Delivery UI toggle
    deliveryTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            deliveryAddressDiv.classList.toggle('hidden', e.target.value !== 'delivery');
            deliveryAddressDiv.querySelectorAll('input').forEach(input => {
                input.required = e.target.value === 'delivery';
            });
        });
    });

    // Card input formatting
    const cardNumber = document.getElementById('card-number');
    const expiryDate = document.getElementById('expiry');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        });
    }
    if (expiryDate) {
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0,2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }

    updatePaymentFields();
});

// Order summary
function initializeOrderSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutItems = document.getElementById("checkout-items");
    
    if (!cart.length) {
        window.location.href = "menu.html";
        return;
    }

    checkoutItems.innerHTML = "";
    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        const itemElement = document.createElement("div");
        itemElement.className = "checkout-item";
        itemElement.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                ${item.customizations ? `<br><small class="item-customizations">Extra: ${item.customizations}</small>` : ''}
                <span class="item-quantity">x${item.quantity || 1}</span>
            </div>
            <span class="item-price">$${itemTotal.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemElement);
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
    localStorage.setItem("cartTotal", total.toFixed(2));
}
