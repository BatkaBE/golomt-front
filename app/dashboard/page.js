'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(0);
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
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('mn-MN').format(amount);
  };

  if (!user) {
    return (
      <div className="container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const currentAccount = user.accounts?.[selectedAccount];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <div className="dashboard-logo"> Голомт Банк</div>
          <div className="dashboard-user">
            <div className="user-avatar">
              {getInitials(user.name)}
            </div>
            <span>{user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Гарах
            </button>
          </div>
        </nav>
      </header>

      <main className="dashboard-main">
        {/* Дансны мэдээлэл */}
        <div className="account-cards">
          <h2 className="section-title">Таны дансууд</h2>
          <div className="accounts-grid">
            {user.accounts?.map((account, index) => (
              <div 
                key={account.id} 
                className={`account-card ${selectedAccount === index ? 'active' : ''}`}
                onClick={() => setSelectedAccount(index)}
              >
                <div className="bank-info">
                  <div className="bank-name">{account.bank.name}</div>
                  <div className="account-type">{account.accountType}</div>
                </div>
                <div className="account-number">
                  •••• •••• •••• {account.accountNumber.slice(-4)}
                </div>
                <div className="account-balance">
                  ₮ {formatMoney(account.balance)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Сонгосон дансны дэлгэрэнгүй */}
        {currentAccount && (
          <div className="account-details">
            <div className="detail-card">
              <h3>Дансны дэлгэрэнгүй мэдээлэл</h3>
              
              <div className="account-main-info">
                <div className="balance-display">
                  <div className="balance-label">Боломжтой үлдэгдэл</div>
                  <div className="balance-amount">
                    ₮ {formatMoney(currentAccount.balance)}
                  </div>
                  <div className="currency">{currentAccount.currency}</div>
                </div>
                
                <div className="account-info-grid">
                  <div className="info-item">
                    <div className="info-label">Дансны дугаар</div>
                    <div className="info-value">{currentAccount.accountNumber}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">Банк</div>
                    <div className="info-value">{currentAccount.bank.name}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">SWIFT код</div>
                    <div className="info-value">{currentAccount.bank.swiftCode}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">Дансны төрөл</div>
                    <div className="info-value">{currentAccount.accountType}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">Статус</div>
                    <div className="info-value">
                      <span className={`status ${currentAccount.isActive ? 'active' : 'inactive'}`}>
                        {currentAccount.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">Үүсгэсэн огноо</div>
                    <div className="info-value">
                      {new Date(currentAccount.createdAt).toLocaleDateString('mn-MN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Хэрэглэгчийн мэдээлэл */}
        <div className="user-profile">
          <div className="detail-card">
            <h3>Хувийн мэдээлэл</h3>
            <div className="user-info-grid">
              <div className="info-item">
                <div className="info-label">Нэр</div>
                <div className="info-value">{user.name}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Утас</div>
                <div className="info-value">{user.phone}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">И-мэйл</div>
                <div className="info-value">{user.email}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Бүртгүүлсэн огноо</div>
                <div className="info-value">
                  {new Date(user.createdAt).toLocaleDateString('mn-MN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}