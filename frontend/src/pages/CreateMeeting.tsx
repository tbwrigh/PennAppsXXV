import React from 'react';
import { Button, Form, Input, Card, TimePicker, DatePicker } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import './CreateMeeting.css';

const CreateMeeting: React.FC = () => {
  const onFinish = (values: Dayjs | null) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<Dayjs | null>) => {
    console.log('Failed:', errorInfo);
  };

  const onchange = (date: Dayjs | null, dateString: string | string[]) => {
    console.log(date, dateString);
  };

  return (
    <div className="wrapper">
      <div className="item">
        <Card title="Create Meeting" style={{ width: 400, height: 400 }}>
          <Form
            name="create_meeting"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="meeting_title"
              rules={[{ required: true, message: 'Please input the meeting title' }]}
            >
              <Input prefix={<CalendarOutlined />} placeholder="Meeting Title" />  
            </Form.Item>
            <Form.Item
              name="meeting_description"
              rules={[{ required: true, message: 'Please input the meeting description' }]}
            >
              <Input prefix={<EditOutlined />} placeholder="Meeting Description" />
            </Form.Item>
            <Form.Item>
                <div className="time-picker">
                <TimePicker.RangePicker format="h:mm a" className="time-picker" />
                </div>
            </Form.Item>
            <Form.Item>
                <div className="date-picker">
                <DatePicker multiple onChange={onchange} maxTagCount="responsive" format="MM/DD/YYYY" getPopupContainer={(trigger: HTMLElement) => trigger.parentElement || document.body} />
                </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateMeeting;