document.getElementById("forgotForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message");


  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email);

  if (!user) {
    message.textContent = "No account found with this email.";
    message.style.color = "red";
  } else {

    localStorage.setItem("resetEmail", email);

    message.textContent = "✔ Reset link sent! Redirecting...";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "reset.html";
    }, 1500);
  }
});
