document.addEventListener('DOMContentLoaded', function() {
    const signupLink = document.getElementById('signupLink');
    const loginLink = document.getElementById('loginLink');
    const signupContainer = document.getElementById('signupContainer');
    const loginContainer = document.getElementById('loginContainer');
  
    // Show signup form by default
    signupContainer.classList.add('active');
  
    // Toggle to login form when "Login here" is clicked
    loginLink.addEventListener('click', function(event) {
      event.preventDefault();
      showLoginForm();
    });
  
    // Toggle to signup form when "Sign Up here" is clicked
    signupLink.addEventListener('click', function(event) {
      event.preventDefault();
      showSignupForm();
    });
  
    // Function to show signup form and hide login form
    function showSignupForm() {
      signupContainer.classList.add('active');
      loginContainer.classList.remove('active');
    }
  
    // Function to show login form and hide signup form
    function showLoginForm() {
      loginContainer.classList.add('active');
      signupContainer.classList.remove('active');
    }
  
    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
        
      console.log(username,email,password)
      axios.post('http://localhost:3000/api/v1/auth/signup', {
        username: username,
        email: email,
        password: password
      })
      .then(function(response) {
        console.log('Signup successful:', response.data);
        const signupMessage = document.getElementById('signupMessage');
        if (signupMessage) {
          signupMessage.textContent = 'Signup successful!';
        }
        // Example: Store token in localStorage
        // localStorage.setItem('token', response.data.token);
      })
      .catch(function(error) {
        console.error('Signup failed:', error);
        const signupMessage = document.getElementById('signupMessage');
        if (signupMessage) {
          signupMessage.textContent = 'Signup failed. Please try again.';
        }
      });
    });
  
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const loginUsername = document.getElementById('loginUsername').value;
      const loginPassword = document.getElementById('loginPassword').value;
      console.log(loginUsername,loginPassword)
      axios.post('http://localhost:3000/api/v1/auth/login', {
        username: loginUsername,
        password: loginPassword
      })
      .then(function(response) {
        console.log('Login successful:', response.data);
        const loginMessage = document.getElementById('loginMessage');
        if (loginMessage) {
          loginMessage.textContent = 'Login successful!';
        }
        localStorage.setItem('token', response.data.token);
        // Redirect or do something after successful login
        window.location.href = 'dashboard.html'; // Replace with your desired redirect URL
      })
      .catch(function(error) {
        console.error('Login failed:', error);
        const loginMessage = document.getElementById('loginMessage');
        if (loginMessage) {
          loginMessage.textContent = 'Login failed. Please try again.';
        }
      });
    });
  
    // Function to adjust forms based on active link
    function adjustForms() {
      if (loginLink.classList.contains('active')) {
        showLoginForm();
      } else {
        showSignupForm();
      }
    }
  
    // Initial adjustment on page load
    adjustForms();
  
    // Toggle active class and adjust forms when login or signup link is clicked
    loginLink.addEventListener('click', function() {
      loginLink.classList.add('active');
      signupLink.classList.remove('active');
      adjustForms();
    });
  
    signupLink.addEventListener('click', function() {
      signupLink.classList.add('active');
      loginLink.classList.remove('active');
      adjustForms();
    });
  });