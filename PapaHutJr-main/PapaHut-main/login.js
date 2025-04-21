//used in index.html so the user can log in and create an account 

// Auth
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    // Hash pwd
    function hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Register
    if (signupForm) {
        signupForm.addEventListener("submit", e => {
            e.preventDefault();
            
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters long!");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users") || "[]");
            if (users.some(user => user.email === email)) {
                alert("User already exists!");
                return;
            }

            users.push({
                id: users.length + 1,
                email: email,
                password: hashPassword(password)
            });

            localStorage.setItem("users", JSON.stringify(users));
            alert("Registration successful! Please login.");
            window.location.href = "login.html";
        });
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
            
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const user = users.find(u => u.email === email && u.password === hashPassword(password));

            if (user) {
                localStorage.setItem("currentUser", JSON.stringify({
                    id: user.id,
                    email: user.email
                }));
                alert("Login successful!");
                window.location.href = "menu.html";
            } else {
                alert("Invalid email or password");
            }
        });
    }
});