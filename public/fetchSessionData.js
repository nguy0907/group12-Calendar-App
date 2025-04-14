let userData = null; // Initialize userData variable

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