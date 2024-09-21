import React from 'react';
import { Button, Form, Input, Card } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import './SignUpForm.css';

const SignUpForm: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="wrapper">
    <div className="item">
    <Card title="Sign Up" className="signup-card">
      <Form
        name="Sign Up"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password1"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="password2"
          rules={[{ required: true, message: 'Please re-enter your password' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign Up
          </Button>
          <div className="login-text">
            Already have an account? <a href="/" className="login-link">Log In</a>
          </div>
        </Form.Item>
      </Form>
    </Card>
    </div>
    </div>
  );
};

export default SignUpForm;
