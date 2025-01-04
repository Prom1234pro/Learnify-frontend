import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useTheme } from './ThemeContext';
import './ChatInput.css';

// eslint-disable-next-line react/prop-types
const ChatInput = ({ addMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const { isDark } = useTheme();
  const isDocumentUploaded = true;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    addMessage(message, 'User 2');
    setMessage('');
  };

  return (
    <div className={`chat-input-container ${isDark ? 'chat-input-container--dark' : 'chat-input-container--light'}`}>
      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDocumentUploaded ? 'Chat with your document here' : 'Please upload a document first'}
          className={`chat-textarea 
            ${isDark ? 'chat-textarea--dark' : 'chat-textarea--light'}
          `}
          rows="1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && isDocumentUploaded) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={false}
          className={`chat-submit-button 
            ${isDark ? 'chat-submit-button--dark' : 'chat-submit-button--light'}
          `}
        >
          <Send className="icon-size" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
