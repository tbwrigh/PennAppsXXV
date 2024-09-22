import React, { useState } from 'react';
import { Button, Form, Input, Card, TimePicker, DatePicker } from 'antd';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './CreateMeeting.css';
import { MeetingClient } from '../controllers/MeetingClient';

interface CreateMeetingFormEntries {
  meeting_title: string,
  meeting_description: string,
}

const CreateMeeting: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [times, setTimes] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const meetingClient = new MeetingClient();

  const onFinish = (values: CreateMeetingFormEntries) => {
    console.log('Success:', values);

    const name = values.meeting_title;
    const desc = values.meeting_description;
  
    // Extract start and end times
    const [start, end] = times;
  
    try {
      meetingClient.postMeeting(name, desc, dates, start, end).then(
        (response) => {
          navigate(`/meeting/${response.meeting_id}`);
        }
      )
    } catch (error) {
      console.log("something, went wrong")
    }
  };

  const onChangeTime = (
    times: any, 
    timeStrings: [string, string]
  ) => {
    if (times && times[0] && times[1]) {
      setTimes(timeStrings);
    }
  };

  const onChangeDates = (
    date: any[],
    dateString: string|string[]
  ) => {
    if (date.length > 0) {
      if (!Array.isArray(dateString)) dateString = [dateString]
      setDates(dateString);
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
                <DatePicker multiple maxTagCount="responsive" format="MM/DD/YYYY" getPopupContainer={(trigger: HTMLElement) => trigger.parentElement || document.body} onChange={onChangeDates} />
                </div>
            </Form.Item>
            <Form.Item
              name="time"
              // rules={[{ required: true, message: 'Please select the time' }]}
            >
                <div className="time-picker">
                <TimePicker.RangePicker format="h:mm a" className="time-picker" onChange={onChangeTime} />
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