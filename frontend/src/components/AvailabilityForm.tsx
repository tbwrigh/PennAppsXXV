import React, { useState } from 'react';
import { Button, TimePicker } from 'antd';
import { Dayjs } from 'dayjs'; 
import { CloseOutlined } from '@ant-design/icons';
import './AvailabilityForm.css';

interface Availability {
  day: string;
  startHour: number;
  endHour: number;
}

const days = [
  { date: 'Mon 12', day: 'Monday' },
  { date: 'Tue 13', day: 'Tuesday' },
  { date: 'Wed 14', day: 'Wednesday' },
  { date: 'Thu 15', day: 'Thursday' },
  { date: 'Fri 16', day: 'Friday' },
  { date: 'Sat 17', day: 'Saturday' },
  { date: 'Sun 18', day: 'Sunday' },
];

const hours = Array.from({ length: 24 }, (_, i) => i); // Generate hours from 0 to 23

const AvailabilityForm: React.FC = () => {
  const [availability, setAvailability] = useState<Availability[]>([]); // Stores availability per day
  const [selectedDay, setSelectedDay] = useState<string | null>(null); // For tracking selected day
  const [timeRange, setTimeRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [unsavedAvailability, setUnsavedAvailability] = useState<Availability[]>([]); // For tracking unsaved changes

  const formatHour = (hour: number) => {
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  };

  // Handler for selecting a day column
  const handleDayClick = (day: string) => {
    setSelectedDay(day);
    const currentDayAvailability = availability.filter(a => a.day === day); // Load availability for this day
    setUnsavedAvailability([...currentDayAvailability]); // Load unsaved availability (editable)
  };

  // Handle time range change
//   const handleTimeRangeChange = (times: [Dayjs | null, Dayjs | null]) => {
//     setTimeRange(times); // Use Dayjs for timeRange
//   };

  const handleTimeRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setTimeRange(dates ?? [null, null]); // If dates are null, set to [null, null]
  };

  // Add availability for the selected time range
  const handleAddAvailability = () => {
    if (selectedDay && timeRange[0] && timeRange[1]) {
      const startHour = timeRange[0].hour();
      const endHour = timeRange[1].hour();
      const newAvailability: Availability = { day: selectedDay, startHour, endHour };
      setUnsavedAvailability([...unsavedAvailability, newAvailability]);
      setTimeRange([null, null]); // Reset the time range input after submission
    }
  };

  // Remove availability block
  const handleRemoveAvailability = (index: number) => {
    const updatedAvailability = unsavedAvailability.filter((_, idx) => idx !== index);
    setUnsavedAvailability(updatedAvailability);
  };

  // Save the availability changes
  const handleSave = () => {
    const updatedAvailability = availability.filter(a => a.day !== selectedDay); // Remove existing availability for this day
    setAvailability([...updatedAvailability, ...unsavedAvailability]); // Save new availability
    setSelectedDay(null); // Exit editing mode (go back to showing all days)
  };

  // Cancel changes (go back to showing all days without saving)
  const handleCancel = () => {
    setSelectedDay(null); // Discard unsaved changes and go back to all days
  };

  return (
    <div className="availability-form">
      <div className="availability-grid">
        <div className="time-column">
        {hours.map((hour) => (
            <div className="time-slot" key={hour}>
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div
            className={`availability-column ${selectedDay && selectedDay !== day.day ? 'hidden' : ''}`} // Hide non-selected days
            key={day.day}
            onClick={() => handleDayClick(day.day)}
          >
            <div className="day-header">{day.date}</div>
            {hours.map((hour) => (
              <div className="hour-tick" key={hour}>
                {/* Check if this hour has availability */}
                {availability
                  .filter((a) => a.day === day.day && hour >= a.startHour && hour < a.endHour)
                  .map((_, idx) => (
                    <div className="availability-box" key={idx}></div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Menu to add/edit availability to the selected day */}
      {selectedDay && (
        <div className="availability-menu">
          <h3>Set Availability for {selectedDay}</h3>

          {/* Show current unsaved availability */}
          <div className="availability-list">
            {unsavedAvailability.map((slot, index) => (
              <div key={index} className="availability-block">
                {formatHour(slot.startHour)} - {formatHour(slot.endHour)}
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => handleRemoveAvailability(index)}
                  className="remove-availability-btn"
                />
              </div>
            ))}
          </div>

          {/* Time Range Input */}
          <TimePicker.RangePicker
            format="h:mm a"
            value={timeRange}
            onChange={handleTimeRangeChange}
          />

          <Button onClick={handleAddAvailability} style={{ marginTop: '10px' }}>
            Add Availability
          </Button>

          {/* Save and Cancel Buttons */}
          <div style={{ marginTop: '20px' }}>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityForm;
