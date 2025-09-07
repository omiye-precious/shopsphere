if (localStorage.getItem("currentUser")) {
  window.location.href = "profile.html";
}

document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const emailExists = users.some(user => user.email === email);

  if (emailExists) {
    alert("An account with this email already exists.");
    return;
  }

  const newUser = { name, email, password };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  localStorage.setItem("currentUser", JSON.stringify(newUser));

  window.location.href = "index.html";
});

document.querySelectorAll(".toggle-password").forEach(toggle => {
  toggle.addEventListener("click", function () {
    const targetId = toggle.getAttribute("data-target");
    const input = document.getElementById(targetId);

    if (input.type === "password") {
      input.type = "text";
      this.textContent = "🙈";
    } else {
      input.type = "password";
      this.textContent = "👁";
    }
  });

  const mediaQuery = window.matchMedia("(min-width: 850px)");

  function toggleEmojiVisibility(e) {
    if (e.matches) {
      toggle.style.display = "none";
    } else {
      toggle.style.display = "inline"; 
    }
  }

  toggleEmojiVisibility(mediaQuery);
  mediaQuery.addEventListener("change", toggleEmojiVisibility);
});