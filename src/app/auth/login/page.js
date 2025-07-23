'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import './styles.css';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const googleIcon = <FcGoogle size={24} />;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to log in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageWrapper">
      <main className="pageMain">
        <div className="loginBox">
          <div className="loginHeader">
            <h1 className="loginTitle">Welcome Back</h1>
            <p className="loginSubtitle">Sign in to your FitLeague account</p>
          </div>

          {error && <div className="formError">{error}</div>}

          <form onSubmit={handleSubmit} className="loginForm">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <div className="formDivider">
            <span>or</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-outline google-btn"
          >
            {googleIcon} Continue with Google
          </button>

          <div className="loginFooter">
            <p>
              Don't have an account?{' '}
              <Link href="/auth/signup" className="linkText">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
