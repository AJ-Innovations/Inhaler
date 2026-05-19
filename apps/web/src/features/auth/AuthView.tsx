'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ChevronLeft, User, CheckCircle, Key } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface AuthViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthView({ onBack, onSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  // Forgot Password Flow States
  const [authFlow, setAuthFlow] = useState<'form' | 'forgot_email' | 'forgot_otp' | 'forgot_reset' | 'forgot_success'>('form');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input field
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Auto-focus last box
      const lastInput = document.getElementById('otp-3') as HTMLInputElement | null;
      if (lastInput) lastInput.focus();
    }
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: name.trim()
            }
          }
        });
        if (error) throw error;
        alert('Verification email sent! Please check your inbox (or spam folder) to verify your account, then log in.');
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });
        if (error) throw error;
        
        // Successfully logged in!
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const renderFlowContent = () => {
    switch (authFlow) {
      case 'forgot_email':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20"
              >
                <Key size={28} className="text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight text-white">Forgot Password</h1>
                <p className="text-gray-500 font-light text-xs max-w-[280px] mx-auto leading-relaxed">
                  Enter your registered email address below, and we'll send you a 4-digit code to verify your identity.
                </p>
              </div>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={16} />
                </div>
                <input 
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-full pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                />
              </div>

              <button 
                onClick={() => {
                  if (email.trim()) {
                    setAuthFlow('forgot_otp');
                  } else {
                    alert('Please enter your email address first.');
                  }
                }}
                className="w-full h-14 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
              >
                Send Verification Code
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <button 
                onClick={() => setAuthFlow('form')}
                className="text-xs font-light text-gray-600 hover:text-indigo-400 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        );

      case 'forgot_otp':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20"
              >
                <Lock size={28} className="text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight text-white">Enter Code</h1>
                <p className="text-gray-500 font-light text-xs max-w-[280px] mx-auto leading-relaxed">
                  We've sent a 4-digit verification code to <span className="text-emerald-400 font-medium">{email}</span>.
                </p>
              </div>
            </div>

            {/* 4-Digit OTP Boxes */}
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-14 h-16 bg-white/[0.03] border border-white/10 rounded-full text-center text-2xl font-light text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
                  />
                ))}
              </div>

              <button 
                onClick={() => {
                  const enteredCode = otp.join('');
                  if (enteredCode.length === 4) {
                    setAuthFlow('forgot_reset');
                  } else {
                    alert('Please enter the complete 4-digit code.');
                  }
                }}
                className="w-full h-14 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
              >
                Verify Code
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>

            {/* Resend and Back Option */}
            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={() => {
                  setOtp(['', '', '', '']);
                  alert(`A new 4-digit verification code has been sent to ${email}`);
                }}
                className="text-[10px] uppercase tracking-widest font-black text-gray-500 hover:text-emerald-400 transition-colors"
              >
                Resend Code
              </button>
              <button 
                onClick={() => setAuthFlow('forgot_email')}
                className="text-xs font-light text-gray-600 hover:text-emerald-400 transition-colors"
              >
                Back to Email Input
              </button>
            </div>
          </div>
        );

      case 'forgot_reset':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20"
              >
                <Lock size={28} className="text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight text-white">Reset Password</h1>
                <p className="text-gray-500 font-light text-xs max-w-[280px] mx-auto leading-relaxed">
                  Create a strong, secure new password for your Spirox account.
                </p>
              </div>
            </div>

            {/* Passwords Form */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-full pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-full pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!newPassword.trim() || !confirmPassword.trim()) {
                    alert('Please fill out both password fields.');
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    alert('Passwords do not match. Please verify your typing.');
                    return;
                  }
                  setAuthFlow('forgot_success');
                }}
                className="w-full h-14 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
              >
                Save New Password
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        );

      case 'forgot_success':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-[32px] mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/30"
              >
                <CheckCircle size={36} className="text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight text-white">Password Reset</h1>
                <p className="text-gray-500 font-light text-xs max-w-[280px] mx-auto leading-relaxed">
                  Your password has been successfully updated. You can now sign in with your new credentials.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setNewPassword('');
                setConfirmPassword('');
                setEmail('');
                setOtp(['', '', '', '']);
                setAuthFlow('form');
              }}
              className="w-full h-14 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl active:scale-95"
            >
              Sign In Now
            </button>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20"
              >
                <Lock size={28} className="text-white" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-tight text-white">
                  {mode === 'login' ? 'Welcome Back' : 'Join Spirox'}
                </h1>
                <p className="text-gray-500 font-light text-xs">
                  {mode === 'login' 
                    ? 'Sign in to continue your journey.' 
                    : 'Start your journey to mindfulness today.'}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {mode === 'signup' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="relative group"
                    >
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                        <User size={16} />
                      </div>
                      <input 
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-full pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-full pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-full pl-16 pr-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-light text-sm"
                  />
                </div>

                {mode === 'login' && (
                  <div className="flex justify-end px-2">
                    <button 
                      onClick={() => setAuthFlow('forgot_email')}
                      className="text-[10px] uppercase tracking-widest font-black text-gray-600 hover:text-emerald-400 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="text-red-400 text-xs font-light text-center bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl shrink-0">
                  {errorMessage}
                </div>
              )}

              <button 
                onClick={handleAuth}
                disabled={loading}
                className="w-full h-14 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight size={16} strokeWidth={3} />}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[9px] uppercase tracking-widest text-gray-700 font-bold">Or continue with</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3">
              <button className="h-14 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center gap-3 hover:bg-white/5 transition-all active:scale-95 group text-gray-500 hover:text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white group-hover:scale-110 transition-transform">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Google</span>
              </button>
              <button className="h-14 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center gap-3 hover:bg-white/5 transition-all active:scale-95 group text-gray-500 hover:text-white">
                <svg width="15" height="18" viewBox="0 0 256 315" fill="currentColor" className="text-white group-hover:scale-110 transition-transform">
                  <path d="M213.803 167.03c.442 47.58 41.74 63.413 42.147 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.394-27.815-12.44-51.848-12.44-24.032 0-31.504 12.047-51.456 12.834-20.741.786-36.64-21.123-49.854-40.215-27.017-39.041-47.652-110.192-19.828-158.451 13.82-24.02 38.53-39.223 65.333-39.617 20.346-.393 39.512 13.71 52.032 13.71 12.522 0 35.844-16.913 60.604-14.44 10.387.43 39.589 4.184 58.293 31.593-1.496.932-34.881 20.32-34.453 60.038zM174.17 49.303c11.091-13.43 18.594-32.131 16.554-50.803-16.038.645-35.414 10.68-46.913 24.11-10.313 11.954-19.34 31.065-16.902 49.336 17.904 1.389 36.174-9.213 47.261-22.643z"/>
                </svg>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Apple ID</span>
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="text-center pt-2">
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-xs font-light text-gray-600 hover:text-emerald-400 transition-colors"
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-transparent z-[300] flex flex-col overflow-hidden backdrop-blur-2xl"
    >
      <div className="max-w-[480px] mx-auto w-full px-8 py-6 flex flex-col h-full">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors mb-6 self-start"
        >
          <ChevronLeft size={18} className="text-gray-400" />
        </button>

        <div className="flex-1 flex flex-col justify-center space-y-8">
          {renderFlowContent()}
        </div>

        {/* Footer */}
        <p className="mt-auto text-center text-[9px] text-gray-800 font-medium tracking-tighter pt-8">
          By continuing, you agree to our <span className="text-gray-700">Terms</span> and <span className="text-gray-700">Privacy</span>.
        </p>
      </div>

      {/* Decorative Blur Elements */}
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
    </motion.div>
  );
}
