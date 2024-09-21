import React, { useState } from 'react';
import { Form, Input, Button, Upload, Avatar, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj));
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleFinish = (values: any) => {
    message.success('Profile updated successfully!');
    // Add your update logic here
    console.log(values);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        <h1>Profile Settings</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="settings-form"
        >
          {/* Profile Picture Upload */}
          <Form.Item className="center-content">
            <Avatar
              size={100}
              src={avatarUrl}
              icon={<UserOutlined />}
              className="avatar"
            />
            <Upload
              name="avatar"
              showUploadList={false}
              onChange={handleAvatarChange}
              className="upload-button"
            >
              <Button icon={<UploadOutlined />}>Change Profile Picture</Button>
            </Upload>
          </Form.Item>

          {/* Name Change */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          {/* Email Change */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          {/* Password Change */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your new password' }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          {/* Submit and Cancel Buttons */}
          <div className="button-container">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
            </div>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
