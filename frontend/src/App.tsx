import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import UserHome from './pages/UserHome';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import Meeting from './pages/Meeting';
import SignUpForm from './components/SignUpForm';
import CreateMeeting from './pages/CreateMeeting';
import AuthenticatorComponents from './components/AuthenticatorComponents';
import FormFields from './components/FormFields';
import ThemeToggle from './components/ThemeToggle';
import './App.css';
// import { useState } from 'react';

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

function App() {
  return (
    <Authenticator formFields={FormFields} components={AuthenticatorComponents}>
      {({ signOut }) => ( // signOut, user
        <Router>
          <Navigation signOut={signOut} />
          <Routes>
            <Route path="/" element={<UserHome />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/meeting/:id" element={<Meeting />} />
            <Route path="/create" element={<CreateMeeting />} />
          </Routes>
        </Router>
      )}
    </Authenticator>
  );
}

export default App
