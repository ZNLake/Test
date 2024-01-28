import LogoutButton from '../components/LogoutButton'
import logo from '../assets/HackLogo.png'
import './PostLogin.css'
import FileZone from '../components/FileZone.jsx'
import VerticalCarousel from '../components/VerticalCarousel.jsx';
import { useRef } from 'react';


function PostLogin() {

// Initialize refs
const albumNameRef = useRef();
const fileRef = useRef();

  const carouselItems = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
    { title: 'Item 4', description: 'Description for Item 4' },
  ];

  const handleSubmit = async (event) => {
  event.preventDefault();

  const albumName = albumNameRef.current.value;
  const files = fileRef.current.files; // Adjust this line based on how you access files in your FileZone component
    console.log(albumName);
    console.log(files);
  const formData = new FormData();
  formData.append('albumName', albumName);

  // Append files
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  const response = await fetch('http://localhost:15000/upload_images', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    console.log('Files and album name sent successfully');
  } else {
    console.error('Error:', response.statusText);
  }

  fetch()
};
let item;
fetch('http://localhost:15000/get_image')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    data.forEach(item => {
      console.log(item);
      const albumName = item.album;
      const imageUrls = item.urls;
      // Do something with albumName and imageUrls
    });
  })
  .catch(error => console.error('Error:', error));

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
        <textarea ref={albumNameRef} className='textArea resize-none ml-11 overflow-hidden' rows={1} minLength={9} maxLength={15} placeholder='Album Name...'></textarea>
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
      <VerticalCarousel className="h-full" items={item} />
    </div>
      </div>
    </div>
        </div>
    </>
  )
}

export default PostLogin
