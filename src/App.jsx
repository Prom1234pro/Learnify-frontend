import ProtectedRoute from './pages/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import NewChat from './pages/NewChatPage';
import Chatting from './pages/ChattingPage';
import LoginPage from './pages/LoginPage';
import VerifyEmail from './components/VerifyEmail';
import ForgotPassword from './components/ForgotPassword';
import VerifyCode from './components/VerifyCode';
import MainLayout from './components/MainLayout';
import ResetPassword from './components/ResetPassword';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/new" replace />} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/new" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <NewChat />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat/:id" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Chatting />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
