// Init vars
const deliveryStatus = ['Received', 'Preparing', 'In Oven', 'Quality Check', 'Out for Delivery', 'Delivered'];
const pickupStatus = ['Received', 'Preparing', 'In Oven', 'Quality Check', 'Ready for Pick Up'];
let currentStatusIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    const orderDetails = document.getElementById("order-details");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const currentOrder = orders[orders.length - 1];

    if (!currentOrder) {
        window.location.href = "menu.html";
        return;
    }

    const orderId = currentOrder.id || Date.now();
    const orderTime = currentOrder.orderDate || new Date().toLocaleTimeString();
    const orderTotal = currentOrder.totalAmount?.toFixed(2) || "0.00";

    // Show order info
    orderDetails.innerHTML = `
        <div class="order-info">
            <h2>Order Confirmed!</h2>
            <p><strong>Order #:</strong> ${orderId}</p>
            <p><strong>Time:</strong> ${orderTime}</p>
            <p><strong>Total:</strong> $${orderTotal}</p>
            <p><strong>Method:</strong> ${currentOrder.method === "pickup" ? "Pickup" : "Delivery"}</p>
            <div id="status-tracker" class="status-tracker">
                <h3>Order Status</h3>
                <div class="status-steps"></div>
            </div>
        </div>
    `;

    // Init status tracker
    updateOrderStatus(currentOrder.method);

    // Simulate order progress
    const statusArray = currentOrder.method === "pickup" ? pickupStatus : deliveryStatus;
    const statusInterval = setInterval(() => {
        if (currentStatusIndex >= statusArray.length - 1) {
            clearInterval(statusInterval);
            return;
        }
        currentStatusIndex++;
        updateOrderStatus(currentOrder.method);
    }, 10000);
});

// Update status UI
function updateOrderStatus(method) {
    const statusArray = method === "pickup" ? pickupStatus : deliveryStatus;
    const statusSteps = document.querySelector('.status-steps');
    if (!statusSteps) return;

    statusSteps.innerHTML = statusArray.map((status, index) => `
        <div class="status-step ${index <= currentStatusIndex ? 'completed' : ''}">
            <div class="step-indicator"></div>
            <p>${status}</p>
        </div>
    `).join('');
}
