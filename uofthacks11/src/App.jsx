
import { Routes, Route } from 'react-router-dom';
import PreLogin from './pages/PreLoginHome.jsx';
import PostLogin from './Pages/PostLoginHome.jsx';
import AlbumView from './Pages/AlbumView.jsx';
function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<PreLogin />} />
          <Route path="/PostHome" element={<PostLogin />} />
          <Route path="/AlbumView/:id" element={<AlbumView />} />
      </Routes>
    </>
  )
}

export default App
