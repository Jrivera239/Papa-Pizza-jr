// Utils
const Utils = {
    showError: function(message) {
        alert(message);
        console.error(message);
    },

    showSuccess: function(message) {
        alert(message);
        console.log(message);
    },

    validatePrice: function(price) {
        return !isNaN(price) && price > 0;
    },

    formatCurrency: function(amount) {
        return `$${parseFloat(amount).toFixed(2)}`;
    },

    clearLocalStorage: function() {
        if (confirm('This will clear all data. Continue?')) {
            localStorage.clear();
            location.reload();
        }
    }
}; 