# Let's Meet

## Built for the 2024 PennApps XXV Hackathon at The University of Pennsylvania

### By: Tyler Wright & Megan Kulshekar

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Coordinating meetups with friends can often be a challenge, especially when juggling busy schedules. **Let's Meet** is a web application designed to simplify the process of scheduling meetings and gatherings. With an intuitive interface and seamless functionality, users can effortlessly create, manage, and share meeting details directly from their accounts.

---

## Features

- **Easy Scheduling:** Create new meetings with just a few clicks.
- **Calendar Integration:** View and manage your scheduled meetings in a user-friendly calendar view.
- **Sharing Options:** Share meeting details with friends via links or invitations.
- **User Accounts:** Secure authentication and personalized meeting management.
- **Real-time Updates:** Instant synchronization of meeting changes across all connected devices.

---

## Technology Stack

### Frontend

- **React:** For building the user interface.
- **Ant Design Library:** To style components with pre-built UI elements.
- **TypeScript:** Enhancing JavaScript with static typing for better code quality.
- **HTML & CSS:** For structuring and styling the web pages.
- **AWS Amplify:** Hosting the frontend.

### Backend

- **AWS Lambda:** Serverless functions to handle backend logic.
- **DynamoDB:** NoSQL database for efficient data storage and retrieval.
- **Terraform:** Infrastructure as code for managing cloud resources.
- **AWS Cognito:** User authentication and authorization.

---

## Installation

To get started with Let's Meet locally, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/tbwrigh/PennAppsXXV.git
   cd PennAppsXXV
   ```

2. **Install Dependencies**

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, install the necessary libraries:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add your AWS API URL:

   ```env
   VITE_API_URL=https://your-aws-api-endpoint.com
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

5. **Access the Application**

   Open your browser and navigate to `http://localhost:3000` (or the port specified in your environment).

---

## Usage

Once the application is running:

1. **Sign Up / Log In**

   Create a new account or log in using your existing credentials via AWS Cognito.

2. **Create a Meeting**

   Navigate to the "Create Meeting" section, input the meeting details, and schedule the time that suits everyone.

3. **Manage Meetings**

   View all your scheduled meetings in the calendar view, edit details, or cancel meetings as needed.

4. **Share Meetings**

   Share the meeting link or send invitations directly to your friends to join the scheduled meeting.

---

## Contributing

We welcome contributions from the community! To contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

Please ensure your code follows our coding standards and includes relevant tests.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize the contact emails, add badges (like build status, license, etc.), and include screenshots or GIFs to showcase the application in action. Additionally, if there are any specific instructions or dependencies for the backend setup, consider adding a separate section for that.