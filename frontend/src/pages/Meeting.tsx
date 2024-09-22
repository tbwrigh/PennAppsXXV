import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tabs, Modal, Card } from 'antd';
import { ShareAltOutlined, EditOutlined, ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import ShareForm from '../components/ShareForm'; // Import the ShareForm component
import AvailabilityForm from '../components/AvailabilityForm';
import Grid from '../components/Grid';
import './Meeting.css';
import MeetingInfo from '../types/MeetingInfo';
import { MeetingClient } from '../controllers/MeetingClient';
import { UserClient } from '../controllers/UserClient';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

const items: MenuProps['items'] = [
  {
    label: <a>12/1 12:00 PM - 6:00 PM</a>,
    key: '0',
  },
  {
    label: <a>12/3 3:00 PM - 9:00 PM</a>,
    key: '1',
  },
  {
    label: <a>12/4 8:00 AM - 2:00 PM</a>,
    key: '2',
  },
  {
    label: <a>12/6 8:00 AM - 2:00 PM</a>,
    key: '3',
  },
];

const Meeting: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the meeting ID from the route
  const [meeting, setMeeting] = useState<MeetingInfo|null>(null);
  const [meetings, setMeetings] = useState<MeetingInfo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [clearSelect, setClearSelect] = useState(false); // State to clear the Select component
  const [isAvailabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [userID, setUserID] = useState("");
  const navigate = useNavigate(); // Used for the back button
  const meetingClient = new MeetingClient();
  const userClient = new UserClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userClient.getSelf();
        setUserID(user.user_id); // Set the username from the response
      } catch (err) {
        console.log("failed to load user")
      }
    };

    fetchUser();  
  }, [])

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const m = await meetingClient.getMeetings();
        setMeetings(m);
        setIsLoading(false);
      } catch (err) {
        console.log("failed to load meetings");
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  useEffect(() => {
    // Find the meeting by ID (mocked)
    const foundMeeting = meetings.find(meeting => meeting.meeting_id === id);
    setMeeting(foundMeeting || null);
  }, [id, meetings]);

  if (isLoading) {
    return <div></div>;
  }
  
  if (!meeting) {
    return <div>Meeting not found</div>;
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setClearSelect(true); // Trigger clearing the Select component
  };

  const handleShare = (selectedEmails: string[]) => {
    console.log('Sharing with:', selectedEmails); // Log the selected emails
    setIsModalVisible(false); // Close the modal
    setClearSelect(true); // Clear the form (select component)
  };

  const resetClearSelect = () => {
    setClearSelect(false); // Reset the clearSelect state after clearing
  };

  // Handler for showing the availability modal
  const showAvailabilityModal = () => {
    setAvailabilityModalVisible(true);
  };

  // Handler for closing the availability modal
  const handleAvailabilityModalClose = () => {
    setAvailabilityModalVisible(false);
  };

  const updateEvent = () => {
    navigate(`/update/${id}`);
  }

  return (
    <div className="meeting-page">
      <div className="meeting-content">
        <div className="meeting-header">
          {/* Back Button */}
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} className="back-button">
            Back
          </Button>
          <h1>{meeting.name}</h1>
          <div className="meeting-actions">
            <Button type="default" icon={<ShareAltOutlined />} onClick={showModal}>
              Share
            </Button>
            {meeting.owner === userID && (
              <Button type="primary" icon={<EditOutlined />} className="edit-button" onClick={updateEvent}>
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Tabs for Time, Location, Cost, Notes */}
        <Tabs defaultActiveKey="1" className="meeting-tabs">
          <Tabs.TabPane tab="Time" key="1">
            <div className='timeTabHeader'>
              <h3>Best Times</h3>
              <Button type='dashed' icon={<CalendarOutlined />} onClick={showAvailabilityModal}>
                Change Availability
              </Button>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Location" key="2">
            <p>Location</p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Cost" key="3">
            <p>Cost</p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Notes" key="4">
            <p>{meeting.description}</p>
          </Tabs.TabPane>
        </Tabs>
        
        <div className="dropdown">
        <Dropdown menu={{ items }} trigger={['click']}>
          <a onClick={(e) => setIsClicked(true)}>
            <Space>
              <h5>Choose a date and time: Click me
              <DownOutlined /></h5>
            </Space>
          </a>
        </Dropdown>
        </div>
        {isClicked && <Grid />}
      

        {/* Modal for Share Form */}
        <Modal
          title="Share Meeting"
          visible={isModalVisible}
          footer={null}  // Remove default modal footer
          onCancel={handleCancel}
        >
          <ShareForm meeting_id={id ?? ''} owner_id={meeting.owner} clearSelect={clearSelect} resetClearSelect={resetClearSelect} onShare={handleShare} />
          </Modal>

        {/* Modal for availability form */}
        <Modal
          title={<div className="header-text">Change Availability</div>}
          visible={isAvailabilityModalVisible}
          footer={null} // No footer needed for this modal
          onCancel={handleAvailabilityModalClose}
          width="100vw" // Set the modal width to accommodate the grid
          style={{ backgroundColor: '#fafafa' }}
        >
          <AvailabilityForm />
        </Modal>
      </div>
    </div>
  );
};

export default Meeting;
