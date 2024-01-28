import LogoutButton from '../Components/LogoutButton'
import './PostLogin.css'
import VerticalCarousel from '../components/VerticalCarousel.jsx';

function AlbumView() {
  const carouselItems = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
    { title: 'Item 4', description: 'Description for Item 4' },
    // Add more items as needed
  ];

  const spotifyUrl = 'https://open.spotify.com/episode/7makk4oTQel546B0PZlDM5';
  const embedUrl = `https://open.spotify.com/embed?uri=${spotifyUrl}`;

  return (
    <>
    <div className='overallContainer'>
    <LogoutButton/>
    <div className='mainPageWrapper flex flex-col'>
        <p className='containerTitle'>
        Beach Day
        </p>
        <VerticalCarousel className="h-full" items={carouselItems} />
        <iframe 
        src={embedUrl} 
        width="300" 
        height="380" 
        frameBorder="0" 
        allow="encrypted-media">
      </iframe>
    </div>
    </div>
    </>
  )
}

export default AlbumView
