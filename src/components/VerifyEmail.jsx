import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { 
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from 'firebase/auth';

const VerifyEmail = () => {
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [email, navigate]);

  useEffect(() => {
    const sendInitialVerification = async () => {
      try {
        // First ensure we're logged in
        if (!auth.currentUser && password) {
          await signInWithEmailAndPassword(auth, email, password);
        }
        
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
          await sendEmailVerification(user);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    sendInitialVerification();
  }, [email, password]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      setTimer(30);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  const handleResend = async () => {
    try {
      setResendDisabled(true);
      setError('');
      
      // Ensure we're logged in before sending verification
      if (!auth.currentUser && password) {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setError('Verification email sent successfully!');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Ensure we're logged in
      if (!auth.currentUser && password) {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Reload the user to check verification status
      await auth.currentUser?.reload();
      const user = auth.currentUser;
      
      if (user?.emailVerified) {
        navigate('/dashboard');
      } else {
        setError('Email not verified yet. Please check your email and click the verification link.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Verify your email</h1>
          <p className="text-gray-500 text-sm">
            We sent a verification email to <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please check your email and click the verification link to continue.
          </p>

          {error && (
            <div className={`text-sm text-center p-2 rounded-md ${
              error.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#a955f7] text-white p-3 rounded-xl hover:bg-[rgba(169,85,247,0.85)] transition-colors disabled:opacity-50"
          >
            {`isLoading ? 'Checking...' : 'I've verified my email'`}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Didn&apos;t receive the email? </span>
            <button 
              onClick={handleResend}
              disabled={resendDisabled}
              className={`text-[#a955f7] hover:underline ${
                resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {resendDisabled ? `Resend in ${timer}s` : 'Click to resend'}
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-2 text-gray-600"
        >
          <span>←</span> Back to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;