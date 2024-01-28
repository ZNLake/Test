import LogoutButton from '../components/LogoutButton'
import './PostLogin.css'
import VerticalCarousel from '../components/VerticalCarousel.jsx';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';



function AlbumView() {
  const carouselItems = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
    { title: 'Item 4', description: 'Description for Item 4' },
    // Add more items as needed
  ];

  const {setAlbum} = useState(null); 
  const { id } = useParams();

useEffect(() => {
  fetch('http://localhost:15000/get_album', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then(response => response.json())
    .then(data => setAlbum(data));
}, [id, setAlbum]);

  const spotifyUrl = 'https://open.spotify.com/episode/7makk4oTQel546B0PZlDM5';
  const embedUrl = `https://open.spotify.com/embed?uri=${spotifyUrl}`;

  return (
    <>
    <div className='overallContainer'>
    <LogoutButton/>
    <div className='mainPageWrapper flex flex-col h-3/4'>
        <p className='containerTitle'>
        Beach Day
        </p>
        <div className='h-3/4'>
<VerticalCarousel className="h-full" items={carouselItems} />
        </div>
        <iframe 
        src={embedUrl} 
        width="300" 
        frameBorder="{0}"
        height="380" 
        allow="autoplay;
      clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ backgroundColor: 'transparent' }}>
      </iframe>
    </div>
    </div>
    </>
  )
}

export default AlbumView
