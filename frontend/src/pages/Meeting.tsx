import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tabs } from 'antd';
import { ShareAltOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './Meeting.css';

// Mock meeting data
const meetings = [
  { id: '1', title: 'Team Sync', owner: 'user1', time: '10:00 AM', location: 'Room A', cost: 'Free', notes: 'Bring your laptops.' },
  { id: '2', title: 'Project Review', owner: 'user2', time: '12:00 PM', location: 'Room B', cost: '$50', notes: 'Discuss project updates.' },
  { id: '3', title: 'Client Call', owner: 'user1', time: '2:00 PM', location: 'Zoom', cost: 'Free', notes: 'Zoom link will be shared.' },
  { id: '4', title: 'Design Discussion', owner: 'user3', time: '4:00 PM', location: 'Room C', cost: 'Free', notes: 'Brainstorm design ideas.' },
];

// Mock current logged-in user
const currentUser = 'user1';

const Meeting: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the meeting ID from the route
  const [meeting, setMeeting] = useState<any | null>(null);
  const navigate = useNavigate(); // Used for the back button

  useEffect(() => {
    // Find the meeting by ID (mocked)
    const foundMeeting = meetings.find(meeting => meeting.id === id);
    setMeeting(foundMeeting || null);
  }, [id]);

  if (!meeting) {
    return <div>Meeting not found</div>;
  }

  return (
    <div className="meeting-page">
      <div className="meeting-content">
        <div className="meeting-header">
          {/* Back Button */}
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="back-button">
            Back
          </Button>
          <h1>{meeting.title}</h1>
          <div className="meeting-actions">
            <Button type="default" icon={<ShareAltOutlined />}>
              Share
            </Button>
            {meeting.owner === currentUser && (
              <Button type="primary" icon={<EditOutlined />} className="edit-button">
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Tabs for Time, Location, Cost, Notes */}
        <Tabs defaultActiveKey="1" className="meeting-tabs">
          <Tabs.TabPane tab="Time" key="1">
            <p>{meeting.time}</p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Location" key="2">
            <p>{meeting.location}</p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Cost" key="3">
            <p>{meeting.cost}</p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Notes" key="4">
            <p>{meeting.notes}</p>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Meeting;
