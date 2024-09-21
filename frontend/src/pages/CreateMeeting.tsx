import React from 'react';
import { Button, Form, Input, Card } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './CreateMeeting.css';

const CreateMeeting: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="wrapper">
      <div className="item">
        <Card title="Create Meeting" style={{ width: 300 }}>
          <Form
            name="create_meeting"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="meeting_title"
              rules={[{ required: true, message: 'Please input the meeting title!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Meeting Title" />
            </Form.Item>
            <Form.Item
              name="meeting_description"
              rules={[{ required: true, message: 'Please input the meeting description!' }]}
            >
              <Input prefix={<LockOutlined />} placeholder="Meeting Description" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Meeting
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div className="item">
        <Card title="Another Item" style={{ width: 300 }}>
          {/* Add content for the second item here */}
          <p>This is another item within the wrapper.</p>
        </Card>
      </div>
      <div className="item">
        <Card title="Third Item" style={{ width: 300 }}>
          {/* Add content for the second item here */}
          <p>This is another item within the wrapper.</p>
        </Card>
      </div>
    </div>
  );
};

export default CreateMeeting;