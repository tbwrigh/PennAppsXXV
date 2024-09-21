import React from 'react';
import { Button, Form, Input, Card } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const SignUpForm: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title="Sign Up" style={{ width: 300, margin: '100px auto' }}>
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
          <a href="/">Or log in</a>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignUpForm;
