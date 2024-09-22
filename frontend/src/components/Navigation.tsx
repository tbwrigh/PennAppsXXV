import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { SettingOutlined, CalendarOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

import { WithAuthenticatorProps } from '@aws-amplify/ui-react'

import { UserClient } from '../controllers/UserClient';
import User from '../types/User';

const Navigation: React.FC<WithAuthenticatorProps> = ({ signOut }) => {
  const navigate = useNavigate();
  const userClient = new UserClient();

  const [userInfo, setUserInfo] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);

  const defaultImg = "https://static-00.iconduck.com/assets.00/profile-default-icon-512x511-v4sw4m29.png";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userClient.getSelf();
        setUserInfo(user); // Set the username from the response
        setLoading(false); // Set loading to false after the data is fetched
      } catch (err) {
        setLoading(false); // Stop loading even if there is an error
      }
    };

    fetchUser();  
  }, [])


  const handleMenuClick = (e: any) => {
    if (e.key === 'create') {
      console.log('Navigate to Create Meeting');
      navigate('/create');
    } else if (e.key === 'meetings') {
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
      <Menu.Item key="create" icon={<PlusOutlined />}>
        Create Meeting
      </Menu.Item>
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
              src={(!loading && userInfo?.profile_pic) ? userInfo.profile_pic : defaultImg}
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
