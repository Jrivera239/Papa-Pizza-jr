// Init vars
let orderStatus = ['Received', 'Preparing', 'In Oven', 'Quality Check', 'Out for Delivery', 'Delivered'];
let orderStatus_pickup = ['Received', 'Preparing', 'In Oven', 'Quality Check', 'Ready for Pick Up'];
let currentStatusIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    const orderDetails = document.getElementById("order-details");
    const orderId = Date.now();
    const orderTime = new Date().toLocaleTimeString();
    
    // Get latest order
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const currentOrder = orders[orders.length - 1];
    
    if (!currentOrder) {
        window.location.href = "menu.html";
        return;
    }

    // Show order info
    orderDetails.innerHTML = `
        <div class="order-info">
            <h2>Order Confirmed!</h2>
            <p><strong>Order #:</strong> ${currentOrder.id}</p>
            <p><strong>Time:</strong> ${currentOrder.orderDate}</p>
            <p><strong>Total:</strong> $${currentOrder.totalAmount.toFixed(2)}</p>
            <div id="status-tracker" class="status-tracker">
                <h3>Order Status</h3>
                <div class="status-steps"></div>
            </div>
        </div>
    `;

    // Init status tracker
    updateOrderStatus();
    
    // Sim order progress
    const statusInterval = setInterval(() => {
        if (currentStatusIndex >= orderStatus.length - 1) {
            clearInterval(statusInterval);
            return;
        }
        currentStatusIndex++;
        updateOrderStatus();
    }, 10000);
});

// Update status UI
function updateOrderStatus() {
    if (document.querySelector.value != 'delivery')
        {
            orderStatus = ['Received', 'Preparing', 'In Oven', 'Quality Check', 'Ready for Pick Up'];
            return;
        } 

    const statusSteps = document.querySelector('.status-steps');
    if (!statusSteps) return;

    statusSteps.innerHTML = orderStatus.map((status, index) => `
        <div class="status-step ${index <= currentStatusIndex ? 'completed' : ''}">
            <div class="step-indicator"></div>
            <p>${status}</p>
        </div>
    `).join('');
} 