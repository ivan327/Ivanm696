import { useAuth } from '../contexts/AuthContext';
import { Home, User, MessageSquare, LogOut, PlusCircle } from 'lucide-react';

type HeaderProps = {
  currentPage: 'feed' | 'profile' | 'messages';
  onNavigate: (page: 'feed' | 'profile' | 'messages') => void;
  onCreatePost: () => void;
};

export function Header({ currentPage, onNavigate, onCreatePost }: HeaderProps) {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent">
              JUSTICE
            </h1>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate('feed')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'feed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home size={20} />
                <span className="font-medium">Feed</span>
              </button>

              <button
                onClick={() => onNavigate('messages')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'messages'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare size={20} />
                <span className="font-medium">Messages</span>
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User size={20} />
                <span className="font-medium">Profile</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onCreatePost}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusCircle size={20} />
              <span className="hidden md:inline">New Post</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 hidden md:inline">
                {profile?.username}
              </span>
              <button
                onClick={() => signOut()}
                className="text-slate-600 hover:text-red-600 transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        <nav className="md:hidden flex items-center justify-around mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={() => onNavigate('feed')}
            className={`flex flex-col items-center gap-1 ${
              currentPage === 'feed' ? 'text-blue-600' : 'text-slate-600'
            }`}
          >
            <Home size={24} />
            <span className="text-xs">Feed</span>
          </button>

          <button
            onClick={() => onNavigate('messages')}
            className={`flex flex-col items-center gap-1 ${
              currentPage === 'messages' ? 'text-blue-600' : 'text-slate-600'
            }`}
          >
            <MessageSquare size={24} />
            <span className="text-xs">Messages</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 ${
              currentPage === 'profile' ? 'text-blue-600' : 'text-slate-600'
            }`}
          >
            <User size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
