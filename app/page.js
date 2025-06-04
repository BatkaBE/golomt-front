import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title"> </h1>
        <p className="home-subtitle">
          Орчин үеийн банкны үйлчилгээ таны гар дээр
        </p>
        
        <div className="home-buttons">
          <Link href="/login" className="btn-home btn-login">
            Нэвтрэх
          </Link>
          <Link href="/register" className="btn-home btn-register">
            Бүртгүүлэх
          </Link>
        </div>
      </div>
    </div>
  );
}