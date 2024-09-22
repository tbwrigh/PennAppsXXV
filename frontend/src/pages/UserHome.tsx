import React, { useEffect, useState } from 'react';
import { List, Card, Button } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

import { UserClient } from '../controllers/UserClient';
import User from '../types/User';

import './UserHome.css';
import { MeetingClient } from '../controllers/MeetingClient';
import MeetingInfo from '../types/MeetingInfo';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const userClient = new UserClient();
    const meetingClient = new MeetingClient();

    const [userInfo, setUserInfo] = useState<User|null>(null);
    const [loading, setLoading] = useState(true);

    const [meetings, setMeetings] = useState<MeetingInfo[]>([]);
    const [meetingLoading, setMeetingLoading] = useState(true);

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

    useEffect(() => {
      const fetchMeetings = async () => {
        try {
          const m = await meetingClient.getMeetings();
          setMeetings(m);
          setMeetingLoading(false)
        } catch (err) {
          setMeetingLoading(false)
        }
      };

      fetchMeetings();
    }, [])

    const meetingClick = (id: string) => {
        navigate("/meeting/" + id)
    };

    const newMeetingClick = () => {
      navigate("/create");
    }

  return (
    <div className="user-home">
      <div className="meeting-headers">
        <h1 style={{ marginLeft: '10vw' }}>{ loading ? '' : userInfo?.username } Meetings</h1>
        <ThemeToggle />{}
        <Button type="primary" className="new-meeting-button" icon={<PlusOutlined />} onClick={newMeetingClick}>New Meeting</Button>
      </div>
      

      { !meetingLoading ? (
        (meetings.length > 0) ? (
      <List
        className="meeting-list"
        dataSource={meetings}
        renderItem={item => (
          <List.Item className="list-item">
            <Card className="meeting-card">
              <div className="card-content">
                <span className="meeting-title">{item.name}</span>
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  className="arrow-button"
                  onClick={() => {meetingClick(item.meeting_id)}}
                />
              </div>
            </Card>
          </List.Item> 
        )}
      />
    ) : (
      <h1>No Meetings to Display</h1>
    )
    ) : (
      <h1>Loading Meetings</h1>
    ) }

    </div>
  );
};

export default Home;
