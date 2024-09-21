// src/pages/About.tsx
import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>About This Application</h1>
      <p>This application demonstrates routing with React Router, Vite, and Ant Design.</p>
      <Button>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
};

export default About;
