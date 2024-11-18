function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}

document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Registration successful!");
});

document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Login successful!");
});

document.getElementById("forgotPasswordForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Password reset successful!");
});

