import React from 'react';
import { useParams } from 'react-router-dom';

const Meeting: React.FC = () => {
  // Get the {id} parameter from the route
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meeting ID: {id}</h1>
      <p>This is the detail page for meeting with ID: {id}.</p>
      {/* Add more details about the meeting here */}
    </div>
  );
};

export default Meeting;
