import './LoginButton.css';

const LoginButton = () => {
  const handleLogin = () => {
    // Replace this with your custom authentication logic
    // For example, you can use fetch to make a request to your backend
    'http://localhost:5173/PostHome'
  };

  return <button className="loginbutton" onClick={handleLogin}>Log In</button>;
};

export default LoginButton;
