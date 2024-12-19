// Handle Login Form Submission
console.log("test")
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault() 

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    // Send Login Request to Deployed or localHost Backend
    const response = await fetch(
      "http://localhost:5000/api/users/login/",
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