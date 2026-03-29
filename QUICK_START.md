# JUSTICE Platform - Quick Start Guide

Welcome! This guide will help you get the JUSTICE platform up and running in minutes.

## What You Have Now

A complete social platform with:
- Modern web application
- User authentication
- Posts and comments system
- Direct messaging
- Telegram bot integration
- Secure database with RLS

## Step 1: Start the Web Application (2 minutes)

The development server starts automatically! Just open your browser:

**Your app is running at:** `http://localhost:5173`

### First Time Setup:

1. Open the web app in your browser
2. Click "Sign Up"
3. Create an account with:
   - Username (choose any)
   - Email (can be test@example.com)
   - Password (minimum 6 characters)

4. You're in! Now you can:
   - Create posts
   - View the feed
   - Check your profile
   - Send messages to other users

## Step 2: Set Up Telegram Bot (5 minutes)

### Create Your Bot:

1. Open Telegram
2. Search for **@BotFather**
3. Send: `/newbot`
4. Follow prompts to create your bot
5. Copy the bot token you receive

### Configure the Bot:

1. Open `.env` file in your project
2. Find the line: `TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here`
3. Replace with your actual token:
   ```
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

### Set Up Webhook:

Run this command (replace `<YOUR_BOT_TOKEN>` with your token):

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://vttsevzjadobuaeeijhy.supabase.co/functions/v1/telegram-bot"}'
```

### Test Your Bot:

1. Find your bot in Telegram
2. Send `/start`
3. Try commands:
   - `/posts` - View latest posts
   - `/help` - See all commands

### Link Your Account:

1. Send `/start` to your bot
2. Copy your Telegram ID from the message
3. In the web app, add your Telegram ID to your profile
4. Now `/myprofile` in bot will show your stats!

## Step 3: Explore Features

### Web Application Features:

**Navigation:**
- **Feed** - View all published posts
- **Messages** - Direct message other users
- **Profile** - View your posts and stats

**Actions:**
- Click "New Post" to create a post
- Click hearts to like posts
- Visit Profile to see your statistics
- Use Messages to chat with other users

### Telegram Bot Features:

**Commands:**
- `/start` - Welcome message
- `/posts` - See latest 5 posts
- `/myprofile` - View your profile
- `/help` - Show all commands

## Architecture Overview

```
┌──────────────┐
│  Web Browser │ ←→ React App ←→ Supabase Database
└──────────────┘

┌──────────────┐
│   Telegram   │ ←→ Bot Webhook ←→ Supabase Database
└──────────────┘
```

## What's Already Set Up

✅ Database with 4 tables (profiles, posts, comments, messages)
✅ Row Level Security for data protection
✅ User authentication system
✅ Web application with 3 main pages
✅ Telegram bot with webhook
✅ 3 API edge functions
✅ Production build configuration

## Database Tables

Your database includes:

1. **profiles** - User information
2. **posts** - User posts with likes
3. **comments** - Comments on posts
4. **messages** - Direct messages between users

All tables have automatic security policies!

## Common Tasks

### Create a Test User:
1. Go to web app
2. Click "Sign Up"
3. Enter test credentials
4. Start posting!

### View Database:
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. See all your data

### Check Bot Status:
```bash
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
```

### Build for Production:
```bash
npm run build
```

## Need Help?

### Documentation Files:
- `README.md` - Complete project documentation
- `TELEGRAM_BOT_SETUP.md` - Detailed bot setup guide
- `ARCHITECTURE.md` - System architecture details

### Check These If Issues:
1. **Web app not loading?**
   - Check browser console for errors
   - Verify `.env` file exists

2. **Can't log in?**
   - Check Supabase dashboard
   - Verify database is accessible

3. **Bot not responding?**
   - Check webhook is set: `/getWebhookInfo`
   - Verify bot token in `.env`
   - Check Edge Function logs in Supabase

## Next Steps

Now that everything is running:

1. **Test the Features**
   - Create multiple accounts
   - Post content
   - Send messages
   - Use the bot

2. **Customize**
   - Update colors in components
   - Add new features
   - Modify bot commands

3. **Deploy**
   - Build for production
   - Deploy frontend to Vercel/Netlify
   - Database and Edge Functions already deployed!

## Quick Reference

### URLs:
- Web App: `http://localhost:5173`
- Supabase: `https://vttsevzjadobuaeeijhy.supabase.co`
- Bot Webhook: `https://vttsevzjadobuaeeijhy.supabase.co/functions/v1/telegram-bot`

### Commands:
- Start dev: `npm run dev` (already running)
- Build: `npm run build`
- Type check: `npm run typecheck`
- Lint: `npm run lint`

### Bot Commands:
- `/start` - Initialize
- `/posts` - View posts
- `/myprofile` - View profile
- `/help` - Get help

## Success Checklist

- [ ] Web app loads in browser
- [ ] Can create an account
- [ ] Can create a post
- [ ] Post appears in feed
- [ ] Profile shows statistics
- [ ] Telegram bot created
- [ ] Bot token configured
- [ ] Webhook set up
- [ ] Bot responds to `/start`
- [ ] Bot shows posts with `/posts`

## You're All Set!

The JUSTICE platform is now fully operational. Start creating content, connecting with users, and exploring all the features!

Happy coding! 🚀
