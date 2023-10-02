document.addEventListener("DOMContentLoaded", function() {
  const loginSection = document.getElementById("login-section");
  const container = document.querySelector(".container");
  const loginBtn = document.getElementById("login-btn");
  const errorMessage = document.getElementById("login-error-message");

  // Hide main content by default
  container.style.display = "none";

  // Dummy username and password (change as needed)
  const correctUsername = "admin";
  const correctPassword = "password123";

  loginBtn.addEventListener("click", function() {
    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
      // If credentials are correct, hide login and show content
      loginSection.style.display = "none";
      container.style.display = "block";
    } else {
      errorMessage.textContent = "Invalid username or password!";
    }
  });

  // Event listeners and logic for your journal
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
  });
});
