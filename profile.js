document.addEventListener("DOMContentLoaded", () => {
  const profileCard = document.getElementById("profile-card");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    profileCard.innerHTML = `
      <h2>You're not logged in</h2>
      <p>Please log in to see your profile information.</p>
      <div class="button">
        <a href="login.html" class="btn">Login</a>
        <a href="signup.html" class="btn">Sign Up</a>
      </div>
    `;
  } else {
    profileCard.innerHTML = `
    <div class="all-dashboard">
      <h2>Welcome, ${currentUser.name}</h2>
      <p><strong>Email:</strong> ${currentUser.email}</p>

      <div class="dashboard">
        <h3>📊 Your Dashboard</h3>
        <div class="dashboard-grid">
          <div class="dashboard-item">
            <h4>🛒 Orders</h4>
            <p>Track your recent and past orders.</p>
            <a href="orders.html" class="btn-small">View Orders</a>
          </div>
          <div class="dashboard-item">
            <h4>⚙ Account Settings</h4>
            <p>Update your personal information and password.</p>
            <a href="inprofile.html" class="btn-small">Edit Profile</a>
          </div>
          <div class="dashboard-item">
            <h4>💳 Payment Methods</h4>
            <p>Manage your saved payment options.</p>
            <a href="inprofile.html" class="btn-small">Manage Payments</a>
          </div>
        </div>
      </div>
      <div class="btn-btn">
      <a href="#" id="logoutBtn" class="btn">Log Out</a>
      </div>
      </div>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
       window.location.href = 'index.html';
    });
  }
});