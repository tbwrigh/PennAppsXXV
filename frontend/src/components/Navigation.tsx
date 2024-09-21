import React from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Navigation.css';

const Navigation: React.FC = () => {
  const handleLogout = () => {
    console.log('Logged out');
    // Implement your logout logic here
  };


  return (
    <div className="nav-container">
      <div className="nav-logo">
      <Avatar
              size="large"
              src="https://i.pravatar.cc/300"
              alt="User Avatar"
              icon={<UserOutlined />}
            />
      </div>
      <div className="nav-user">
        <Button
          type="text"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
