import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { UserPlus, User, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
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
        width: '500px',
        height: '500px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '50%',
        top: '-5%',
        left: '-5%',
        filter: 'blur(100px)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        backgroundColor: 'var(--accent-glow)',
        borderRadius: '50%',
        bottom: '0%',
        right: '0%',
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
            Join Us
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
            Create your professional finance account
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
                placeholder="Pick a username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-control" 
                style={{ paddingLeft: '3rem' }}
                placeholder="name@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                placeholder="Create password"
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
              <>Sign Up <UserPlus size={18} /></>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>Log in here</Link>
          </p>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
            <ArrowLeft size={14} /> Back to welcome
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
