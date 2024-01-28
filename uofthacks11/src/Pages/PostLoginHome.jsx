import LogoutButton from '../components/LogoutButton'
import logo from '../assets/HackLogo.png'
import './PostLogin.css'
import FileZone from '../components/FileZone.jsx'
import VerticalCarousel from '../components/VerticalCarousel.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const codeVerifier  = generateRandomString(64);

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed);

const clientId = 'fa413c9476dc4216ba24e2150c1ff7f9';
const redirectUri = 'http://localhost:15000';

const scope = 'playlist-modify-public playlist-modify-private user-read-email user-read-private';
const authUrl = new URL("https://accounts.spotify.com/authorize")

// generated in the previous step
window.localStorage.setItem('code_verifier', codeVerifier);

const params =  {
  response_type: 'code',
  client_id: clientId,
  scope,
  code_challenge_method: 'S256',
  code_challenge: codeChallenge,
  redirect_uri: redirectUri,
}

authUrl.search = new URLSearchParams(params).toString();
window.location.href = authUrl.toString();

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
let state = urlParams.get('state');

const getToken = async code => {

  // stored in the previous step
  let codeVerifier = localStorage.getItem('code_verifier');

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload);
  const response =await body.json();

  localStorage.setItem('access_token', response.access_token);

    // Send state, code, and access token to a route
  const routePayload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      state, // Use state from URL parameters
      code,
      access_token: response.access_token,
    }),
  }

  await fetch('localhost:15000/recieve_json', routePayload);
}

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
        <textarea className='textArea' placeholder='Description'></textarea>
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
