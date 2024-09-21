import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import UserHome from './pages/UserHome';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import './App.css';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);  // Update with actual login state logic

  return (
    <Router>
      {loggedIn ? <Navigation /> : <></>}
      <Routes>
      <Route path="/" element={loggedIn ? <UserHome /> : <Home />} />
      <Route path="/settings" element={loggedIn ? <Settings /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App
