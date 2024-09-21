import React, { useEffect, useState } from 'react';
import { Form, Select, List, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './ShareForm.css';

// Mock data of existing shared users
const existingShares = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
];

// Mock data for available users (for new shares)
const availableUsers = [
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
  { id: '4', name: 'Dave Adams', email: 'dave@example.com' },
];

interface ShareFormProps {
  clearSelect: boolean; // Prop to trigger clearing the select
  resetClearSelect: () => void; // Function to reset the clear trigger
  onShare: (emails: string[]) => void;
}

const ShareForm: React.FC<ShareFormProps> = ({ clearSelect, resetClearSelect, onShare }) => {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]); // Track selected emails

  // Handle adding new emails or users
  const handleSelectChange = (value: string[]) => {
    setSelectedEmails(value); // Add new emails or selected users from suggestions
  };

  // Effect to clear the Select component when modal is closed
  useEffect(() => {
    if (clearSelect) {
      setSelectedEmails([]); // Clear selected emails
      resetClearSelect(); // Reset the clearing trigger
    }
  }, [clearSelect, resetClearSelect]);

  // Remove a user from the existing shares list (for demo purposes)
  const handleRemoveExistingShare = (email: string) => {
    console.log(`Removed from existing shares: ${email}`);
  };

  const handleShareClick = () => {
    onShare(selectedEmails); // Pass the selected emails to the parent component (Meeting)
  };

  return (
    <div className="share-form">
      {/* Existing shared users (the big list) */}
      <h3>Already Shared With</h3>
      <List
        dataSource={existingShares}
        renderItem={(user) => (
          <List.Item>
            <div className="user-info">
              <div className="user-details">
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              {/* Remove existing share button */}
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleRemoveExistingShare(user.email)}
                className="remove-user-btn"
              />
            </div>
          </List.Item>
        )}
      />

      {/* Searchable Select to add new shares */}
      <h3>Share with</h3>
      <Form.Item label="Enter email or select a user" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} >
        <Select
          mode="tags" // Allows typing new emails and selecting from existing users
          placeholder="Enter an email or choose a user"
          onChange={handleSelectChange} // Track selected emails
          value={selectedEmails} // Selected emails appear in tags
          options={availableUsers.map((user) => ({
            value: user.email,
            label: `${user.name} (${user.email})`, // Show name and email
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

export default ShareForm;
