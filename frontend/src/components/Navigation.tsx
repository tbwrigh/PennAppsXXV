import React from 'react';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { SettingOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

interface NavProps {
  signOut: ()=>void;
}

const Navigation: React.FC<NavProps> = ({ signOut }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logged out');
    signOut();
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
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="meetings" icon={<CalendarOutlined />}>
        My Meetings
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
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
