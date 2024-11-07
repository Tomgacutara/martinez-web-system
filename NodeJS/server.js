const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

const allowedOrigins = [
    'https://tomgacutara.github.io',
    'http://127.0.0.1:5501',
    'http://localhost:5501'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); 
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Optional: only if needed for authentication with credentials
}));

// Preflight requests handler for all routes
app.options('*', cors());


app.post('/login', (req, res) => {
    const { email, timestamp, message } = req.body;

    console.log(`Login data received: ${email}, ${timestamp}, ${message}`);

    // Ensure the data is correctly received and logged
    if (!email || !timestamp || !message) {
        console.error('Missing required fields: email, timestamp, or message.');
        return res.status(400).send('Bad request: Missing fields.');
    }

    // Send data to the webhook
    const webhookUrl = "https://webhook.site/3f3aff1d-872e-45be-8309-828b82015761";
    axios.post(webhookUrl, {
        email: email,
        timestamp: timestamp,
        message: message
    })
    .then(() => {
        console.log('Data sent to webhook successfully.');
        res.status(200).send('Login data received and sent to webhook successfully.');
    })
    .catch((error) => {
        // Log the specific error message to understand the issue
        console.error('Error sending data to webhook:', error.message);
        console.error('Full error stack:', error.stack);
        res.status(500).send('Error sending data to webhook');
    });
});

// New route to retrieve logs from webhook.site
app.get('/logs', async (req, res) => {
    try {
        const response = await axios.get('https://webhook.site/token/3f3aff1d-872e-45be-8309-828b82015761/requests');
        res.json(response.data); // Send the logs data as JSON to the client
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
