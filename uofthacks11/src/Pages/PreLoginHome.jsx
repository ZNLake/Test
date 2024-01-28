import './PreLogin.css'
import LoginButton from '../components/LoginButton.jsx'
import logo from '../assets/HackLogo.png'
import preLoginBackground from '../assets/PreLoginBackground.png'; // Import the background

function PreLogin() {
  return (
    <div className="container">
      <div className="box">
      <img src={logo} alt="Logo" />
      <p className='text-black'>Retro Vu</p>
      <LoginButton/>
      </div>
    </div>
  )
}

export default PreLogin
