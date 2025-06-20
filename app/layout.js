import './globals.css';

export const metadata = {
  title: 'MoneyApp - Орчин үеийн банкны систем',
  description: 'Найдвартай, хурдан банкны үйлчилгээ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}