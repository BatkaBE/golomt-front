'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    try {
      const response = await fetch('http://localhost:9091/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
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
          <h1 className="auth-title">Шинэ бүртгэл үүсгэх</h1>
          <p className="auth-subtitle">Бүх мэдээллээ бөглөж бүртгүүлнэ үү</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Хэрэглэгчийн нэр</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Хэрэглэгчийн нэрээ оруулна уу"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Бүтэн нэр</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Бүтэн нэрээ оруулна уу"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">И-мэйл хаяг</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="example@email.com"
            />
          </div>

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

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
          </button>
        </form>

        <div className="auth-link">
          Аль хэдийн бүртгэлтэй юу? <Link href="/login">Нэвтрэх</Link>
        </div>
      </div>
    </div>
  );
}