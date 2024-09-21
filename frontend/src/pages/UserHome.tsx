import React from 'react';
import { List, Card, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import './UserHome.css';

const meetings = [
  { title: 'Team Sync' },
  { title: 'Project Review' },
  { title: 'Client Call' },
  { title: 'Design Discussion' }
];

const Home: React.FC = () => {
  return (
    <div className="user-home">
      <h1>Meetings</h1>
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
