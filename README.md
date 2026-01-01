# JUSTICE Platform

A full-featured social platform with web application and Telegram bot integration.

## Features

- User authentication (email/password)
- Create and view posts
- Like and comment on posts
- Direct messaging between users
- User profiles with statistics
- AI Hub with multiple AI models
- Token-based system for AI usage
- Advanced AI chat interface
- Telegram bot integration
- Real-time updates

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Serverless Functions**: Supabase Edge Functions
- **Bot**: Telegram Bot API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (already configured)
- Telegram Bot Token (for bot integration)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Telegram Bot Setup

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token you receive

### 2. Configure Bot Token

Add your bot token to the `.env` file:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 3. Set Up Webhook

After deploying, set up the webhook for your bot:

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://vttsevzjadobuaeeijhy.supabase.co/functions/v1/telegram-bot"
  }'
```

Replace `<YOUR_BOT_TOKEN>` with your actual bot token.

### 4. Bot Commands

Once configured, users can interact with your bot using:

- `/start` - Start the bot and get welcome message
- `/posts` - View latest posts from the platform
- `/myprofile` - View your profile (after linking account)
- `/help` - Show help message

### 5. Linking Telegram Account

To link a Telegram account with the platform:

1. Start the bot in Telegram (`/start`)
2. Note your Telegram ID from the welcome message
3. Log in to the web application
4. Go to your profile
5. Add your Telegram ID to link accounts

## Project Structure

```
src/
├── components/        # React components
│   ├── AuthForm.tsx   # Login/Register form
│   └── Header.tsx     # Navigation header
├── contexts/          # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utilities and configurations
│   └── supabase.ts    # Supabase client setup
├── pages/             # Page components
│   ├── Feed.tsx       # Main feed page
│   ├── Profile.tsx    # User profile page
│   ├── Messages.tsx   # Direct messaging
│   ├── AIHub.tsx      # AI features and models
│   └── CreatePost.tsx # Create post modal
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## Edge Functions

The platform includes the following Supabase Edge Functions:

1. **telegram-bot** - Handles Telegram bot webhooks
2. **get-posts** - API endpoint to fetch posts
3. **create-post-api** - API endpoint to create posts

## Database Schema

### Tables

- **profiles** - User profiles linked to auth.users
- **posts** - User posts with title, content, and status
- **comments** - Comments on posts
- **messages** - Direct messages between users

All tables have Row Level Security (RLS) enabled for data protection.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Security

- All database tables have Row Level Security enabled
- Users can only access their own data
- Authentication required for all protected routes
- API endpoints validate user permissions

## Support

For issues or questions, please open an issue on the repository.

## License

MIT
