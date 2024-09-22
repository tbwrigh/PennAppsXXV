import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tabs, Modal } from 'antd';
import { ShareAltOutlined, EditOutlined, ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import ShareForm from '../components/ShareForm'; // Import the ShareForm component
import AvailabilityForm from '../components/AvailabilityForm';
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
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [clearSelect, setClearSelect] = useState(false); // State to clear the Select component
  const [isAvailabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const navigate = useNavigate(); // Used for the back button

  useEffect(() => {
    // Find the meeting by ID (mocked)
    const foundMeeting = meetings.find(meeting => meeting.id === id);
    setMeeting(foundMeeting || null);
  }, [id]);

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
          <h1>{meeting.title}</h1>
          <div className="meeting-actions">
            <Button type="default" icon={<ShareAltOutlined />} onClick={showModal}>
              Share
            </Button>
            {meeting.owner === currentUser && (
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
            <p>{meeting.location}</p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Cost" key="3">
            <p>{meeting.cost}</p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Notes" key="4">
            <p>{meeting.notes}</p>
          </Tabs.TabPane>
        </Tabs>

        {/* Modal for Share Form */}
        <Modal
          title="Share Meeting"
          visible={isModalVisible}
          footer={null}  // Remove default modal footer
          onCancel={handleCancel}
        >
          <ShareForm clearSelect={clearSelect} resetClearSelect={resetClearSelect} onShare={handleShare} />
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
