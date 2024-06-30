document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        loadGroups();
        loadStoredMessages();
    } else {
        document.getElementById('login-container').style.display = 'block';
    }
});


document.getElementById('group-select').addEventListener('change', function () {
    document.getElementById('chat-messages').innerHTML = '';
    loadStoredMessages();
});

document.getElementById('login-button').addEventListener('click', async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        loadGroups();
        loadStoredMessages();
    } else if (response.status === 401) {
        alert('User not authorized');
    } else if (response.status === 404) {
        alert('User not found');
    } else {
        alert('Error logging in, please try again');
    }
});


document.getElementById('create-group-button').addEventListener('click', async function() {
    const name = document.getElementById('group-name').value;
    const description = document.getElementById('group-description').value;

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/group/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
    });

    if (response.status === 201) {
        alert('Group created successfully');
        loadGroups();
    } else {
        alert('Error creating group');
    }
});

document.getElementById('add-user-button').addEventListener('click', async function() {
    const username = document.getElementById('add-user-name').value;
    const groupId = document.getElementById('group-select').value;

    if (!groupId) {
        alert('Please select a group');
        return;
    }

    if (!username) {
        alert('Please enter a user ID');
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/group/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username, groupId })
        });

        if (response.ok) {
            const groupSelect = document.getElementById('group-select');
            const groupName = groupSelect.options[groupSelect.selectedIndex].text;
            const groupMessage = document.getElementById('group-message');
            groupMessage.textContent = `Group: ${groupName}`;
            groupMessage.style.display = 'block';

            alert(`You have successfully entered the group: ${groupName}`);

            // Load and display the messages of the newly joined group
            document.getElementById('chat-messages').innerHTML = ''; // Clear existing messages
            await loadChatMessages(); // Load messages for the selected group
        } else {
            throw new Error('Failed to add user to group');
        }
    } catch (error) {
        console.error('Error adding user to group:', error.message);
        alert('Error adding user to group. Please try again.');
    }
});


ddocument.getElementById('send-button').addEventListener('click', sendMessage);

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();
    const groupId = document.getElementById('group-select').value;

    if (messageText === '') {
        return;
    }

    let token = localStorage.getItem('token');
    const userId = await getUserIdFromToken(token); // Function to get userId from token
    let url, body;

    if (!groupId) {
        url = 'http://localhost:3000/chat';
        body = { message: messageText, userId };
    } else {
        url = 'http://localhost:3000/group/send-message';
        body = { message: messageText, groupId, userId };
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    if (response.status === 401) {
        token = await refreshAccessToken();
        if (token) {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
        }
    }

    if (response.status === 201) {
        const data = await response.json();
        displayMessage(data, groupId);
        storeMessage(data, groupId);

        messageInput.value = '';
        document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
    } else {
        alert('Error sending message');
    }
}

function storeMessage(msg, groupId) {
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    if (!messages.find(m => m.id === msg.id)) {
        messages.push({ ...msg, groupId });
        localStorage.setItem('messages', JSON.stringify(messages));
    }
}

function loadStoredMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const groupId = document.getElementById('group-select').value;
    const filteredMessages = messages.filter(msg => msg.groupId == groupId || (!msg.groupId && !groupId));
    document.getElementById('chat-messages').innerHTML = '';
    filteredMessages.forEach(message => {
        displayMessage(message, groupId);
    });
}

function displayMessage(msg, groupId) {
    console.log('Displaying message:', msg); // Log the message object

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Log all keys and nested structures
    console.log('Message properties:', Object.keys(msg));
    if (msg.User) {
        console.log('User properties:', Object.keys(msg.User));
    }
    if (msg.sender) {
        console.log('Sender properties:', Object.keys(msg.sender));
    }

    // Try different paths to find the username
    let userName = 'Unknown';
    if (msg.User && msg.User.name) {
        userName = msg.User.name;
    } else if (msg.sender && msg.sender.name) {
        userName = msg.sender.name;
    } else if (msg.user && msg.user.name) {
        userName = msg.user.name;
    } else if (msg.username) {
        userName = msg.username;
    }

    messageElement.textContent = `${userName}: ${msg.message}`;

    document.getElementById('chat-messages').appendChild(messageElement);
    document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
}

async function loadChatMessages() {
    const token = localStorage.getItem('token');
    const groupId = document.getElementById('group-select').value;
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    const groupMessages = messages.filter(msg => msg.groupId == groupId);
    const lastMessageTime = groupMessages.length > 0 ? new Date(groupMessages[groupMessages.length - 1].createdAt).getTime() : 0;

    try {
        let url;
        if (groupId) {
            url = `http://localhost:3000/group/${groupId}/messages/since/${lastMessageTime}`;
        } else {
            url = `http://localhost:3000/chat/since/${lastMessageTime}`;
        }

        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            token = await refreshAccessToken();
            if (token) {
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        }

        if (response.status === 200) {
            const newMessages = await response.json();
            console.log('Fetched messages:', newMessages); // Log the raw response

            if (Array.isArray(newMessages)) {
                newMessages.forEach(message => {
                    displayMessage(message, groupId);
                    storeMessage(message, groupId);
                });
            } else if (newMessages && typeof newMessages === 'object' && Array.isArray(newMessages.messages)) {
                // Handle case where messages are nested in an object
                newMessages.messages.forEach(message => {
                    displayMessage(message, groupId);
                    storeMessage(message, groupId);
                });
            } else {
                console.error('Expected an array of messages but got:', newMessages);
                alert('Error loading chat messages: Invalid response format.');
            }
        } else {
            alert('Error loading new messages: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error loading chat messages:', error); // Log the error
        alert('Error loading chat messages: ' + error.message);
    }
}


async function refreshAccessToken() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/user/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            return data.token;
        } else {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token');
            document.getElementById('login-container').style.display = 'block';
            document.getElementById('chat-container').style.display = 'none';
            return null;
        }
    } catch (error) {
        console.error('Error refreshing access token:', error.message);
        alert('Error refreshing access token: ' + error.message);
        return null;
    }
}

async function getUserIdFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
}

async function loadGroups() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/group', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const groups = await response.json();
            console.log('Fetched groups:', groups);

            const groupSelect = document.getElementById('group-select');
            groupSelect.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select Group';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            groupSelect.appendChild(defaultOption);

            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.text = group.name;
                groupSelect.appendChild(option);
            });

            groupSelect.addEventListener('change', function () {
                document.getElementById('chat-messages').innerHTML = '';
                loadStoredMessages();
            });

        } else {
            throw new Error('Failed to load groups');
        }
    } catch (error) {
        console.error('Error loading groups:', error.message);
        alert('Error loading groups. Please try again.');
    }
}
