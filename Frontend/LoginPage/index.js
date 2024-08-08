document.getElementById('toggleLogin').addEventListener('click', function() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('toggleLogin').classList.remove('active');
    document.getElementById('toggleRegister').classList.add('active');
});

document.getElementById('toggleRegister').addEventListener('click', function() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('toggleRegister').classList.remove('active');
    document.getElementById('toggleLogin').classList.add('active');
});

// Function to handle the login process
document.querySelector('#loginForm button[type="submit"]').addEventListener('click', function(e) {
    e.preventDefault();  // Prevent the default form submission
    
    const email = document.querySelector('#loginForm input[type="email"]').value;
    const password = document.querySelector('#loginForm input[type="password"]').value;

    //Debug statements
     console.log(email,password)

    // Replace the URL with your API endpoint
    axios.post('https://your-api-endpoint.com/login', {
        email: email,
        password: password
    })
    .then(function (response) {
        // Handle success (you can redirect or store tokens here)
        console.log('Login successful:', response.data);
        alert('Login successful!');
    })
    .catch(function (error) {
        // Handle error
        console.error('Error logging in:', error);
        alert('Login failed. Please check your credentials.');
    });
});
