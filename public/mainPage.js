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

async function fetchSocialPosts() {
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
    const response = await fetch("/calendartasks");
    if (response.ok) {
      const tasks = await response.json();
      return tasks;
    } else {
      console.error("Error fetching tasks, status:", response.status);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

async function deleteCalendarTask(taskID) {
  try {
    const response = await fetch(`/calendartasks/removetask/${taskID}`, {
      method: "DELETE"
    });
    if (response.ok) {
      return true; // Indicates successful deletion
    } else {
      console.error('Failed to delete task, status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

function renderSocialPosts(posts) {
  const container = document.getElementById("socialPosts");
  container.innerHTML = ""; // Clear any existing posts

  posts.forEach(post => {
    // Create a container for each post
    const postDiv = document.createElement("div");
    postDiv.classList.add("post-item");
    postDiv.style.border = "1px solid #ccc";
    postDiv.style.padding = "10px";
    postDiv.style.marginBottom = "10px";
    postDiv.style.background = "#f9f9f9";

    // Insert post details
    postDiv.innerHTML = `
      <h3>${post.PostTitle}</h3>
      <p>${post.PostContent}</p>
      <p>${post.UserName}</p>
      <p><small>Posted on: ${new Date(post.DateCreated).toLocaleString()}</small></p>
    `;

    container.appendChild(postDiv);
  });
}

function renderCalendarTasks(tasks) {
  const container = document.getElementById("calendarTasks");
  console.log(container);
  container.innerHTML = ""; // Clear any existing tasks

  tasks.forEach(task => {
    // Create a container for each task
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-item");
    taskDiv.style.border = "1px solid #ccc";
    taskDiv.style.padding = "10px";
    taskDiv.style.marginBottom = "10px";
    
    // Insert task details in the task item
    taskDiv.innerHTML = `
      <h3>${task.Title}</h3>
      <p>${task.Description}</p>
      <p><small>${new Date(task.Date).toLocaleString()}</small></p>
    `;

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Task";
    deleteBtn.style.marginTop = "5px";
    deleteBtn.style.padding = "5px 10px";
    deleteBtn.style.cursor = "pointer";

    // Create edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit Task";
    editBtn.style.marginTop = "5px";
    editBtn.style.padding = "5px 10px";
    editBtn.style.cursor = "pointer";
    
    // Add click event to perform deletion
    deleteBtn.addEventListener("click", async () => {
      const confirmed = confirm(`Are you sure you want to delete "${task.Title}"?`);
      if (confirmed) {
        const success = await deleteCalendarTask(task.CTID);
        if (success) {
          // Remove the task from the UI, or re-fetch tasks from the server
          taskDiv.remove();
        } else {
          alert("There was an error deleting the task.");
        }
      }
    });


    // Add click event for editing
    editBtn.addEventListener("click", () => {
      // Redirect to the edit page with taskID as a query parameter
      window.location.href = `/calendartasks/edittask?taskid=${task.CTID}`;
    });

    // Append the delete button to the task container
    taskDiv.appendChild(deleteBtn);
    taskDiv.appendChild(editBtn);
    container.appendChild(taskDiv);
  });
}

// Main routine to sequentially get session data, social posts, and calendar tasks.
async function initializeDashboard() {
  // 1. Fetch session data first
  await fetchSessionData();

  // If user data exists, fetch their social posts and calendar tasks
  if (userData && userData.userID) {
    // Display session information in the page
    document.getElementById('userInfo').innerHTML = `<pre>${JSON.stringify(userData, null, 2)}</pre>`;
    
    // 2. Fetch and render social posts
    const posts = await fetchSocialPosts();
    if (posts) {
      renderSocialPosts(posts);
      //document.getElementById('socialPosts').innerHTML = `<pre>${JSON.stringify(posts, null, 2)}</pre>`;
    } else {
      document.getElementById('socialPosts').textContent = 'No social posts available';
    }
    
    // 3. Fetch and render calendar tasks
    const tasks = await fetchCalendarTasks();
    console.log(tasks);
    if (tasks) {
      console.log(tasks);
      renderCalendarTasks(tasks);
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