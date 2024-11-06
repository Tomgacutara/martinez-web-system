// Function to handle signup
document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('/signup', { email, password });
        document.getElementById('notification').innerText = 'Signup successful!';
        console.log(response.data); 
    } catch (error) {
        document.getElementById('notification').innerText = error.response.data.message;
    }
});


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('/login', { email, password });
        document.getElementById('notification').innerText = 'Login successful!';
        console.log(response.data); 
    } catch (error) {
        document.getElementById('notification').innerText = error.response.data.message;
    }
});
