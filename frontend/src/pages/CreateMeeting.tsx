import React from 'react';
import { Button, Form, Input, Card, TimePicker, DatePicker } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { ArrowRightOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './CreateMeeting.css';

const CreateMeeting: React.FC = () => {
  const [form] = Form.useForm();
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

  return (
    <div className="wrapper">
      <div className="item">
        <Card title="Create Meeting" className="card">
        <div className="form-elements">
          <Form
            name="create_meeting"
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
              <Button type="primary" htmlType="submit" className="next-button" icon={<ArrowRightOutlined />}>
              </Button>
            </Form.Item>
          </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateMeeting;