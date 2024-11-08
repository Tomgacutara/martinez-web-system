// Initialize the map
var map = L.map('map').setView([11.77528, 124.88611], 13);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var defaultLocation = [11.77528, 124.88611];
var marker = L.marker(defaultLocation).addTo(map);
marker.bindPopup("You are here!").openPopup();


let lastNotificationTimestamp = null;
let lastLogCount = 0;
let displayedLogIds = new Set();

// Function to search for a location
function searchLocation(query) {
    var url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
    document.getElementById('loading').style.display = 'block';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            if (data.length > 0) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                map.setView([lat, lon], 13);
                map.removeLayer(marker);
                
                // Add new marker at the searched location
                marker = L.marker([lat, lon]).addTo(map);
                marker.bindPopup(`<b>${data[0].display_name}</b>`).openPopup();
                map.invalidateSize();
            } else {
                alert("Location not found. Try again!");
            }
        })
        .catch(error => {
            document.getElementById('loading').style.display = 'none';
            console.error("Error:", error);
            alert("Failed to retrieve location information.");
        });
}


// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', function() {
    var query = document.getElementById('search').value;
    if (query) {
        searchLocation(query);
    } else {
        alert("Please enter a location.");
    }
});

// Event listener for bell button to toggle notification dropdown
document.getElementById('bellBtn').addEventListener('click', function() {
    var dropdown = document.getElementById('notificationsDropdown');
    // Toggle visibility
    dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
    if (dropdown.style.display === 'block') {
        fetchLogs();
        updateNotificationDisplay();
        //resetNotificationCount(); 
    }
});

// Close dropdown if clicked outside
document.addEventListener('click', function(event) {
    var dropdown = document.getElementById('notificationsDropdown');
    var bellButton = document.getElementById('bellBtn');
    
    if (!bellButton.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});





let notificationCount = 0;
let lastLogTimestamp = null; 
const displayedLogs = new Set(); 

// Fetch logs and handle notifications
const fetchLogs = async () => {
    try {
        const response = await fetch('https://martinez-web-system.onrender.com/logs');
        if (!response.ok) throw new Error('Failed to fetch logs');

        const logs = await response.json();
        const logEntries = logs.data || logs;

        // Filter logs to get only those newer than `lastLogTimestamp`
        const newLogs = logEntries.filter((log) => {
            const logDate = new Date(log.created_at || log.timestamp || log.content?.timestamp);
            return !lastLogTimestamp || logDate > lastLogTimestamp;
        });

        console.log("New logs since last fetch:", newLogs); // Diagnostics

        // Update notification count with the number of new logs, without clearing old notifications
        notificationCount = newLogs.length > 0 ? 1 : 0;
        updateNotificationDisplay();

        // Append only unique new logs to the notification list
        const notificationList = document.querySelector('.notifications-list');
        newLogs.forEach((log) => {
            const logId = log.id || log.timestamp || log.created_at;

            if (!displayedLogs.has(logId)) {
                displayedLogs.add(logId);

                try {
                    // Check if `log.content` exists and is a valid JSON string before parsing
                    const content = log.content ? JSON.parse(log.content) : null;

                    // Only proceed if `content` was successfully parsed
                    if (content) {
                        const email = content.email || 'No Email';
                        const timestamp = content.timestamp || log.created_at || 'No Timestamp';

                        const listItem = document.createElement('li');
                        listItem.className = 'notification-item';
                        listItem.innerHTML = `<span class="notification-email">${email}</span>
                                              <span class="notification-timestamp">${timestamp}</span>`;

                        notificationList.insertBefore(listItem, notificationList.firstChild);
                    } else {
                        console.warn('Log content is empty or not JSON formatted:', log.content);
                    }

                } catch (error) {
                    console.error('Error parsing log content:', error);
                }
            }
        });
    } catch (error) {
        console.error('Failed to fetch or process logs:', error);
    }
};


// Function to update notification count display
function updateNotificationDisplay() {
    const notifCount = document.getElementById('notificationCount');
    notifCount.textContent = notificationCount > 0 ? notificationCount : '';
}

// Reset notification count when bell is clicked but keep notifications in the list
document.getElementById('bellBtn').addEventListener('click', () => {
    const notificationElement = document.querySelector('#notificationCount');
    console.log(notificationElement);

    if (notificationElement) {
        notificationCount = 0; 
        updateNotificationDisplay();

        notificationElement.style.backgroundColor = 'transparent';
        notificationElement.style.display = 'none';
        notificationElement.removeAttribute('aria-label');  
        notificationElement.classList.remove('notification-active');
    } else {
        console.error("Notification element not found");
    }
    setTimeout(() => {
        console.log('Notification Count after clearing:', notificationElement.textContent);
    }, 100);
});

document.addEventListener('DOMContentLoaded', function() {
    function clearNotifications() {
        const notificationsList = document.querySelector('.notifications-list');
        const clearButton = document.querySelector('.clear-btn');
        while (notificationsList.firstChild) {
            notificationsList.removeChild(notificationsList.firstChild);
        }
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No notifications to display.';
        notificationsList.appendChild(emptyMessage);
        emptyMessage.classList.add('empty-message');
        if (notificationsList.children.length <= 1) {  
            clearButton.disabled = true;  
            clearButton.style.visibility = 'hidden';  
        } else {
            clearButton.disabled = false;  
            clearButton.style.visibility = 'visible';  
        }

    }
    window.clearNotifications = clearNotifications; 
});
//Log out function
document.getElementById("log-out-btn").addEventListener("click", function(event) {
    event.preventDefault();
    
    let confirmLogout = window.confirm("Are you sure you want to log out?");
    
    
    if (confirmLogout) {
        window.location.href = "../index.html";
    }
});




// Initial fetch for logs on page load
fetchLogs();

