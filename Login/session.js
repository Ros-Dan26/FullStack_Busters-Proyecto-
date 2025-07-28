document.addEventListener("DOMContentLoaded", function () {
  const userDropdown = document.getElementById("userDropdown");
  const loginButton = document.getElementById("loginButton");
  const usernameDisplay = document.getElementById("usernameDisplay");

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user && user.username) {
    loginButton.style.display = "none";
    usernameDisplay.textContent = user.username;
    userDropdown.style.display = "block";
  } else {
    loginButton.style.display = "block";
    userDropdown.style.display = "none";
  }
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "logout.html";
}
