import React from 'react';
import SignUpForm from '../components/SignUpForm';
import './SignUp.css';

const Home: React.FC = () => {
  return (
    <div className="signup-container">
      <SignUpForm />
    </div>
  );
};

export default Home;