import React from 'react';
import './Grid.css';

const people = [
  { name: 'Jessica' },
  { name: 'David' },
  { name: 'Christine' },
  { name: 'Ben' },
];

const hours = Array.from({ length: 6 }, (_, i) => i); // Generate hours from 0 to 5

const Grid: React.FC = () => {
  return (
    <div className="availability-grid">
      {people.map((person) => (
        <div className="availability-column" key={person.name}>
          <div className="day-header">{person.name}</div>
          {hours.map((hour) => (
            <div className="hour-tick" key={hour}>
              {/* Example content for each hour cell */}
              <div className="availability-box"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;