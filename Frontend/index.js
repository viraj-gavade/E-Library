document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});
document.addEventListener('DOMContentLoaded', function() {
    // Define the navigation links
    const navLinks = [
        { href: "#home", text: "Home" },
        { href: "#books", text: "Books" },
        { href: "#about", text: "About" },
        { href: "contact.index.html", text: "Contact" }
    ];

    // Get the nav-links container
    const navLinksContainer = document.getElementById('nav-links');

    // Generate nav items and append them to the container
    navLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        li.appendChild(a);
        navLinksContainer.appendChild(li);
    });
});