import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { LogIn, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--background)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        backgroundColor: 'var(--accent-glow)',
        borderRadius: '50%',
        top: '-10%',
        right: '-10%',
        filter: 'blur(100px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '50%',
        bottom: '5%',
        left: '-5%',
        filter: 'blur(80px)',
        zIndex: 0,
      }} />

      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        padding: '3.5rem 3rem',
        zIndex: 1,
        border: '1px solid var(--card-border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: 'var(--primary)',
            marginBottom: '0.75rem',
            fontWeight: 800,
            letterSpacing: '-0.04em'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
            Login to your professional expense hub
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(220, 38, 38, 0.1)', 
            color: 'var(--danger)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-control" 
                style={{ paddingLeft: '3rem' }}
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-control" 
                style={{ paddingLeft: '3rem' }}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', height: '54px' }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Login <LogIn size={18} /></>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>Sign up free <ArrowRight size={14} style={{ verticalAlign: 'middle' }} /></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
