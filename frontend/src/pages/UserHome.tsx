import React from 'react';
import { List, Card, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import './UserHome.css';

const meetings = [
  { title: 'Team Sync', id: "1" },
  { title: 'Project Review', id: "2" },
  { title: 'Client Call', id: "3" },
  { title: 'Design Discussion', id: "4" }
];

const Home: React.FC = () => {
    const navigate = useNavigate();

    const meetingClick = (id: string) => {
        navigate("/meeting/" + id)
    };

  return (
    <div className="user-home">
      <div className="meeting-header">
        <h1>Meetings</h1>
        <Button type="primary" className="new-meeting-button">New Meeting</Button>
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
