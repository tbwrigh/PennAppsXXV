import React from 'react';
import LoginForm from '../components/LoginForm';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="heading-container">
      <h1>Hey, Let's Meet</h1>
      </div>
      <div className='subheading-container'>
      <h4>We make finding a time easy.</h4>
      </div>
      <div className='login-container'>
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;
