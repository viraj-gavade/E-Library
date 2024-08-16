document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Simulate form submission and display a confirmation message
    document.getElementById('confirmationMessage').textContent = "Thank you for contacting us! We will get back to you soon.";

    // Optionally, clear the form fields
    document.getElementById('contactForm').reset();
});



//Debugging Statements

console.log(name,email,subject,message)