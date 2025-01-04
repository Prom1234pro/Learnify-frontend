import { useTheme } from './ThemeContext';
import './ChatDisplay.css';

// eslint-disable-next-line react/prop-types
const ChatDisplay = ({ messages }) => {
  // Mock chat messages
  const { isDark } = useTheme();
  

  return (
    <div className='chat-container'>
      {/*  eslint-disable-next-line react/prop-types */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat-message ${message.user === 'User 1' ? 'left' : 'right'}`}
        >
          <div className={`message-bubble ${isDark? "dark":'light'}`}>
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatDisplay;

