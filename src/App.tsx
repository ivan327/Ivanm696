import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile';
import { Messages } from './pages/Messages';
import { CreatePost } from './pages/CreatePost';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'feed' | 'profile' | 'messages'>('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onCreatePost={() => setShowCreatePost(true)}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentPage === 'feed' && <Feed key={refreshKey} />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'messages' && <Messages />}
      </main>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onSuccess={handlePostCreated}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
