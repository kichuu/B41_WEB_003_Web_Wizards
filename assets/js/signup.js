console.log("etst")
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value

    if (!name || !email || !password || !confirmPassword) {
      toastr.error("All fields are required!", "Validation Error")
      return
    }

    if (password !== confirmPassword) {
      toastr.error("Passwords do not match!", "Error")
      return
    }

    try {
      // Send signup request to backend
      const response = await fetch("http://localhost:5000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        toastr.success("Account created successfully!", "Welcome")
        setTimeout(() => {
          window.location.href = "./login.html"
        }, 2000)
      } else {
        const error = await response.json()
        toastr.error(error.message || "Signup failed!", "Error")
      }
    } catch (err) {
      toastr.error("An error occurred. Please try again later.", "Error")
      console.error(err)
    }
  })
