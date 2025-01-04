// src/components/VerifyCode.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyCode = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Redirect if no email is present
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Timer for resend button
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

  const handleInput = (index, value) => {
    // Allow only numbers
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    
    if (sanitizedValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = sanitizedValue;
      setCode(newCode);
      setError('');

      // Move to next input if value is entered
      if (sanitizedValue.length === 1 && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // If current input is empty, move to previous input and clear it
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs[index - 1].current.focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
      e.preventDefault();
    }
    // Handle left arrow
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
    // Handle right arrow
    else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    setError('');
    
    // Focus on the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 4) {
      inputRefs[nextEmptyIndex].current.focus();
    } else if (pastedData.length > 0) {
      inputRefs[3].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    if (fullCode === '3469') {
      navigate('/reset-password', { state: { email } });
    } else {
      setError('Invalid verification code. Please try again.');
      // Clear the code on invalid attempt
      setCode(['', '', '', '']);
      inputRefs[0].current.focus();
    }
  };

  const handleResend = () => {
    setResendDisabled(true);
    setError('');
    setCode(['', '', '', '']);
    // Mock successful resend
    const successMessage = 'Verification code resent successfully!';
    setError(successMessage);
    // Clear success message after 3 seconds
    setTimeout(() => setError(''), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Password reset</h1>
          <p className="text-gray-500 text-sm">
            We sent a code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a955f7] text-xl"
                required
                autoComplete="off"
              />
            ))}
          </div>

          {error && (
            <div className={`text-sm text-center ${
              error.includes('successfully') ? 'text-green-500' : 'text-red-500'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#a955f7] text-white p-3 rounded-xl hover:bg-[rgba(169,85,247,0.85)] transition-colors"
          >
            Verify Code
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500">Didn&apos;t receive the code? </span>
          <button 
            type="button"
            onClick={handleResend}
            disabled={resendDisabled}
            className={`text-[#a955f7] hover:underline ${
              resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {resendDisabled ? `Resend in ${timer}s` : 'Click to resend'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="w-full flex items-center justify-center gap-2 text-gray-600"
        >
          <span>←</span> Back to Email
        </button>
      </div>
    </div>
  );
};

export default VerifyCode;