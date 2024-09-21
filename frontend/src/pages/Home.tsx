// src/pages/Home.tsx
import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to the Home Page</h1>
      <p>This is the homepage of our awesome application!</p>
      <Button type="primary">
        <Link to="/about">Go to About Page</Link>
      </Button>
    </div>
  );
};

export default Home;
