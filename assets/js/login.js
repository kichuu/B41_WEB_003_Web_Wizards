const BASE_URL = "https://b41web003webwizards-production-bc76.up.railway.app";

// Redirect to dashboard if the user is already logged in
if (localStorage.getItem("token")) {
  window.location.href = "./dashboard.html";
}

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Switch between Login and Signup forms
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// Handle Login Form Submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#loginForm #email2").value;
  const password = document.querySelector("#loginForm #password2").value;

  if (!email || !password) {
    alert("Email and password are required!");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "./dashboard.html";
    } else {
      const error = await response.json();
      alert(`Login failed: ${error.message}`);
    }
  } catch (err) {
    alert("An error occurred. Please try again later.");
    console.error(err);
  }
});

// Handle Signup Form Submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#signupForm #name").value;
  const email = document.querySelector("#signupForm #email").value;
  const password = document.querySelector("#signupForm #password").value;
  const confirmPassword = document.querySelector("#signupForm #confirm-password").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("All fields are required!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      alert("Account created successfully! You can now sign in.");
      loginForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
    } else {
      const error = await response.json();
      alert(`Signup failed: ${error.message}`);
    }
  } catch (err) {
    alert("An error occurred. Please try again later.");
    console.error(err);
  }
});
