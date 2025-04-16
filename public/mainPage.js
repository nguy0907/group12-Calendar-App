async function initializePage() {
  await fetchSessionData(); // Wait for fetchSessionData to complete
  if (userData) {
    document.getElementById("user-greeting").textContent =
      "Welcome, " + userData.UserName; // Display the username
  }
}

async function fetchSessionData() {
    try {
      const response = await fetch('/session'); // we await the response from the server
      if (response.ok) {
        userData = await response.json(); // then we await the data to be parsed as JSON    
      } else {
        console.error('Failed to fetch session data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
    }
  }

async function fetchSocialPosts(userID) {
  try {
    // Calls the social posts API with a query parameter for the author/user id
    const response = await fetch(`/socialposts`);
    if (response.ok) {
      const socialPosts = await response.json();
      console.log('Social Posts:', socialPosts);
      return socialPosts;
    } else {
      console.error('Failed to fetch social posts:', response.status);
    }
  } catch (error) {
    console.error('Error fetching social posts:', error);
  }
}

async function fetchCalendarTasks() {
  try {
    // Calls the calendar tasks API. The server automatically filters tasks based on session.
    const response = await fetch('/calendartasks');
    if (response.ok) {
      const calendarTasks = await response.json();
      console.log('Calendar Tasks:', calendarTasks);
      return calendarTasks;
    } else {
      console.error('Failed to fetch calendar tasks:', response.status);
    }
  } catch (error) {
    console.error('Error fetching calendar tasks:', error);
  }
}

// Main routine to sequentially get session data, social posts, and calendar tasks.
async function initializeDashboard() {
  // 1. Fetch session data first
  await fetchSessionData();

  // If user data exists, fetch their social posts and calendar tasks
  if (userData && userData.userID) {
    // Display session information in the page
    document.getElementById('userInfo').innerHTML = `<pre>${JSON.stringify(userData, null, 2)}</pre>`;
    
    // 2. Fetch social posts
    const posts = await fetchSocialPosts(userData.userID);
    if (posts) {
      document.getElementById('socialPosts').innerHTML = `<pre>${JSON.stringify(posts, null, 2)}</pre>`;
    } else {
      document.getElementById('socialPosts').textContent = 'No social posts available';
    }
    
    // 3. Fetch calendar tasks
    const tasks = await fetchCalendarTasks();
    if (tasks) {
      document.getElementById('calendarTasks').innerHTML = `<pre>${JSON.stringify(tasks, null, 2)}</pre>`;
    } else {
      document.getElementById('calendarTasks').textContent = 'No tasks available';
    }
  } else {
    document.getElementById('userInfo').textContent = 'User not logged in.';
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

let userData = null; // Initialize userData variable

// Ensure that the DOM has loaded before running the initialize function
document.addEventListener('DOMContentLoaded', () => {
  initializePage(); // Call the function to initialize the page
  initializeDashboard();
});