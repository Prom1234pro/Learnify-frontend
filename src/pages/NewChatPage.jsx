// NewChatPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInput from '../components/ChatInput';
import UploadSection from '../components/UploadSection';

import './NewChatPage.css';

const NewChat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 800);

  // Fetch chat sessions for the user

  // Add event listeners for scroll, resize, and mouse move
  useEffect(() => {
    const handleScroll = () => {
      if (!isSidebarOpen && window.innerWidth >= 768) {
        const mouseX = window.mousemoveX || 0;
        if (mouseX <= 50) { // When mouse is within 50px of left edge
          setIsSidebarOpen(true);
        }
      }
    };

    const handleMouseMove = (e) => {
      window.mousemoveX = e.clientX;
      if (!isSidebarOpen && window.innerWidth >= 768) {
        if (e.clientX <= 50) { // When mouse is within 50px of left edge
          setIsSidebarOpen(true);
        }
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  const navigate = useNavigate();

  // Function to start a new chat
  const startNewChat = (initialMessage) => {
    const chatId = Date.now(); // Create unique ID for the new chat
    console.log(initialMessage);
    navigate(`/chat/${chatId}`, { state: { initialMessage } });
  };

  return (
      <main className="main">
        <div className="flex-1 overflow-auto">
          <UploadSection />
        </div>
        <ChatInput addMessage={startNewChat} />
      </main>
  );
};

export default NewChat;
