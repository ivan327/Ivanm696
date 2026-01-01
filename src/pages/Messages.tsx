import { useEffect, useState } from 'react';
import { supabase, Message, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, User } from 'lucide-react';

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProfiles();
      loadMessages();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser && user) {
      markMessagesAsRead();
    }
  }, [selectedUser, user]);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          from_profile:profiles!messages_from_user_id_fkey(*),
          to_profile:profiles!messages_to_user_id_fkey(*)
        `)
        .or(`from_user_id.eq.${user?.id},to_user_id.eq.${user?.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedUser || !user) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('from_user_id', selectedUser.id)
        .eq('to_user_id', user.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !user || !newMessage.trim()) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          from_user_id: user.id,
          to_user_id: selectedUser.id,
          content: newMessage.trim(),
        })
        .select(`
          *,
          from_profile:profiles!messages_from_user_id_fkey(*),
          to_profile:profiles!messages_to_user_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      if (data) {
        setMessages([...messages, data]);
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getConversation = () => {
    if (!selectedUser || !user) return [];
    return messages.filter(
      msg =>
        (msg.from_user_id === user.id && msg.to_user_id === selectedUser.id) ||
        (msg.from_user_id === selectedUser.id && msg.to_user_id === user.id)
    );
  };

  const getUnreadCount = (userId: string) => {
    return messages.filter(
      msg => msg.from_user_id === userId && msg.to_user_id === user?.id && !msg.is_read
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-[calc(100vh-200px)]">
      <div className="flex h-full">
        <div className="w-80 border-r border-slate-200 overflow-y-auto">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Conversations</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {profiles.length === 0 ? (
              <div className="p-4 text-center text-slate-600 text-sm">
                No users available
              </div>
            ) : (
              profiles.map(profile => {
                const unreadCount = getUnreadCount(profile.id);
                return (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedUser(profile)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                      selectedUser?.id === profile.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 flex items-center justify-center text-white flex-shrink-0">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-slate-900">
                        {profile.username}
                      </div>
                      <div className="text-sm text-slate-600">
                        {profile.full_name}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 flex items-center justify-center text-white">
                    {selectedUser.avatar_url ? (
                      <img
                        src={selectedUser.avatar_url}
                        alt={selectedUser.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {selectedUser.username}
                    </div>
                    <div className="text-sm text-slate-600">
                      {selectedUser.full_name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getConversation().map(msg => {
                  const isMyMessage = msg.from_user_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isMyMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <div
                          className={`text-xs mt-1 ${
                            isMyMessage ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
