const BASE_URL = 'https://b41web003webwizards-production-bc76.up.railway.app'

// document.querySelector("form").addEventListener("submit", (e) => {
//     e.preventDefault();
//     window.location.href = "./dashboard.html";
// })

// Handle Login Form Submission
  if (localStorage.getItem("token")) {
    window.location.href = "./dashboard.html"
  }
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault() 

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    // Send Login Request to Deployed or localHost Backend
    const response = await fetch(
      `${BASE_URL}/api/users/login/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    )

    if (response.ok) {
      const data = await response.json()
      // Save Token in LocalStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      alert("Login successful! Redirecting to dashboard...")
      // Redirect to Dashboard
      window.location.href = "./dashboard.html"
    } else {
      const error = await response.json()
    //   console.log(`Login failed: ${error.message}`)
      alert(`Login failed: ${error.message}`)
    }
  } catch (err) {
    alert("An error occurred. Please try again later.")
    console.error(err)
  }
})

