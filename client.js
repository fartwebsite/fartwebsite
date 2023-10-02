document.addEventListener("DOMContentLoaded", function() {
  const SERVER_URL = 'https://73.66.168.215:27770';  // Note: Added 'http://' for proper URL formation

  const loginSection = document.getElementById("login-section");
  const container = document.querySelector(".container");
  const loginBtn = document.getElementById("login-btn");
  const errorMessage = document.getElementById("login-error-message");
  const entryList = document.getElementById("entry-list");
  const journalEntry = document.getElementById("journal-entry");
  const postButton = document.getElementById("post-entry");

  const registrationSection = document.getElementById("registration-section");
  const registerBtn = document.getElementById("register-btn");
  const submitRegistrationBtn = document.getElementById("submit-registration");
  const cancelRegistrationBtn = document.getElementById("cancel-registration");
  const registrationErrorMessage = document.getElementById("registration-error-message");

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

  registerBtn.addEventListener("click", function() {
    loginSection.style.display = "none";
    registrationSection.style.display = "block";
  });

  cancelRegistrationBtn.addEventListener("click", function() {
    registrationSection.style.display = "none";
    loginSection.style.display = "block";
  });

  submitRegistrationBtn.addEventListener("click", function() {
    const enteredUsername = document.getElementById("register-username").value;
    const enteredPassword = document.getElementById("register-password").value;

    fetch(`${SERVER_URL}/register`, {
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
          registrationSection.style.display = "none";
          loginSection.style.display = "block";
        } else {
          registrationErrorMessage.textContent = data.message;
        }
      });
  });
});
