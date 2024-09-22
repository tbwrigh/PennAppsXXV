import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

import { UserClient } from '../controllers/UserClient';

interface SettingFormValues {
  name: string;
  pfp_url: string;
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const userClient = new UserClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userClient.getSelf();

        // Set form fields with the fetched user info
        if (user) {
          form.setFieldsValue({
            name: user.username,
            pfp_url: user.profile_pic, // Assuming userInfo has a field called profile_pic
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();  
  }, [form]);

  const handleFinish = (values: SettingFormValues) => {
    const { name, pfp_url } = values;
    userClient.putUser(name, pfp_url);
    // navigate('/');
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


          {/* Profile Picture URL */}
          <Form.Item
            label="Profile Picture Url"
            name="pfp_url"
            rules={[{ required: false, message: 'Please input a url to an image' }]}
          >
            <Input placeholder="Image Url" />
          </Form.Item>

          {/* Name Change */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: false, message: 'Please input your name' }]}
          >
            <Input placeholder="Enter your name" />
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
