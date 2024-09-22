import React from 'react';
import { Button, Form, Input, Card, TimePicker, DatePicker } from 'antd';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './CreateMeeting.css';
import { MeetingClient } from '../controllers/MeetingClient';

interface CreateMeetingFormEntries {
  meeting_title: string,
  meeting_description: string,
  date: Dayjs[]|Dayjs,
  time: Dayjs[],
}

const CreateMeeting: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const meetingClient = new MeetingClient();

  const onFinish = (values: CreateMeetingFormEntries) => {
    console.log('Success:', values);

    const name = values.meeting_title;
    const desc = values.meeting_description;
  
    // Extract days as an array of strings
    let days: string[] = [];
    if (Array.isArray(values.date)) {
      days = values.date.map((date: Dayjs) => date.format('YYYY-MM-DD'));
    } else if (values.date) {
      days = [values.date.format('YYYY-MM-DD')];
    }
  
    // Extract start and end times
    const [startTime, endTime] = values.time;
    const start = startTime.format('HH:mm');
    const end = endTime.format('HH:mm');
  
    try {
      meetingClient.postMeeting(name, desc, days, start, end).then(
        (response) => {
          navigate(`/meeting/${response.meeting_id}`);
        }
      )
    } catch (error) {
      console.log("something, went wrong")
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="wrapper">
      <div className="item">
        <Card title="Create Meeting" className="card">
        <div className="form-elements">
          <Form
            form={form}
            name="create_meeting"
            onFinish={onFinish}
          >
            <Form.Item
              name="meeting_title"
              rules={[{ required: true, message: 'Please input the meeting title' }]}
              className="form-item"
            >
              <Input prefix={<CalendarOutlined />} placeholder="Meeting Title" />  
            </Form.Item>
            <Form.Item
              name="meeting_description"
              rules={[{ required: true, message: 'Please input the meeting description' }]}
            >
              <Input prefix={<EditOutlined />} placeholder="Meeting Description" />
            </Form.Item>
            <Form.Item
              name="date"
            //   rules={[{ required: true, message: 'Please select at least one date' }]}
            >
                <div className="date-picker">
                <DatePicker multiple maxTagCount="responsive" format="MM/DD/YYYY" getPopupContainer={(trigger: HTMLElement) => trigger.parentElement || document.body} />
                </div>
            </Form.Item>
            <Form.Item
              name="time"
            //   rules={[{ required: true, message: 'Please select the time' }]}
            >
                <div className="time-picker">
                <TimePicker.RangePicker format="h:mm a" className="time-picker" />
                </div>
            </Form.Item>
            <Form.Item>
              <div className="next-button-container">
              <Button type="primary" htmlType="submit" className="next-button">
                Create
              </Button>
              <Button type="default" className="next-button" onClick={handleCancel}>
                Cancel
              </Button>
              </div>
            </Form.Item>
          </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateMeeting;