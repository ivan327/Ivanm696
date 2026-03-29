import { useEffect, useState } from 'react';
import { supabase, Post } from '../lib/supabase';
import { Heart, MessageCircle, User } from 'lucide-react';

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes_count: currentLikes + 1 })
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-12 text-slate-600">
          No posts yet. Be the first to create one!
        </div>
      ) : (
        posts.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 flex items-center justify-center text-white">
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {post.profiles?.username || 'Unknown'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {post.title}
              </h2>
              <p className="text-slate-700 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleLike(post.id, post.likes_count)}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Heart size={20} />
                  <span>{post.likes_count}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                  <MessageCircle size={20} />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
