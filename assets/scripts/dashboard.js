// Select the container where content will be loaded
const contentContainer = document.getElementById("content");

// Function to load a page dynamically
function loadPage(page) {
    // Fetch the content of the page
    fetch(`../pages/${page}`)
        .then((response) => response.text())
        .then((html) => {
            // Insert the fetched content into the container
            contentContainer.innerHTML = html;

            // Save the current page to localStorage
            localStorage.setItem("currentPage", page);
        })
        .catch((error) => {
            console.error("Error loading page:", error);
            contentContainer.innerHTML = `<p>Error loading page. Please try again later.</p>`;
        });
}

// Add event listeners to navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default link behavior

        // Get the page to load from the data-page attribute
        const page = link.getAttribute("data-page");
        loadPage(page);
    });
});

// Load the last visited page or default to task.html
window.addEventListener("DOMContentLoaded", () => {
    const lastPage = localStorage.getItem("currentPage") || "task.html";
    loadPage(lastPage);
});
