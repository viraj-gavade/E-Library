function updateUsername() {
    const username = document.getElementById('username').value;

    fetch('https://your-api-endpoint.com/update-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        alert('Username updated successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error updating your username.');
    });
}

function updateEmail() {
    const email = document.getElementById('email').value;

    fetch('https://your-api-endpoint.com/update-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        alert('Email updated successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error updating your email.');
    });
}

function updateProfilePicture() {
    const profileImg = document.getElementById('profileImg').files[0];
    
    if (profileImg) {
        const formData = new FormData();
        formData.append('profileImg', profileImg);

        fetch('https://your-api-endpoint.com/update-profile-picture', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('Profile picture updated successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error updating your profile picture.');
        });
    } else {
        alert('Please select a profile picture.');
    }
}

function updatePassword() {
    const password = document.getElementById('password').value;

    fetch('https://your-api-endpoint.com/update-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    })
    .then(response => response.json())
    .then(data => {
        alert('Password updated successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error updating your password.');
    });
}

// Ensure Axios is included in your project. You can include it via CDN in your HTML file:
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

function getProfileInfo() {
    axios.get('http://localhost:5000/api/v1/library/user/my-profile')
        .then(response => {
            // Assuming the API response contains the profile information
            const profileData = response.data;

            // Update the account card with the retrieved data
            document.getElementById('profileImg').src = profileData.profileImg;
            document.getElementById('username').textContent = profileData.username;
            document.getElementById('email').textContent = profileData.email;
        })
        .catch(error => {
            console.error('Error fetching profile information:', error);
            alert('There was an error fetching your profile information.');
        });
}

// Call the function to get profile info when the page loads
document.addEventListener('DOMContentLoaded', function() {
    getProfileInfo();
});
