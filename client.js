document.addEventListener("DOMContentLoaded", function () {
  const SERVER_URL = 'https://73.66.168.215:27770'; // Update with your server URL

  const loginSection = document.getElementById("login-section");
  const container = document.querySelector(".container");
  const loginBtn = document.getElementById("login-btn");
  const errorMessage = document.getElementById("login-error-message");
  const entryList = document.getElementById("entry-list");
  const journalEntry = document.getElementById("journal-entry");
  const postButton = document.getElementById("post-entry");
  const journalTab = document.getElementById("journal-tab");
  const journalContent = document.getElementById("journal-content");

  const registrationSection = document.getElementById("registration-section");
  const registerBtn = document.getElementById("register-btn");
  const submitRegistrationBtn = document.getElementById("submit-registration");
  const cancelRegistrationBtn = document.getElementById("cancel-registration");
  const registrationErrorMessage = document.getElementById("registration-error-message");

  const graphTab = document.getElementById("graph-tab");
  const graphContent = document.getElementById("graph-content");

  let currentUser = null;

  // Hide main content by default
  container.style.display = "none";

  loginBtn.addEventListener("click", function () {
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

  postButton.addEventListener("click", function () {
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

  registerBtn.addEventListener("click", function () {
    loginSection.style.display = "none";
    registrationSection.style.display = "block";
  });

  cancelRegistrationBtn.addEventListener("click", function () {
    registrationSection.style.display = "none";
    loginSection.style.display = "block";
  });

  submitRegistrationBtn.addEventListener("click", function () {
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

  // Add an event listener for the "Graph" tab
  graphTab.addEventListener("click", function () {
    // Hide the "Journal" tab content
    journalContent.style.display = "none";
    journalTab.classList.remove("active-tab");

    // Show the "Graph" tab content
    graphContent.style.display = "block";
    graphTab.classList.add("active-tab");

    // Load and display the graph (you need to implement this part)
    loadGraph();
  });

  function loadGraph() {
    // Fetch data from the server and create/update the graph here
    // You should use the Chart.js library to create the graph
    // Example:
    fetch(`${SERVER_URL}/graphData`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Create/update the graph using data
          createGraph(data.graphData);
        } else {
          // Handle error
          console.error("Error loading graph data.");
        }
      });
  }

  function createGraph(graphData) {
    // Use Chart.js to create/update the graph based on graphData
    // Example:
    const ctx = document.getElementById('entryGraph').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: graphData.labels,
        datasets: [{
          label: 'Entry Count',
          data: graphData.entryCount,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
});
