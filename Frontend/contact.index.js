// Toggle the navigation menu on small screens
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Gather form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  console.log(name, email, subject, message);

  // Create an object to send
  const formData = {
      name: name,
      email: email,
      subject: subject,
      message: message
  };

  console.log(formData);

  // Send the form data to the server using Axios
  axios.post('http://localhost:5000/api/v1/library/user/contactform', formData)
      .then(function(response) {
          console.log('Form submission successful:', response.data);
          document.getElementById('confirmationMessage').textContent = 'Thank you for contacting us! We will get back to you soon.';
      })
      .catch(function(error) {
          console.error('Form submission failed:', error);
          document.getElementById('confirmationMessage').textContent = 'Submission failed. Please try again.';
      });

  // Optionally, clear the form fields
  document.getElementById('contactForm').reset();
});
