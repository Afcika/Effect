document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) { // Check if elements exist
        hamburger.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            navLinks.classList.toggle('show-nav');
            console.log("Hamburger clicked! Menu is now: " + (navLinks.classList.contains('show-nav') ? "OPEN" : "CLOSED")); 
        });

        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('show-nav');
                console.log("Menu closed from outside click");
            }
        });
    } else {
        console.error("Hamburger or navLinks element not found.");
    }
});


