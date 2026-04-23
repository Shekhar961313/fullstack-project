/* ================================
   Get Elements
================================ */

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");


/* ================================
   Form Switch Functions
================================ */

function showRegister() {
    loginForm.classList.remove("active-form");
    registerForm.classList.add("active-form");
}

function showLogin() {
    registerForm.classList.remove("active-form");
    loginForm.classList.add("active-form");
}


/* ================================
   Helper Functions
================================ */

function setError(input, message) {
    const errorElement = input.parentElement.querySelector(".error");
    errorElement.innerText = message;
}

function clearError(input) {
    const errorElement = input.parentElement.querySelector(".error");
    errorElement.innerText = "";
}


/* ================================
   Register Logic
================================ */

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("registerName");
    const email = document.getElementById("registerEmail");
    const password = document.getElementById("registerPassword");

    let isValid = true;

    // Name Validation
    if (name.value.trim() === "") {
        setError(name, "Full name is required");
        isValid = false;
    } else {
        clearError(name);
    }

    // Email Validation
    if (email.value.trim() === "") {
        setError(email, "Email is required");
        isValid = false;
    } else {
        clearError(email);
    }

    // Password Validation
    if (password.value.length < 6) {
        setError(password, "Password must be at least 6 characters");
        isValid = false;
    } else {
        clearError(password);
    }

    if (!isValid) return;

    // Save User in Local Storage (Simulated Database)
    const user = {
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value
    };

    localStorage.setItem("cloudUser", JSON.stringify(user));

    alert("Registration successful!");
    showLogin();
});


/* ================================
   Login Logic
================================ */

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    const storedUser = JSON.parse(localStorage.getItem("cloudUser"));

    if (!storedUser) {
        alert("No user registered. Please register first.");
        return;
    }

    if (
        email.value.trim() === storedUser.email &&
        password.value === storedUser.password
    ) {
        // Create session
        localStorage.setItem("cloudSession", "active");

        // Redirect to homepage
        window.location.href = "homepage.html";

    } else {
        alert("Invalid email or password");
    }
});


/* ================================
   Session Auto-Check
================================ */

/* ================================
   Logout Function
   (Use in homepage.html)
================================ */

function logout() {
    localStorage.removeItem("cloudSession");
    window.location.href = "index.html";
}
