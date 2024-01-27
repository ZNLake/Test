import {useEffect, useState} from 'react';
import {useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import './FileZoneStyling.css';
import uploadIcon from '../assets/uploadIcon.png'

const baseStyle = {
  flex: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: '1.4375rem',
  borderColor: '#000',
  borderStyle: 'dashed',
  backgroundColor: '#F1AB5E',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  height: '50%'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 12,
  border: '1px solid black',
  marginBottom: 42,
  marginLeft: 10,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function FileZone () {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps, isFocused,
    isDragAccept,
    isDragReject} = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

   useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (        
      <div className='fileZoneWrapper'>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p className='text-black font-bold top-auto'>Upload</p>
         <img src={uploadIcon} alt="uploadIcon" />
      </div>
            <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </div>)
}

export default FileZone;