document.getElementById("resetForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const message = document.getElementById("message");

  const resetEmail = localStorage.getItem("resetEmail");
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (!resetEmail) {
    message.textContent = "Invalid reset attempt. Please try again.";
    message.style.color = "red";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    message.style.color = "red";
    return;
  }

  const userIndex = users.findIndex(u => u.email === resetEmail);
  if (userIndex === -1) {
    message.textContent = "User not found.";
    message.style.color = "red";
    return;
  }

  users[userIndex].password = newPassword;
  localStorage.setItem("users", JSON.stringify(users));

  localStorage.removeItem("resetEmail");

  message.textContent = "✔ Password reset successful! Redirecting to login...";
  message.style.color = "green";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});
