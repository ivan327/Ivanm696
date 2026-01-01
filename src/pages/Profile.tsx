import { useEffect, useState } from 'react';
import { supabase, Post } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { User, Calendar, FileText } from 'lucide-react';

export function Profile() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuth();

  useEffect(() => {
    if (user) {
      loadMyPosts();
    }
  }, [user]);

  const loadMyPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      setMyPosts(myPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 flex items-center justify-center text-white">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={40} />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              {profile?.full_name || profile?.username}
            </h1>
            <p className="text-slate-600">@{profile?.username}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
              <Calendar size={16} />
              Joined {new Date(profile?.created_at || '').toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{myPosts.length}</div>
            <div className="text-sm text-slate-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {myPosts.reduce((sum, post) => sum + post.likes_count, 0)}
            </div>
            <div className="text-sm text-slate-600">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {myPosts.filter(p => p.status === 'published').length}
            </div>
            <div className="text-sm text-slate-600">Published</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText size={24} />
          My Posts
        </h2>

        {myPosts.length === 0 ? (
          <p className="text-slate-600 text-center py-8">
            You haven't created any posts yet.
          </p>
        ) : (
          <div className="space-y-4">
            {myPosts.map(post => (
              <div
                key={post.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className={`px-2 py-1 rounded ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {post.status}
                      </span>
                      <span>{post.likes_count} likes</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
