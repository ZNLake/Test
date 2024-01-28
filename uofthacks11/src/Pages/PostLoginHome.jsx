import LogoutButton from '../components/LogoutButton'
import logo from '../assets/HackLogo.png'
import './PostLogin.css'
import FileZone from '../components/FileZone.jsx'
import VerticalCarousel from '../components/VerticalCarousel.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';

function PostLogin() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Your fetch request or any other side effect
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`http://localhost:15000/getuser/${user.email}`)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
  }, [isAuthenticated, user]);

   if (isLoading) {
    return <div>Loading ...</div>;
  }

    console.log(user);
    console.log('PostLogin2');

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
