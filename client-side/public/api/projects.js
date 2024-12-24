async function userExists(username) {
    try {
        const response = await fetch(`http://localhost:8000/api/login/userExists/${username}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.exists;
    } catch (error) {
        throw new Error(`Error checking user existence: ${error.message}`);
    }
}

// adding methods to window to make them accessible globally
window.userExists = userExists;