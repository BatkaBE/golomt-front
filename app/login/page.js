'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:9091/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.data && data.data.user) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        router.push('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Сүлжээний алдаа гарлаа');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Тавтай морил</h1>
          <p className="auth-subtitle">Өөрийн бүртгэлээр нэвтэрнэ үү</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Утасны дугаар</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="99983205"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Нууц үг</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>

        <div className="auth-link">
          Бүртгэл байхгүй юу? <Link href="/register">Бүртгүүлэх</Link>
        </div>
      </div>
    </div>
  );
}