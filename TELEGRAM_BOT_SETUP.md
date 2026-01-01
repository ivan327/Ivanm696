# Telegram Bot Setup Guide

## Step 1: Create Your Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Start a chat with BotFather
3. Send the command: `/newbot`
4. Follow the prompts:
   - Choose a name for your bot (e.g., "JUSTICE Bot")
   - Choose a username for your bot (must end in 'bot', e.g., "justice_platform_bot")
5. BotFather will give you a **bot token** - save this!

Example token format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

## Step 2: Configure Your Bot Token

Add your bot token to the `.env` file in your project:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

## Step 3: Set Up Webhook

Your bot needs to know where to send updates. Run this command in your terminal:

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://vttsevzjadobuaeeijhy.supabase.co/functions/v1/telegram-bot"
  }'
```

**Replace `<YOUR_BOT_TOKEN>`** with your actual bot token from Step 1.

### Successful Response

You should see:
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

## Step 4: Test Your Bot

1. Find your bot in Telegram by its username
2. Start a chat with your bot
3. Send `/start` - you should receive a welcome message
4. Try other commands:
   - `/posts` - See latest posts
   - `/help` - View all commands
   - `/myprofile` - View your profile (after linking)

## Step 5: Link Your Account

To use personalized features:

1. Send `/start` to your bot in Telegram
2. Copy your Telegram ID from the welcome message
3. Log in to the JUSTICE web app
4. Go to your profile settings
5. Add your Telegram ID to link your accounts

## Available Bot Commands

- `/start` - Initialize bot and get welcome message
- `/posts` - View the 5 latest published posts
- `/myprofile` - View your profile statistics (requires linked account)
- `/help` - Display help message with all commands

## Troubleshooting

### Bot not responding

1. Check if webhook is set correctly:
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

2. Verify the webhook URL is correct
3. Check that your bot token is correct in `.env`

### Commands not working

1. Make sure you've sent `/start` first
2. Check that the edge function is deployed
3. Look for errors in Supabase Edge Function logs

### Profile not found

1. Make sure you've created an account on the web app
2. Verify your Telegram ID is correctly linked
3. Send `/start` to get your Telegram ID

## Webhook Management

### Check current webhook status:
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

### Remove webhook (if needed):
```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook
```

### Set webhook again:
```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://vttsevzjadobuaeeijhy.supabase.co/functions/v1/telegram-bot"
  }'
```

## Security Notes

- Never share your bot token publicly
- The token is stored securely in Supabase Edge Functions
- Bot webhook uses HTTPS for secure communication
- User data is protected by Row Level Security in the database

## Need Help?

If you encounter issues:
1. Check the Supabase Edge Function logs
2. Verify your bot token is correct
3. Ensure the webhook URL is accessible
4. Test the edge function directly via Supabase dashboard
