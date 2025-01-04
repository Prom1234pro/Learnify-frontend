import { X, Plus } from 'lucide-react';
import ProfileButton from './ProfileButton';
import { useTheme } from './ThemeContext';
import automationImage from "../assets/automation.jpeg";
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isOpen, isMobileOpen, onClose, onMobileClose, chatSessions}) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const onNewSession = () => {
    navigate(`/new`);
  }
  return (
    <div className="sidebar-container">
      <aside
        className={`mobile-sidebar ${isMobileOpen ? 'sidebar-open' : 'sidebar-closed'} ${isDark ? 'sidebar-dark' : 'sidebar-light'}`}
      >
        <div className="sidebar-header">
          <img src="" className={`logo ${isMobileOpen ? 'block-md' : 'hidden-md'}`} />
          {isMobileOpen && (
            <button onClick={onMobileClose} className={`btn-close ${isDark ? 'btn-close-dark' : ''}`}>
              <X className="icon" />
            </button>
          )}
        </div>

        <div className={`sidebar-content ${isMobileOpen ? 'block-md' : 'hidden-md'}`}>
          <button className={`btn-new-chat ${isDark ? 'btn-new-chat-dark' : ''}`} onClick={onNewSession}>
              <img src={automationImage} alt="Logo" className={`logo ${isMobileOpen ? 'block-md' : 'hidden-md'}`} />
              {isMobileOpen && <span>New Chat</span>}
            <div className="icon-new-chat">
              <Plus className="icon" />
            </div>
          </button>

          <div className="recent-chats">
            {isOpen && <h3 className={`recent-chats-title ${isDark ? 'recent-chats-title-dark' : ''}`}>Recent Sessions</h3>}
            <div className={`chat-items ${isDark ? 'chat-items-dark' : ''}`}>
              <ul>
                {/* eslint-disable-next-line react/prop-types */}
                {chatSessions?.length > 0 ? (
                // eslint-disable-next-line react/prop-types
                  chatSessions.map((session) => (
                    <li key={session.id}>
                      <Link to={`/chat/${session.id}`}>{session.name}</Link>
                    </li>
                  ))
                ) : (
                  <li>No recent chat</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className={`sidebar-footer ${isDark ? 'sidebar-footer-dark' : ''}`}>
          <nav className="footer-nav">
            <ProfileButton isOpen={isMobileOpen} />
          </nav>
        </div>
      </aside>

      <div className={`sidebar-overlay ${isOpen ? 'visible' : 'hidden'}`} onClick={onClose} />

      <aside
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${isDark ? 'sidebar-dark' : 'sidebar-light'}`}
      >
        <div className="sidebar-header">
          <img src="" className={`logo ${isOpen ? 'block-md' : 'hidden-md'}`} />
          {isOpen && (
            <button onClick={onClose} className={`btn-close ${isDark ? 'btn-close-dark' : ''}`}>
              <X className="icon" />
            </button>
          )}
        </div>

        <div className={`sidebar-content ${isOpen ? 'block-md' : 'hidden-md'}`}>
          <button className={`btn-new-chat ${isDark ? 'btn-new-chat-dark' : ''}`} onClick={onNewSession}>
            <Link to="/new" className="new-chat">
              <img src={automationImage} alt="Logo" className={`logo ${isOpen ? 'block-md' : 'hidden-md'}`} />
              {isOpen && <span>New Chat</span>}
            </Link>
            <div className="icon-new-chat">
              <Plus className="icon" />
            </div>
          </button>

          <div className="recent-chats">
            {isOpen && <h3 className={`recent-chats-title ${isDark ? 'recent-chats-title-dark' : ''}`}>Recent Sessions</h3>}
            <div className={`chat-items ${isDark ? 'chat-items-dark' : ''}`}>
              <ul>
                {/* eslint-disable-next-line react/prop-types */}
                {chatSessions?.length > 0 ? (
                // eslint-disable-next-line react/prop-types
                  chatSessions.map((session) => (
                    <li key={session.id}>
                      <Link to={`/chat/${session.id}`}>{session.name}</Link>
                    </li>
                  ))
                ) : (
                  <li>No recent chat</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* <div className={`sidebar-footer ${isDark ? 'sidebar-footer-dark' : ''}`}>
          <nav className="footer-nav">
            <ProfileButton isOpen={isOpen} />
          </nav>
        </div> */}
      </aside>
    </div>
  );
};

export default Sidebar;
