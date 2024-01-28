import LogoutButton from '../Components/LogoutButton'
import logo from '../assets/HackLogo.png'
import './PostLogin.css'
import FileZone from '../components/FileZone.jsx'
import VerticalCarousel from '../components/VerticalCarousel.jsx';
import { useAuth0 } from "@auth0/auth0-react";

function PostLogin() {

const { user} = useAuth0();
const username = user.name;
fetch('http://localhost:4173/getuser/username', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(user)
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
  console.error('Error:', error);
});

  const carouselItems = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
    { title: 'Item 4', description: 'Description for Item 4' },
    // Add more items as needed
  ];

  return (
    <>
    <div className='overallContainer'>
    <LogoutButton/>
    <a href='/AlbumView'><button className='button'>View Albums</button></a>
    <button className='button'>Create Album</button>
    <div className='wrapper'>
      <div className='uploadContainer'>
        <div>
          <img className='logo' src={logo} alt="Logo" />
          <span className='text-black font-bold'>** Name Here**</span>
        </div>
        <FileZone/>
      </div>
      <div className='mainPageWrapper'>
        <p className='containerTitle'>
        Albums
        </p>
         <div>
      <VerticalCarousel className="h-full" items={carouselItems} />
    </div>
      </div>
    </div>
        </div>
    </>
  )
}

export default PostLogin
