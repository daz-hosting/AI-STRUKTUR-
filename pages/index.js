import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.status !== 200) {
        setError('Gagal mengambil data dari TikTok');
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Terjadi kesalahan');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>TikTok Downloader</h1>
      <input
        type="text"
        placeholder="Tempel URL TikTok..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '80%', padding: 8 }}
      />
      <button onClick={handleDownload} style={{ marginLeft: 10, padding: 8 }}>Download</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <p><strong>{result.title}</strong></p>
          <video src={result.media.videoUrl} controls width="320" />
          <br />
          <a href={result.media.musicUrl} download>Tautan Musik 🎵</a>
        </div>
      )}
    </div>
  );
          }
        
