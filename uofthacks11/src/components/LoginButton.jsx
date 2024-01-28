import React from 'react';
import './LoginButton.css';

const LoginButton = () => {
  const handleLogin = () => {
    // Replace this with your custom authentication logic
    // For example, you can use fetch to make a request to your backend
    fetch('http://127.0.0.1:5173/login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // You can add any additional headers or authentication tokens here
      },
      // You can include any data needed for authentication in the body
      // For example, if you're sending credentials:
      // body: JSON.stringify({ username: 'yourUsername', password: 'yourPassword' }),
    })
      .then(response => {
        // Handle the response from your backend
        if (response.ok) {
          // Authentication successful, you may redirect or update the UI accordingly
          console.log('Authentication successful');
        } else {
          // Handle authentication failure
          console.error('Authentication failed');
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error during authentication:', error);
      });
  };

  return <button className="loginbutton" onClick={handleLogin}>Log In</button>;
};

export default LoginButton;
