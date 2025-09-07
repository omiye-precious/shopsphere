
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && window.location.pathname.includes("login.html")) {
    if (currentUser.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "profile.html";
    }
    return;
  }

  updateNavbar();
});

function updateNavbar() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const loginRegisterLink = document.getElementById("login-register-link");
  const profileEmoji = document.getElementById("profile-emoji");

  if (currentUser) {
    if (loginRegisterLink) loginRegisterLink.style.display = "none";
    if (profileEmoji) profileEmoji.style.display = "inline-block";
  } else {
    if (loginRegisterLink) loginRegisterLink.style.display = "inline-block";
    if (profileEmoji) profileEmoji.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const passwordField = document.getElementById("password");

  if (passwordField) {
    const toggleBtn = document.createElement("span");
    toggleBtn.textContent = "👁";
    toggleBtn.style.cursor = "pointer";
    toggleBtn.style.position = "absolute";
    toggleBtn.style.right = "10px";
    toggleBtn.style.top = "20px";
    toggleBtn.style.transform = "translateY(-50%)";
    toggleBtn.style.userSelect = "none";

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    passwordField.parentNode.insertBefore(wrapper, passwordField);
    wrapper.appendChild(passwordField);
    wrapper.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordField.type === "password";
      passwordField.type = isPassword ? "text" : "password";
      toggleBtn.textContent = isPassword ? "🙈" : "👁";
    });

    const mediaQuery = window.matchMedia("(min-width: 850px)");
    function toggleEmojiVisibility(e) {
      if (e.matches) {
        toggleBtn.style.display = "none";
      } else {
        toggleBtn.style.display = "inline";
      }
    }
    toggleEmojiVisibility(mediaQuery);
    mediaQuery.addEventListener("change", toggleEmojiVisibility);
  }
});

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const ADMIN_EMAIL = "presh@admin.com";
    const ADMIN_PASSWORD = "presh1002";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email, role: "admin" };
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      window.location.href = "admin.html";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      user => user.email === email && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...matchedUser, role: "user" })
      );

      window.location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  });
}

function logout() {
  localStorage.removeItem("currentUser");
  updateNavbar();
  window.location.href = "login.html";
}