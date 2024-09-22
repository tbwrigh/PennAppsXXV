import React from 'react';
import './Grid.css';

const people = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' },
  { name: 'Diana' },
];

const hours = Array.from({ length: 5 }, (_, i) => i); // Generate hours from 0 to 4

const Grid: React.FC = () => {
  return (
    <div className="availability-grid">
      {people.map((person, personIndex) => (
        <div className="availability-column" key={person.name}>
          <div className="day-header">{person.name}</div>
          {hours.map((hour) => {
            let isGreen = false;
            if (personIndex === 0) isGreen = true; // All cells green for Alice
            if (personIndex === 1 && hour < 2) isGreen = true; // Two cells green for Bob
            if (personIndex === 2 && hour < 4) isGreen = true; // Four cells green for Charlie
            if (personIndex === 3 && hour < 1) isGreen = true; // One cell green for Diana

            return (
              <div className="hour-tick" key={hour}>
                <div className={`availability-box ${isGreen ? 'green' : 'white'}`}></div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;