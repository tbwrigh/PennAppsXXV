import React from 'react';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { SettingOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

import { WithAuthenticatorProps } from '@aws-amplify/ui-react'



const Navigation: React.FC<WithAuthenticatorProps> = ({ signOut }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logged out');
    if (signOut) signOut();
  };

  const handleMenuClick = (e: any) => {
    if (e.key === 'meetings') {
      console.log('Navigate to My Meetings');
      navigate('/');
    } else if (e.key === 'settings') {
      console.log('Navigate to Settings');
      // Add navigation logic to go to settings
      navigate('/settings');
    }
    else if (e.key === 'logout') {
      console.log('Logged out');
      if (signOut) signOut();
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="meetings" icon={<CalendarOutlined />}>
        My Meetings
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<UserOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="nav-container">
      <div className="nav-logo">
      <Dropdown overlay={userMenu} trigger={['click']}>
          <div className="user-avatar">
      <Avatar
              size="large"
              src="https://i.pravatar.cc/300"
              alt="User Avatar"
              icon={<UserOutlined />}
            />
                      </div>
        </Dropdown>

      </div>
      <div className="nav-user">
      </div>
    </div>
  );
};

export default Navigation;
