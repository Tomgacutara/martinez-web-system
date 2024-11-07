
// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCQpq2MxwwJPrstiK-7HZHEZ6Ckwqgkbkc",
    authDomain: "sia101-midtermoutput-phase1.firebaseapp.com",
    projectId: "sia101-midtermoutput-phase1",
    storageBucket: "sia101-midtermoutput-phase1.appspot.com",
    messagingSenderId: "628463087202",
    appId: "1:628463087202:web:d091af762c7319583aab3b",
    measurementId: "G-YV3580ZPPR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const notification = document.getElementById('notification');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            notification.classList.remove('error', 'success');
            notification.textContent = '';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                notification.textContent = 'Please fill in all fields.';
                notification.classList.add('error');
                return;
            }

            // Display loading message
            notification.textContent = 'Logging in...';
            notification.classList.add('loading');

            // Attempt to sign in with Firebase Authentication
            auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    //This is the Time Format 
                    const date = new Date();
                    const timestamp = date.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    });
                    console.log('Login successful!');

                    
                    return axios.post('https://martinez-web-system.onrender.com/login', {
                        email: email,
                        timestamp: timestamp,
                        message: "Log in Successfully!."
                    });
                })
                .then(response => {
                    notification.classList.remove('loading');
                    notification.classList.add('success');
                    notification.textContent = "Login successful!";
                    
                    console.log('Data sent successfully to Node.js server');

                    
                    setTimeout(() => {
                        window.location.href = "html/map.html"; 
                    }, 5000);
                })
                .catch((error) => {
                    notification.classList.remove('loading');
                    notification.classList.add('error');
                    notification.textContent = `Error: ${error.message}`;
                    console.error('Error during login process:', error);
                });
        });
    } else {
        console.error("Login form not found!");
    }
});

const passwordInput = document.getElementById('password');
const showPasswordButton = document.getElementById('show-password');

showPasswordButton.addEventListener('click', () => {
    
    const icon = showPasswordButton.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        showPasswordButton.textContent = ' ';
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        showPasswordButton.textContent = '';
    }

    
    showPasswordButton.prepend(icon);
});



