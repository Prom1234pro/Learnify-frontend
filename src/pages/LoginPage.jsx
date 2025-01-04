import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogo from "../assets/google-icon.svg";
import BrandLogo from "../assets/logo_icon_purple.png";
import { Eye, EyeOff } from 'lucide-react';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const storeUserInFirestore = async (user) => {
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(
      userDoc,
      {
        email: user.email,
        displayName: user.displayName || '',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Please verify your email address before signing in.');
        //await sendEmailVerification(user); // Optional: Resend verification email
      } else {
        await storeUserInFirestore(user);
        navigate('/new');
      }
    } catch (error) {
      console.log(error.code)
      if (error.code === 'auth/invalid-credential') {
      console.log(error.code)
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await sendEmailVerification(userCredential.user);
          await storeUserInFirestore(userCredential.user);
          setSuccessMessage('Signup successful! A verification email has been sent to your inbox.');
        } catch (createError) {
          setError(createError.message.replace('Firebase: ', ''));
        }
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError(error.message.replace('Firebase: ', ''));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await storeUserInFirestore(result.user);

      if (!result.user.emailVerified) {
        navigate('/verify-email', { state: { email: result.user.email } });
      } else {
        navigate('/new');
      }
    } catch (error) {
      setError(error.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img src={BrandLogo} alt="Brand Logo" className="w-[50px] h-[50px]" />
          </div>
          <h1 className="text-4xl font-serif tracking-tight">Your ideas, amplified</h1>
          <p className="text-gray-600 text-sm">Privacy-first AI that helps you create in confidence.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 p-3 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={GoogleLogo} alt="Google Logo" className="w-5 h-5" />
            <span className="text-gray-700">Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{error}</div>}
          {successMessage && <div className="text-green-500 text-sm text-center p-2 bg-green-50 rounded-md">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your personal or work email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              disabled={isLoading}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#a955f7] text-white p-3 rounded-md hover:bg-[rgba(169,85,247,0.65)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
