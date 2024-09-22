import React, { useEffect, useState } from 'react';
import { List, Card, Button } from 'antd';
import { PlusCircleOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

import { UserClient } from '../controllers/UserClient';
import User from '../types/User';

import './UserHome.css';

const meetings = [
  { title: 'Team Sync', id: "1" },
  { title: 'Project Review', id: "2" },
  { title: 'Client Call', id: "3" },
  { title: 'Design Discussion', id: "4" }
];

const Home: React.FC = () => {
    const navigate = useNavigate();
    const userClient = new UserClient();

    const [userInfo, setUserInfo] = useState<User|null>(null);
    const [loading, setLoading] = useState(true);

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

    const meetingClick = (id: string) => {
        navigate("/meeting/" + id)
    };

    const newMeetingClick = () => {
      navigate("/create");
    }

  return (
    <div className="user-home">
      <div className="meeting-header">
        <h1 style={{ marginLeft: '10vw' }}>{ loading ? '' : userInfo?.username } Meetings</h1>
        <ThemeToggle />{}
        <Button type="primary" className="new-meeting-button" icon={<PlusOutlined />} onClick={newMeetingClick}>New Meeting</Button>
      </div>
      <List
        className="meeting-list"
        dataSource={meetings}
        renderItem={item => (
          <List.Item className="list-item">
            <Card className="meeting-card">
              <div className="card-content">
                <span className="meeting-title">{item.title}</span>
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  className="arrow-button"
                  onClick={() => {meetingClick(item.id)}}
                />
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Home;
