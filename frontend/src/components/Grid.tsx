import React from 'react';
import './Grid.css';

const people = [
  { name: 'Jessica' },
  { name: 'David' },
  { name: 'Christine' },
  { name: 'Ben' },
];

const hours = Array.from({ length: 5 }, (_, i) => i); // Generate hours from 0 to 4

const Grid: React.FC = () => {
  return (
    <div className="availability-grids">
      {people.map((person, personIndex) => (
        <div className="availability-columns" key={person.name}>
          <div className="day-headers">{person.name}</div>
          {hours.map((hour) => {
            let isGreen = false;
            if (personIndex === 0) isGreen = true; // All cells green for Alice
            if (personIndex === 1 && hour < 2) isGreen = true; // Two cells green for Bob
            if (personIndex === 2 && hour < 4) isGreen = true; // Four cells green for Charlie
            if (personIndex === 3 && hour < 1) isGreen = true; // One cell green for Diana

            return (
              <div className="hour-ticks" key={hour}>
                <div className={`availability-boxes ${isGreen ? 'green' : 'white'}`}></div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;