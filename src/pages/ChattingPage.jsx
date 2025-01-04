// ChattingPage.jsx
import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import ChatInput from '../components/ChatInput';
import { useTheme } from '../components/ThemeContext';
import ChatDisplay from '../components/ChatDisplay';
import { db } from '../firebase'; // Firebase Firestore instance
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import './NewChatPage.css';
import './ChattingPage.css';

const Chatting = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  // Listen for authentication state changes to get the userId
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!userId || !id) return;

    const chatDoc = doc(db, 'users', userId, 'chatSessions', id);
    const chatSnap = await getDoc(chatDoc);

    if (chatSnap.exists()) {
      setMessages(chatSnap.data().messages || []);
    } else if (state?.initialMessage) {
      if (state.isSummary){
        const initialMessages = [
          { id: 1, text: state.initialMessage, user: 'User 1' },
        ];
        await setDoc(chatDoc, { messages: initialMessages });
        setMessages(initialMessages);
      }else {

        const initialMessages = [
          { id: 1, text: state.initialMessage, user: 'User 2' },
          { id: 2, text: 'Welcome to the chat', user: 'User 1' },
        ];
        await setDoc(chatDoc, { messages: initialMessages });
        setMessages(initialMessages);
      }
    }
  }, [id, state, userId]);

  // Add a message to the chat
  // Import Axios for API calls

  const addMessage = useCallback(
    async (text, user) => {
      const newMessage = { id: messages.length + 1, text, user };
      const chatDoc = doc(db, 'users', userId, 'chatSessions', id);
  
      // Add user's message to the UI
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      try {
        // Call the API for a response
        const historyLog = [...messages, { user, text }]; // Include the latest user message
        const context = localStorage.getItem('uploadedDocument') || '';
        const response = await fetch('https://backend-368k.onrender.com/chat-with-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: text,
            history_log: historyLog.map((msg) => ({
              role: msg.user,
              text: msg.text,
            })),
            topic: '', // Update if needed
            context: context,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
  
        const data = await response.json();
        const botMessage = {
          id: newMessage.id + 1,
          text: data.response[0],
          user: 'User 1',
        };
  
        // Add bot's response to the UI
        setMessages((prevMessages) => [...prevMessages, botMessage]);
  
        // Save both messages in Firestore
        const chatSnap = await getDoc(chatDoc);
  
        if (chatSnap.exists()) {
          // If the document exists, update it
          await updateDoc(chatDoc, { messages: arrayUnion(newMessage, botMessage) });
        } else {
          // If the document doesn't exist, create it
          await setDoc(chatDoc, { messages: [newMessage, botMessage] });
        }
      } catch (error) {
        console.error('Error calling the chat API or updating Firestore:', error);
      }
    },
    [id, messages, userId]
  );
  


  // Fetch user chats and messages on mount or when userId changes
  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [fetchMessages, userId]);

  return (
    
      <main className="main">
        <div className="chatting-container">
          <ChatDisplay messages={messages} />
          <div className={`input-box ${isDark ? 'dark' : 'light'}`}>
            <ChatInput addMessage={addMessage} isChatting={true} />
          </div>
        </div>
      </main>
  );
};

export default Chatting;
