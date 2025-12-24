# Setup Instructions

## Install Dependencies

Run the following command to install all required dependencies:

```bash
bun install
```

Or if you prefer npm:

```bash
npm install
```

## Required Packages

The following packages have been added to `package.json`:

- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux
- `@radix-ui/react-avatar` - Avatar component
- `@radix-ui/react-label` - Label component

## Project Structure

```
packages/client/
├── app/
│   ├── page.tsx          # Dashboard with doctor listings and chat
│   ├── history/
│   │   └── page.tsx      # Consultation history page
│   ├── pricing/
│   │   └── page.tsx      # Pricing/subscription page
│   └── profile/
│       └── page.tsx      # User profile page
├── components/
│   ├── ui/               # Shadcn UI components
│   ├── Navbar.tsx        # Navigation component
│   ├── ChatArea.tsx      # Chat interface component
│   └── DoctorCard.tsx    # Doctor card component
└── lib/
    ├── store.ts          # Redux store configuration
    ├── api/
    │   └── apiSlice.ts   # RTK Query API slice
    └── hooks.ts          # Typed Redux hooks
```

## Features

✅ Redux Toolkit + RTK Query setup
✅ Beautiful UI with Shadcn + Tailwind CSS
✅ Dashboard with doctor listings
✅ Chat area for consultations
✅ History page for past consultations
✅ Pricing/subscription page
✅ Profile page
✅ Responsive design

## API Endpoints

The RTK Query API slice expects the following endpoints:

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/consultations` - Get all consultations
- `GET /api/consultations/:id` - Get consultation by ID
- `POST /api/chat/:doctorId` - Send chat message
- `GET /api/chat/:doctorId/history` - Get chat history

Make sure your backend server is running on `localhost:5000` and these endpoints are available.

## Running the Project

```bash
bun run dev
```

The app will be available at `http://localhost:3000`

