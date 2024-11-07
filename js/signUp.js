import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js"; // Realtime Database

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

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); 

document.getElementById('signup-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message');

    // Check if passwords match
    if (password !== confirmPassword) {
        messageElement.textContent = "Passwords do not match.";
        messageElement.style.color = "red";
        return;
    }

    // Create a new user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save a notification event to the database
            saveNotification(user.uid, user.email);

            
            messageElement.style.color = "blue";
            messageElement.textContent = "Sign up successfully!";

           
            setTimeout(() => {
                window.location.href = "../index.html"; 
            }, 1000);
        })
        .catch((error) => {
            messageElement.style.color = "red";
            messageElement.textContent = error.message;
        });
});

// Function to save a new notification in Firebase Realtime Database
function saveNotification(userId, email) {
    const notificationRef = ref(database, 'notifications/' + userId);
    set(notificationRef, {
        message: `New user signed up: ${email}`,
        timestamp: new Date().toISOString()
    });
}




