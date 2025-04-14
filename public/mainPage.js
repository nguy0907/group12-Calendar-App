async function initializePage() {
  await fetchSessionData(); // Wait for fetchSessionData to complete
  if (userData) {
    document.getElementById("user-greeting").textContent =
      "Welcome, " + userData.UserName; // Display the username
  }
}

async function logoutUser() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // You can add additional data here if required
    });

    if (response.ok) {
      // Redirect to the login page or show a success message
      window.location.href = "/login"; // Adjust the URL as needed
    } else {
      console.error("Failed to logout:", response.status);
      alert("Logout failed. Please try again.");
    }
  } catch (error) {
    console.error("Error while logging out:", error);
    alert("An error occurred. Please try again.");
  }
}

initializePage(); // Call the function to initialize the page
