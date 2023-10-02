document.addEventListener("DOMContentLoaded", function() {
  const loginSection = document.getElementById("login-section");
  const container = document.querySelector(".container");
  const loginBtn = document.getElementById("login-btn");
  const errorMessage = document.getElementById("login-error-message");

  // Hide main content by default
  container.style.display = "none";

  // Dummy username and password
  const correctUsername = "password";
  const correctPassword = "password";

  loginBtn.addEventListener("click", function() {
    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
      loginSection.style.display = "none";
      container.style.display = "block";
    } else {
      errorMessage.textContent = "Invalid username or password!";
    }
  });

  const entryList = document.getElementById("entry-list");
  const journalEntry = document.getElementById("journal-entry");
  const postButton = document.getElementById("post-entry");

  postButton.addEventListener("click", function() {
    const selectedNumber = document.querySelector('input[name="number"]:checked');
    const entryText = journalEntry.value.trim();

    if (!selectedNumber || entryText === "") {
      alert("Please select a number and write an entry.");
      return;
    }

    const date = new Date().toLocaleDateString();
    const listItem = document.createElement("li");
    listItem.textContent = `${date}: ${selectedNumber.value} - ${entryText}`;
    entryList.appendChild(listItem);

    journalEntry.value = "";
    selectedNumber.checked = false;

    // Update graph data
    entryDates.push(date);
    entryNumbers.push(Number(selectedNumber.value));

    // Update graph
    entryChart.update();
  });

  // Variables for tabs
  const journalTab = document.getElementById("journal-tab");
  const graphTab = document.getElementById("graph-tab");
  const journalContent = document.getElementById("journal-content");
  const graphContent = document.getElementById("graph-content");

  journalTab.addEventListener("click", function() {
    graphContent.style.display = "none";
    journalContent.style.display = "block";
    journalTab.classList.add("active-tab");
    graphTab.classList.remove("active-tab");
  });

  graphTab.addEventListener("click", function() {
    journalContent.style.display = "none";
    graphContent.style.display = "block";
    graphTab.classList.add("active-tab");
    journalTab.classList.remove("active-tab");
  });

  // Variables for the graph
  let entryDates = [];
  let entryNumbers = [];

  let ctx = document.getElementById('entryGraph').getContext('2d');
  let entryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: entryDates,
      datasets: [{
        label: 'Journal Entry Numbers',
        data: entryNumbers,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  });
});
