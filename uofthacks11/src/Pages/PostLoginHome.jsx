import LogoutButton from '../components/LogoutButton'
import logo from '../assets/HackLogo.png'
import './PostLogin.css'
import FileZone from '../components/FileZone.jsx'
import VerticalCarousel from '../components/VerticalCarousel.jsx';
import pic1 from '../assets/img1.jpeg'
import pic2 from '../assets/img2.jpeg'
import pic3 from '../assets/img3.jpeg'
import pic4 from '../assets/img4.jpeg'


function PostLogin() {

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
    <div className='wrapper'>
      <div className='uploadContainer'>
        <div>
          <img className='logo' src={logo} alt="Logo" />
          <span className='text-black font-bold text-9xl'>Retro Vu</span>
        </div>
        <form  className='h-full flex flex-col text-center items-center justify-center gap-1'>
        <textarea className='textArea resize-none ml-11 overflow-hidden' rows={1} minLength={9} maxLength={15} placeholder='Album Name...'></textarea>
        <div className='h-full'>
<FileZone />
        <button type="submit" className='text-black ml-auto'>Submit</button>
        </div>       
</form>
      </div>
      <div className='mainPageWrapper'>
        <p className='containerTitle'>
        Albums
        </p>
         <div className='mt-3'>
      <VerticalCarousel className="h-full" items={pics} />
    </div>
      </div>
    </div>
        </div>
    </>
  )
}

export default PostLogin
