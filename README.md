
# UrbanCare

![UrbanCare Logo](public/favicon.ico)

## Overview

UrbanCare is a community-driven platform that empowers citizens to report and track urban issues in their neighborhoods. The platform connects residents with local authorities, enabling efficient communication and resolution of community problems such as potholes, broken street lights, garbage collection issues, and more.

## Features

- **Issue Reporting**: Users can report problems in their neighborhoods with photos, descriptions, and location data.
- **Issue Tracking**: Real-time status updates on reported issues.
- **Community Events**: Information about upcoming community events and initiatives.
- **User Profiles**: Personalized user accounts with customizable profiles.
- **Authentication**: Secure login and registration system powered by Firebase.
- **Responsive Design**: Fully responsive interface that works on all devices.

## Technology Stack

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- shadcn/ui for UI components
- Firebase Authentication for user management
- Firestore for database operations
- React Router for navigation
- React Query for data fetching

## Live Demo

Access the live version of UrbanCare at: [https://lovable.dev/projects/08165ac0-dda0-4225-88f4-613965dc223e](https://lovable.dev/projects/08165ac0-dda0-4225-88f4-613965dc223e)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/urbancare.git
cd urbancare
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build, run:
```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist` directory.

## Project Structure

```
├── public/             # Public assets
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (e.g., AuthContext)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and configurations
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── .env                # Environment variables (not in repo)
└── package.json        # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Lovable](https://lovable.dev) - The AI-powered platform used for development
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible UI components
- [Firebase](https://firebase.google.com/) - Authentication and database services
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces

## Contact

If you have any questions or feedback, please reach out to us at:

- Project Link: [https://lovable.dev/projects/08165ac0-dda0-4225-88f4-613965dc223e](https://lovable.dev/projects/08165ac0-dda0-4225-88f4-613965dc223e)
- Your Email: your.email@example.com
