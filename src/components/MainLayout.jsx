import { useState, useEffect, useCallback } from 'react';
import Sidebar from './sidebar';
import ThemeToggle from '../components/ThemeToggle';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { useTheme } from '../components/ThemeContext';
import { collection, onSnapshot } from 'firebase/firestore';

// eslint-disable-next-line react/prop-types
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 800);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  const [chatSessions, setChatSessions] = useState([]);
  const [userId, setUserId] = useState(null);
  
  const initializeChatSession = useCallback(() => {
    if (!userId) return;

    // Real-time listener for chat sessions
    const userChatsCollection = collection(db, 'users', userId, 'chatSessions');
    const unsubscribe = onSnapshot(userChatsCollection, (snapshot) => {
      const updatedSessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || `Chat ${doc.id}`,
      }));
      setChatSessions(updatedSessions);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.error('User is not signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      initializeChatSession();
    }
  }, [initializeChatSession, userId]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isSidebarOpen && window.innerWidth >= 768 && e.clientX <= 50) {
        setIsSidebarOpen(true);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  return (
    <div className={`flex h-screen ${isDark ? 'bg-dark' : 'bg-light'}`}>
      <div className="hamburger" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
        ☰
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        chatSessions={chatSessions}  // Use the chatSessions state directly
        onClose={() => setIsSidebarOpen(false)}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <ThemeToggle />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
