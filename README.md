# PollApp - Next.js Polling Application

A modern polling application built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI components.

## Features

- **User Authentication**: Login and signup functionality with form validation
- **Poll Management**: Create, view, and vote on polls
- **Real-time Updates**: Live poll results and voting statistics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Modern UI**: Beautiful components built with Shadcn UI

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   └── signup/              # Signup page
│   ├── polls/                   # Poll-related pages
│   │   ├── create/              # Create poll page
│   │   ├── [id]/                # Individual poll page
│   │   └── page.tsx             # Polls listing page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── auth/                    # Authentication components
│   │   ├── LoginForm.tsx        # Login form component
│   │   └── SignupForm.tsx       # Signup form component
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   └── Layout.tsx           # Main layout wrapper
│   ├── polls/                   # Poll-related components
│   │   ├── PollCard.tsx         # Poll card component
│   │   ├── PollList.tsx         # Poll list component
│   │   └── CreatePollForm.tsx   # Create poll form
│   └── ui/                      # Shadcn UI components
├── lib/                         # Utilities and configurations
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Authentication hook
│   │   └── usePolls.ts          # Polls management hook
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts             # Main types
│   │   └── auth.ts              # Authentication types
│   └── utils.ts                 # Utility functions
└── components.json              # Shadcn UI configuration
```

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Icons**: Lucide React (via Shadcn)
- **Date Handling**: date-fns
- **State Management**: React Context + Custom Hooks

## Key Features Implemented

### Authentication System

- Login and signup forms with validation
- Auth context provider for global state management
- Protected routes and user session handling
- User profile management

### Poll Management

- Create polls with multiple options
- Vote on polls (single or multiple choice)
- View poll results with real-time updates
- Poll expiration and status management
- Search and filter functionality

### UI/UX

- Responsive design for all screen sizes
- Dark/light mode support (via Shadcn)
- Loading states and error handling
- Form validation and user feedback
- Modern, accessible components

## Next Steps

This scaffolding provides a solid foundation for your polling application. To continue development, consider:

1. **Backend Integration**: Connect to a real API or database
2. **Authentication**: Implement actual auth with providers like NextAuth.js
3. **Real-time Features**: Add WebSocket support for live updates
4. **Advanced Poll Features**: Poll categories, tags, analytics
5. **User Profiles**: Enhanced user management and preferences
6. **Testing**: Add unit and integration tests
7. **Deployment**: Configure for production deployment

## Contributing

This is a scaffolded project ready for development. Feel free to modify and extend the codebase according to your specific requirements.
