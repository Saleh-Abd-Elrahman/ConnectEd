# Connected University Platform

A modern web application for university students and professors to manage classes, meetings, and communication.

## Features

- **User Authentication**: Separate login flows for students and professors
- **Class Management**: View classes, subgroups, and course information
- **Meeting Scheduling**: Request and manage meetings between students and professors
- **Chat System**: Communication between students and professors
- **Notifications**: Get updates on important events
- **Calendar**: Manage schedule and appointments
- **Dark/Light Mode**: Customize your viewing experience

## Technologies Used

- React 18 with TypeScript
- React Router for navigation
- Firebase (Authentication, Firestore Database, Storage)
- Tailwind CSS for styling
- Vite as the build tool

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn
- Firebase account

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Set up Security Rules for Firestore
6. Get your Firebase config values (apiKey, authDomain, etc.)

### Application Setup

1. Clone the repository
```bash
git clone <repository-url>
cd connected
```

2. Install dependencies
```bash
npm install
```

3. Update Firebase configuration
Edit `src/firebaseConfig.ts` and replace the placeholder values with your Firebase project credentials.

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

4. Run the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Database Initialization

The application will automatically seed the database with demo data on first run. You can also manually trigger database seeding by calling the `seedAll()` function from the browser console or by modifying the initialization code.

## Demo Accounts

For testing purposes, two demo accounts are provided:

- **Student Account**:
  - Email: alex.johnson@university.edu
  - Password: password123

- **Professor Account**:
  - Email: sarah.chen@university.edu
  - Password: password123

## Architecture

The application follows a modular architecture:

- `src/components`: Reusable UI components
- `src/contexts`: React context providers for state management
- `src/models`: TypeScript interfaces and types
- `src/pages`: Main application views
- `src/services`: Firebase service functions
- `src/utils`: Utility functions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 