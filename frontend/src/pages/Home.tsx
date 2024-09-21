import React from 'react';
import LoginForm from '../components/LoginForm';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <LoginForm />
    </div>
  );
};

export default Home;
