import LogoutButton from '../components/LogoutButton'
import './PostLogin.css'
import VerticalCarousel from '../components/VerticalCarousel.jsx';
import pic1 from '../assets/img1.jpeg'
import pic2 from '../assets/img2.jpeg'
import pic3 from '../assets/img3.jpeg'
import pic4 from '../assets/img4.jpeg'


function AlbumView() {
const pics = [
  { name: 'Picture 1', pic: pic1 },
  { name: 'Picture 2', pic: pic2 },
  { name: 'Picture 3', pic: pic3 },
  { name: 'Picture 4', pic: pic4 }
];

  return (
    <>
    <div className='overallContainer'>
    <LogoutButton/>
    <div className='mainPageWrapper flex flex-col h-3/4'>
        <p className='containerTitle'>
        Celebration
        </p>
        <div className='h-3/4'>
<VerticalCarousel className="h-full" items={pics} />
        </div>
<iframe 
  style={{borderRadius: "12px"}} 
  src="https://open.spotify.com/embed/playlist/7DOZMHSFVusL609L250Ysb?utm_source=generator" 
  width="100%" 
  height="352" 
  frameBorder="0"  
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
  loading="lazy">
</iframe>
    </div>
    </div>
    </>
  )
}

export default AlbumView
