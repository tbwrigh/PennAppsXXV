import React, { useEffect, useState } from 'react';
import { Form, Select, List, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './ShareForm.css';

import { UserClient } from '../controllers/UserClient';
import { SharingClient } from '../controllers/SharingClient';
import User from '../types/User';

interface ShareFormProps {
  clearSelect: boolean; // Prop to trigger clearing the select
  resetClearSelect: () => void; // Function to reset the clear trigger
  onShare: (emails: string[]) => void;
  meeting_id: string;
  owner_id: string;
}

const ShareForm: React.FC<ShareFormProps> = ({ clearSelect, resetClearSelect, onShare, meeting_id, owner_id }) => {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [existingShares, setExistingShares] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const userClient = new UserClient();
  const sharingClient = new SharingClient();
  let cacheBuster = 0;

  const handleSelectChange = (value: string[]) => {
    setSelectedEmails(Array.isArray(value) ? value : []); // Ensure it's an array
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const m = await userClient.getPublicUsers();
        setAvailableUsers(Array.isArray(m) ? m : []); // Ensure it's an array
      } catch (err) {
        console.log("failed to get users");
        setAvailableUsers([]); // Fallback to empty array
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const m = await sharingClient.getShares(meeting_id);
        setExistingShares(Array.isArray(m) ? m : []); // Ensure it's an array
      } catch (err) {
        console.log("failed to get shares");
        setExistingShares([]); // Fallback to empty array
      }
    };
    fetchShared();
  }, [cacheBuster]);

  useEffect(() => {
    if (clearSelect) {
      setSelectedEmails([]);
      resetClearSelect();
    }
  }, [clearSelect, resetClearSelect]);

  const handleRemoveExistingShare = (user_id: string) => {
    sharingClient.unshareMeeting(user_id, meeting_id);
    cacheBuster += 1;
  };

  const handleShareClick = () => {
    for (let i =0; i < selectedEmails.length; i++) {
      for (let j = 0; j < availableUsers.length; j++) {
        if (availableUsers[j].email == selectedEmails[i]) {
          console.log(availableUsers[j].user_id, meeting_id)
          sharingClient.sharedMeeting(availableUsers[j].user_id, meeting_id);
        }
      }
    }
    cacheBuster += 1;
    onShare(selectedEmails);
  };

  return (
    <div className="share-form">
      <h3>Already Shared With</h3>
      <List
        dataSource={existingShares}
        renderItem={(user) => (
          <List.Item>
            <div className="user-info">
              <div className="user-details">
                <strong>{user.username}</strong>
                <p>{user.email}</p>
              </div>
              {
                (user.user_id == owner_id) ? '' : (
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => handleRemoveExistingShare(user.user_id)}
                    className="remove-user-btn"
                  />
                )
              }
              
            </div>
          </List.Item>
        )}
      />

      <h3>Share with</h3>
      <Form.Item label="Enter email or select a user" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} >
        <Select
          mode="tags"
          placeholder="Enter an email or choose a user"
          onChange={handleSelectChange}
          value={selectedEmails}
          options={availableUsers.map((user) => ({
            value: user.email,
            label: `${user.username} (${user.email})`,
          }))}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" onClick={handleShareClick}>
          Share
        </Button>
      </Form.Item>
    </div>
  );
};

export default ShareForm