# JUSTICE Platform Architecture

## System Overview

JUSTICE is a full-stack social platform with web and Telegram bot interfaces, built on modern technologies for scalability and security.

## Architecture Diagram

```
┌─────────────────┐
│   Web Browser   │
│   (React App)   │
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌────────────────┐    ┌────────────────┐
│   Supabase     │    │   Telegram     │
│   Auth         │    │   Bot API      │
└────────┬───────┘    └────────┬───────┘
         │                     │
         │                     ▼
         │            ┌────────────────┐
         │            │  Edge Function │
         │            │  (telegram-bot)│
         │            └────────┬───────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Supabase Database  │
         │   (PostgreSQL)      │
         │   - profiles        │
         │   - posts           │
         │   - comments        │
         │   - messages        │
         └─────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend
- **Platform**: Supabase
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (Email/Password)
- **API**: Supabase Edge Functions (Deno runtime)
- **Real-time**: Supabase Realtime subscriptions

### Bot Integration
- **Platform**: Telegram Bot API
- **Runtime**: Deno (via Supabase Edge Functions)
- **Communication**: Webhooks

## Component Structure

### Frontend Components

```
src/
├── App.tsx                    # Main app with routing logic
├── main.tsx                   # Entry point
├── components/
│   ├── AuthForm.tsx          # Login/Register UI
│   └── Header.tsx            # Navigation bar
├── contexts/
│   └── AuthContext.tsx       # Auth state management
├── lib/
│   └── supabase.ts           # Supabase client & types
└── pages/
    ├── Feed.tsx              # Posts feed
    ├── Profile.tsx           # User profile
    ├── Messages.tsx          # Direct messaging
    └── CreatePost.tsx        # Post creation modal
```

### Backend Edge Functions

1. **telegram-bot**
   - Handles Telegram webhook updates
   - Processes bot commands
   - Integrates with database

2. **get-posts**
   - REST API endpoint
   - Fetches posts with pagination
   - Returns posts with author info

3. **create-post-api**
   - REST API endpoint
   - Creates new posts
   - Validates authentication

## Database Schema

### profiles
- Links to `auth.users`
- Stores user information
- Includes `telegram_id` for bot integration

### posts
- User-created content
- Status: draft/published/archived
- Like counter

### comments
- Links to posts
- Links to user profiles
- Timestamp tracking

### messages
- Direct messaging between users
- Read/unread status
- Timestamp tracking

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled:

- **profiles**: Users can view all, modify only their own
- **posts**: Users see published posts + their own drafts
- **comments**: Users can view all, modify only their own
- **messages**: Users only see their own conversations

### Authentication Flow

1. User registers/logs in via web app
2. Supabase Auth creates session
3. JWT token stored in browser
4. All API calls include auth token
5. RLS policies enforce access control

### Bot Security

- Telegram webhook uses HTTPS
- Bot token stored securely in environment
- Service role key used for bot operations
- User linking via Telegram ID verification

## Data Flow

### Web Application

```
User Action → React Component → Supabase Client
                                      ↓
                                Auth Check
                                      ↓
                                Database Query
                                      ↓
                                RLS Validation
                                      ↓
                                Return Data
```

### Telegram Bot

```
Telegram Message → Webhook → Edge Function
                                    ↓
                             Parse Command
                                    ↓
                          Database Query (Service Role)
                                    ↓
                          Format Response
                                    ↓
                          Send to Telegram API
```

## API Endpoints

### Supabase Direct Access
- Used by frontend for all CRUD operations
- Automatic RLS enforcement
- Real-time subscriptions available

### Edge Functions
- `POST /functions/v1/telegram-bot` - Telegram webhook
- `GET /functions/v1/get-posts` - Fetch posts (authenticated)
- `POST /functions/v1/create-post-api` - Create post (authenticated)

## Deployment

### Frontend
- Built with `npm run build`
- Outputs to `dist/` directory
- Can be deployed to any static host

### Database
- Hosted on Supabase
- Automatic backups
- Connection pooling enabled

### Edge Functions
- Deployed to Supabase
- Global edge network
- Automatic scaling

### Bot Webhook
- Set via Telegram API
- Points to Supabase Edge Function
- Automatic HTTPS

## Environment Variables

Required variables in `.env`:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
TELEGRAM_BOT_TOKEN=<your-bot-token>
```

Edge Functions automatically receive:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN` (after configuration)

## Scalability Considerations

### Database
- Indexed foreign keys
- Efficient query patterns
- Connection pooling

### Frontend
- Code splitting via Vite
- Lazy loading components
- Optimized bundle size

### Edge Functions
- Stateless design
- Global edge deployment
- Auto-scaling

## Future Enhancements

Potential improvements:

1. **Real-time Updates**
   - Subscribe to new posts
   - Live message updates
   - Notification system

2. **Advanced Features**
   - Post search
   - User following
   - Hashtags
   - Media uploads

3. **Bot Enhancements**
   - Create posts via bot
   - Send messages via bot
   - Notifications to Telegram

4. **Analytics**
   - User engagement metrics
   - Post performance
   - Usage statistics

## Maintenance

### Regular Tasks
- Monitor database size
- Review RLS policies
- Update dependencies
- Check error logs

### Monitoring
- Supabase dashboard for DB metrics
- Edge Function logs for errors
- Frontend error tracking
- Bot webhook status

## Support

For technical details:
- Database: Check Supabase dashboard
- Edge Functions: View logs in Supabase
- Bot: Use Telegram Bot API methods
- Frontend: Browser console for errors
