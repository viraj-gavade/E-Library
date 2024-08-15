document.getElementById("switchToRegister").addEventListener("click", function() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
});

document.getElementById("switchToLogin").addEventListener("click", function() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});




const registerForm = document.getElementById('register');
registerForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('username', document.getElementById('username').value);
  formData.append('email', document.getElementById('email').value);
  formData.append('password', document.getElementById('password').value);
  formData.append('profileImg', document.getElementById('profileImg').files[0]);

  axios.post('http://localhost:5000/api/v1/library/user/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
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



const loginForm = document.getElementById('login');
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const loginData = {
    username: document.getElementById('loginUsername').value,
    password: document.getElementById('loginPassword').value
  };

  axios.post('http://localhost:5000/api/v1/library/user/login', loginData)
  .then(function(response) {
    console.log('Login successful:', response.data);
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
      loginMessage.textContent = 'Login successful!';
    }
    // Example: Store token in localStorage
    // localStorage.setItem('token', response.data.token);

    // Optionally, redirect the user after login
    // window.location.href = '/dashboard';
  })
  .catch(function(error) {
    console.error('Login failed:', error);
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
      loginMessage.textContent = 'Login failed. Please check your credentials.';
    }
  });
});