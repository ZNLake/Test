import LogoutButton from '../Components/LogoutButton'
import logo from '../assets/HackLogo.png'
import './PostLogin.css'
import FileZone from '../components/FileZone.jsx'
import VerticalCarousel from '../components/VerticalCarousel.jsx';
import { useRef } from 'react';

function PostLogin() {

  const carouselItems = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
    { title: 'Item 4', description: 'Description for Item 4' },
    // Add more items as needed
  ];

const handleSubmit = async (event) => {
  event.preventDefault();

  const albumName = albumNameRef.current.value;
  const files = fileRef.current.files; // Adjust this line based on how you access files in your FileZone component

  const formData = new FormData();
  formData.append('albumName', albumName);

  // Append files
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const response = await fetch('your_route_url', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    console.log('Files and album name sent successfully');
  } else {
    console.error('Error:', response.statusText);
  }
};
// Initialize refs
const albumNameRef = useRef();
const fileRef = useRef();
  return (
    <>
    
    <div className='overallContainer'>
    <LogoutButton/>
    <div className='wrapper'>
      <div className='uploadContainer'>
        <div>
          <img className='logo' src={logo} alt="Logo" />
          <span className='text-black font-bold'>** Name Here**</span>
        </div>
        <form onSubmit={handleSubmit} className='h-full flex flex-col text-center items-center justify-center gap-1'>
        <textarea ref={albumNameRef} className='textArea resize-none ml-11 overflow-hidden' rows={1} minLength={12} maxLength={20} placeholder='Album Name...'></textarea>
        <div className='h-full'>
<FileZone ref={fileRef}/>
        <button type="submit" className='text-black ml-auto'>Submit</button>
        </div>       
</form>
      </div>
      <div className='mainPageWrapper'>
        <p className='containerTitle'>
        Albums
        </p>
         <div className='mt-3'>
      <VerticalCarousel className="h-full" items={carouselItems} />
    </div>
      </div>
    </div>
        </div>
    </>
  )
}

export default PostLogin
