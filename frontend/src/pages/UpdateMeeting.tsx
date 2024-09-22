import React from 'react';
import { Button, Form, Input, Card, TimePicker, DatePicker } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './CreateMeeting.css';

const UpdateMeeting: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: Dayjs | null) => {
    console.log('Success:', values);
    navigate('/meeting/1');
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<Dayjs | null>) => {
    console.log('Failed:', errorInfo);
  };

  const onchange = (date: Dayjs | null, dateString: string | string[]) => {
    console.log(date, dateString);
  };

  const handleUpdate = () => {
    console.log('Update Meeting');
  };

  const handleDelete = () => {
    console.log('Delete Meeting');
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const initialValues = {
    meeting_title: "ACM End of Year Party",
    meeting_description: "Celebrate the end of the year with ACM!",
    date: ["12/01/2024, 12/02/2024, 12/03/2024, 12/08/2024, 12/11/2024"],
    time: [dayjs('3:00 pm'), dayjs('8:00 pm')],
  };

  return (
    <div className="wrapper">
      <div className="item">
        <Card title="Update Meeting" className="card">
        <div className="form-elements">
          <Form
            name="create_meeting"
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
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
                <DatePicker multiple onChange={onchange} maxTagCount="responsive" format="MM/DD/YYYY" getPopupContainer={(trigger: HTMLElement) => trigger.parentElement || document.body} />
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
              <Button type="primary" htmlType="submit" className="next-button" onClick={handleUpdate}>
                Update
              </Button>
              <Button type="primary" className="next-button" onClick={handleDelete}>
                Delete
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

export default UpdateMeeting;