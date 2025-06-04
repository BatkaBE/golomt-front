'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Дансны ID-г query params-аас авна
  const accountId = searchParams.get('accountId');

  useEffect(() => {
    if (!accountId) {
      setError('Дансны дугаар заавал шаардлагатай');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    fetch(`http://localhost:9091/api/transactions/account/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactions(data.data.content);
        } else {
          setError(data.message || 'Гүйлгээний мэдээлэл авахад алдаа гарлаа');
        }
      })
      .catch(() => setError('Сервертэй холбогдож чадсангүй'))
      .finally(() => setLoading(false));
  }, [accountId, router]);

  if (loading) return <div>Түр хүлээнэ үү...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!transactions.length) return <div>Гүйлгээ байхгүй байна</div>;

  return (
    <div className="transactions-container">
      <h2>Дансны гүйлгээний түүх</h2>
      <table>
        <thead>
          <tr>
            <th>Гүйлгээний дугаар</th>
            <th>Төрөл</th>
            <th>Дүн</th>
            <th>Гүйлгээний төлөв</th>
            <th>Хүлээн авагч</th>
            <th>Огноо</th>
            <th>Тайлбар</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.transactionId}</td>
              <td>{tx.type}</td>
              <td>
                {tx.currency} {tx.amount.toLocaleString('mn-MN')}
              </td>
              <td>{tx.status}</td>
              <td>{tx.recipientName}</td>
              <td>{new Date(tx.createdAt).toLocaleString('mn-MN')}</td>
              <td>{tx.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
