document.addEventListener("DOMContentLoaded", function() {
    const SERVER_URL = 'http://YOUR_SERVER_IP:3000';  // Replace with your server's IP and port

    const loginSection = document.getElementById("login-section");
    const container = document.querySelector(".container");
    const loginBtn = document.getElementById("login-btn");
    const errorMessage = document.getElementById("login-error-message");
    const entryList = document.getElementById("entry-list");
    const journalEntry = document.getElementById("journal-entry");
    const postButton = document.getElementById("post-entry");

    let currentUser = null;

    // Hide main content by default
    container.style.display = "none";

    loginBtn.addEventListener("click", function() {
        const enteredUsername = document.getElementById("username").value;
        const enteredPassword = document.getElementById("password").value;

        fetch(`${SERVER_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: enteredUsername,
                password: enteredPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // If login is successful, hide the login and show content
                loginSection.style.display = "none";
                container.style.display = "block";
                currentUser = enteredUsername;
                loadUserEntries();
            } else {
                errorMessage.textContent = "Invalid username or password!";
            }
        });
    });

    function loadUserEntries() {
        fetch(`${SERVER_URL}/getEntries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: currentUser
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.entries) {
                displayEntries(data.entries);
            }
        });
    }

    function displayEntries(entries) {
        entryList.innerHTML = '';
        entries.forEach(entry => {
            const listItem = document.createElement("li");
            listItem.textContent = `${entry.date}: ${entry.number} - ${entry.text}`;
            entryList.appendChild(listItem);
        });
    }

    postButton.addEventListener("click", function() {
        const selectedNumber = document.querySelector('input[name="number"]:checked');
        const entryText = journalEntry.value.trim();

        if (!selectedNumber || entryText === "") {
            alert("Please select a number and write an entry.");
            return;
        }

        const entryData = {
            date: new Date().toLocaleDateString(),
            number: selectedNumber.value,
            text: entryText
        };

        fetch(`${SERVER_URL}/postEntry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: currentUser,
                entry: entryData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Successfully posted the entry, reload entries
                loadUserEntries();
                journalEntry.value = "";
                selectedNumber.checked = false;
            } else {
                // Handle the error
                alert("There was an error posting the entry. Please try again.");
            }
        });
    });
});
