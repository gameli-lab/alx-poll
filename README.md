# PollApp - Next.js Polling Application

A modern, full-featured polling application built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI components.

## 🚀 Features

- **User Authentication**: Login, registration, and user management
- **Poll Creation**: Create custom polls with multiple options and end dates
- **Poll Voting**: Interactive voting system with real-time results
- **Dashboard**: User dashboard to manage created polls and view participation
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Beautiful interface built with Shadcn UI components

## 🏗️ Project Structure

```
alx-poll/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication route group
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (dashboard)/             # Dashboard route group
│   │   └── dashboard/           # User dashboard
│   ├── polls/                   # Polls routes
│   │   ├── page.tsx            # Browse all polls
│   │   ├── create/             # Create new poll
│   │   └── [id]/               # Individual poll view
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                  # Reusable components
│   ├── ui/                     # Shadcn UI components
│   ├── auth/                   # Authentication components
│   │   ├── login-form.tsx      # Login form
│   │   └── register-form.tsx   # Registration form
│   ├── polls/                  # Poll-related components
│   │   ├── poll-card.tsx       # Poll display card
│   │   └── create-poll-form.tsx # Poll creation form
│   └── layout/                 # Layout components
│       └── header.tsx          # Navigation header
├── lib/                        # Utility libraries
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.ts             # Authentication types
│   │   └── poll.ts             # Poll-related types
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-auth.tsx        # Authentication hook
│   │   └── use-polls.ts        # Poll management hook
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State Management**: React Context + Custom Hooks
- **Authentication**: JWT-based (mock implementation)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd alx-poll
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Available Routes

- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/polls` - Browse all polls
- `/polls/create` - Create new poll
- `/polls/[id]` - View individual poll
- `/dashboard` - User dashboard (authenticated)

## 🔐 Authentication

The app includes a complete authentication system with:

- User registration and login
- JWT token management
- Protected routes
- User context throughout the app

**Demo Credentials:**

- Email: `demo@example.com`
- Password: `password`

## 📊 Poll Features

- **Create Polls**: Add title, description, options, and end date
- **Vote System**: Users can vote on active polls
- **Real-time Results**: Live updates with progress bars
- **Poll Management**: View, edit, and delete your polls
- **Categories & Tags**: Organize polls by topic

## 🎨 UI Components

Built with Shadcn UI components including:

- Buttons, Cards, Forms
- Input fields, Labels, Textareas
- Tabs, Progress bars, Badges
- Dropdown menus, Dialogs
- Toast notifications

## 🔧 Development

### Adding New Components

1. Use Shadcn UI CLI to add new components:

```bash
npx shadcn@latest add <component-name>
```

2. Create custom components in the appropriate directory under `components/`

### Styling

- Uses Tailwind CSS for styling
- Custom CSS variables for theming
- Responsive design patterns
- Dark mode support (via CSS variables)

### Type Safety

- Full TypeScript implementation
- Type definitions in `lib/types/`
- Custom hooks with proper typing
- API response types

## 🚧 Current Status

This is a scaffolded application with:

✅ **Completed:**

- Project structure and routing
- UI components and layouts
- Authentication system (mock)
- Poll management (mock)
- Type definitions
- Custom hooks

🔄 **Next Steps:**

- Connect to real backend API
- Implement database integration
- Add real-time features
- User profile management
- Advanced poll features (images, multiple choice, etc.)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For questions or support, please open an issue in the repository.
