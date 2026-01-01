import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

type TelegramUpdate = {
  message?: {
    chat: { id: number; type: string };
    text?: string;
    from?: { id: number; username?: string; first_name?: string };
  };
};

async function sendTelegramMessage(chatId: number, text: string) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

async function handleStartCommand(chatId: number, username?: string, firstName?: string) {
  const welcomeMessage = `Welcome to JUSTICE! \ud83d\udc4b\n\nI'm your JUSTICE bot assistant. Here's what you can do:\n\n/posts - View latest posts\n/myprofile - View your profile\n/help - Show this help message\n\nTo link your account, please use the web app and add your Telegram ID: ${chatId}`;
  await sendTelegramMessage(chatId, welcomeMessage);
}

async function handlePostsCommand(chatId: number) {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (username)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    if (!posts || posts.length === 0) {
      await sendTelegramMessage(chatId, 'No posts available yet.');
      return;
    }

    let message = '<b>Latest Posts:</b>\n\n';
    posts.forEach((post, index) => {
      message += `<b>${index + 1}. ${post.title}</b>\n`;
      message += `By @${post.profiles?.username || 'Unknown'}\n`;
      message += `${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}\n`;
      message += `\u2764\ufe0f ${post.likes_count} likes\n\n`;
    });

    await sendTelegramMessage(chatId, message);
  } catch (error) {
    console.error('Error fetching posts:', error);
    await sendTelegramMessage(chatId, 'Error fetching posts. Please try again later.');
  }
}

async function handleProfileCommand(chatId: number, telegramId: number) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramId.toString())
      .maybeSingle();

    if (error) throw error;

    if (!profile) {
      await sendTelegramMessage(
        chatId,
        'Your Telegram account is not linked. Please link it in the web app by adding your Telegram ID: ' + telegramId
      );
      return;
    }

    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', profile.id);

    const totalLikes = posts?.reduce((sum, post) => sum + post.likes_count, 0) || 0;

    const message = `<b>Your Profile</b>\n\nUsername: @${profile.username}\nName: ${profile.full_name || 'Not set'}\nPosts: ${posts?.length || 0}\nTotal Likes: ${totalLikes}\nJoined: ${new Date(profile.created_at).toLocaleDateString()}`;

    await sendTelegramMessage(chatId, message);
  } catch (error) {
    console.error('Error fetching profile:', error);
    await sendTelegramMessage(chatId, 'Error fetching profile. Please try again later.');
  }
}

async function handleHelpCommand(chatId: number) {
  const helpMessage = `<b>JUSTICE Bot Commands:</b>\n\n/start - Start the bot\n/posts - View latest posts\n/myprofile - View your profile\n/help - Show this help\n\n<b>About JUSTICE:</b>\nJUSTICE is a social platform for sharing posts, connecting with others, and building community.\n\nVisit the web app to create posts and manage your account!`;
  await sendTelegramMessage(chatId, helpMessage);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const update: TelegramUpdate = await req.json();

    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      const telegramId = update.message.from?.id || 0;
      const username = update.message.from?.username;
      const firstName = update.message.from?.first_name;

      if (text.startsWith('/start')) {
        await handleStartCommand(chatId, username, firstName);
      } else if (text.startsWith('/posts')) {
        await handlePostsCommand(chatId);
      } else if (text.startsWith('/myprofile')) {
        await handleProfileCommand(chatId, telegramId);
      } else if (text.startsWith('/help')) {
        await handleHelpCommand(chatId);
      } else {
        await sendTelegramMessage(
          chatId,
          'Unknown command. Type /help to see available commands.'
        );
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing update:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});