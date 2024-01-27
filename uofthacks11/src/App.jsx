
import { Routes, Route } from 'react-router-dom';
import PreLogin from './Pages/PreLoginHome.jsx';
import PostLogin from './Pages/PostLoginHome.jsx';
function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<PreLogin />} />
          <Route path="/PostHome" element={<PostLogin />} />
      </Routes>
    </>
  )
}

export default App
