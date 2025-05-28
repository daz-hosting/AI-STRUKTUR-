import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.status !== 200) {
        setError('Gagal mengambil data dari TikTok');
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Terjadi kesalahan saat menghubungi server');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0f0f0f, #1f1f1f)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: '#2c2c2c',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        <h1 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
          🎬 TikTok Video Downloader
        </h1>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Tempel URL TikTok..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            marginBottom: '12px',
            fontSize: '14px',
          }}
        />

        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#555' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: error || result ? '16px' : '0',
            transition: 'background 0.3s',
          }}
        >
          {loading ? 'Mengambil data...' : 'Download'}
        </button>

        {error && (
          <p style={{ color: 'tomato', textAlign: 'center' }}>{error}</p>
        )}

        {result && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{result.title}</p>
            <video
              src={result.media.videoUrl}
              controls
              style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={result.media.videoUrl}
                download
                style={{
                  backgroundColor: '#28a745',
                  padding: '10px',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                📥 Download Video
              </a>
              <a
                href={result.media.musicUrl}
                download
                style={{
                  backgroundColor: '#6f42c1',
                  padding: '10px',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                🎧 Download Musik
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
          }
