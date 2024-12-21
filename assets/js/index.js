document.addEventListener('DOMContentLoaded', () => {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const contactLink = document.querySelector('.navbar-links a[href="#contact"]');
    const contactForm = document.getElementById('contact-us-form');
    const contactFormElement = document.getElementById('contact-form');
    const closeButton = document.querySelector('.close-btn'); // Target the close button in HTML

    // Loader timeout
    setTimeout(() => {
        loaderWrapper.style.display = 'none';
    }, 2000);

    // Toggle visibility of the contact form
    const toggleContactForm = (action) => {
        if (action === 'show') {
            contactForm.classList.add('visible');
            contactForm.classList.remove('hidden');
        } else if (action === 'hide') {
            contactForm.classList.add('hidden');
            contactForm.classList.remove('visible');
        }
    };

    // Show Contact Us form when clicking the navbar link
    contactLink.addEventListener('click', (event) => {
        event.preventDefault();
        toggleContactForm('show');
    });

    // Close the contact form when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!contactForm.contains(event.target) && !contactLink.contains(event.target)) {
            if (contactForm.classList.contains('visible')) {
                toggleContactForm('hide');
            }
        }
    });

    // Close the contact form when clicking the close button
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from bubbling up to the document
        toggleContactForm('hide');
    });

    // Handle form submission
    contactFormElement.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const feedback = document.getElementById('feedback').value;

        if (email && feedback) {
            alert('Your feedback has been submitted successfully.');

            // Reset the form and close it
            contactFormElement.reset();
            toggleContactForm('hide');
        } else {
            alert('Please fill out both email and feedback fields.');
        }
    });
});
