'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BANKS = [
  { id: 1, name: 'Хас банк' },
  { id: 2, name: 'Голомт банк' },
  { id: 3, name: 'Хаан банк' },
  { id: 4, name: 'Худалдаа хөгжлийн банк' },
  { id: 5, name: 'Төрийн банк' },
];

export default function TransferPage() {
  const [user, setUser] = useState(null);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toBankId, setToBankId] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('MNT');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      router.push('/login');
      return;
    }
    if (userData && userData !== 'undefined') {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.accounts?.length > 0) {
        setFromAccountId(parsedUser.accounts[0].id.toString());
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          fromAccountId: Number(fromAccountId),
          toBankId: Number(toBankId),
          toAccountNumber,
          recipientName,
          amount: Number(amount),
          currency,
          notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Гүйлгээ амжилтгүй боллоо');
      }
      setSuccess('Гүйлгээ амжилттай!');
      setToAccountNumber('');
      setRecipientName('');
      setAmount('');
      setNotes('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="transfer-container">
      <h2 className="title">Гүйлгээ хийх</h2>
      <form className="transfer-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="fromAccount">Илгээх данс (ID оруулна уу)</label>
          <input
            type="number"
            id="fromAccount"
            value={fromAccountId}
            onChange={e => setFromAccountId(e.target.value)}
            required
            min="1"
            placeholder="Дансын ID оруулна уу"
          />
        </div>

        <div className="form-group">
          <label htmlFor="toBank">Хүлээн авагч банк</label>
          <select
            id="toBank"
            value={toBankId}
            onChange={e => setToBankId(e.target.value)}
            required
          >
            <option value="">Сонгох</option>
            {BANKS.map(bank => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="toAccountNumber">Хүлээн авагчийн дансны дугаар</label>
          <input
            type="text"
            id="toAccountNumber"
            value={toAccountNumber}
            onChange={e => setToAccountNumber(e.target.value)}
            required
            placeholder="Дансны дугаар оруулна уу"
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipientName">Хүлээн авагчийн нэр</label>
          <input
            type="text"
            id="recipientName"
            value={recipientName}
            onChange={e => setRecipientName(e.target.value)}
            required
            placeholder="Нэр оруулна уу"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Дүн</label>
          <input
            type="number"
            id="amount"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            placeholder="Дүн оруулна уу"
          />
        </div>

        <div className="form-group">
          <label htmlFor="currency">Валют</label>
          <select
            id="currency"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          >
            <option value="MNT">MNT</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Тайлбар</label>
          <input
            type="text"
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Тайлбар бичнэ үү (заавал биш)"
          />
        </div>

        <button
          type="submit"
          className="btn-transfer"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Илгээж байна...' : 'Гүйлгээ хийх'}
        </button>

        {success && <div className="message success-message" role="alert">{success}</div>}
        {error && <div className="message error-message" role="alert">{error}</div>}
      </form>

      <style jsx>{`
        .transfer-container {
          max-width: 480px;
          margin: 2rem auto;
          padding: 1.5rem;
          background: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgb(0 0 0 / 0.1);
        }
        .title {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          color: #222;
        }
        .transfer-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #444;
        }
        input[type='text'],
        input[type='number'],
        select {
          padding: 0.5rem 0.75rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          transition: border-color 0.2s ease;
        }
        input[type='text']:focus,
        input[type='number']:focus,
        select:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 5px rgba(0, 112, 243, 0.5);
        }
        .btn-transfer {
          margin-top: 1rem;
          padding: 0.75rem;
          font-size: 1.1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .btn-transfer:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }
        .btn-transfer:not(:disabled):hover {
          background-color: #005bb5;
        }
        .message {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 5px;
          font-weight: 600;
          text-align: center;
        }
        .success-message {
          background-color: #daf5d8;
          color: #2e7d32;
          border: 1px solid #2e7d32;
        }
        .error-message {
          background-color: #fdecea;
          color: #d32f2f;
          border: 1px solid #d32f2f;
        }
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 6px solid #ccc;
          border-top-color: #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 5rem auto;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
