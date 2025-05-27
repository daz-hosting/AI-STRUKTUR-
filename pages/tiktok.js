import { useState } from 'react';

export default function TikTokDownloader() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url || !url.startsWith('http')) {
      setError('Link tidak valid');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      if (!json || json.status !== 200) {
        throw new Error('Gagal mengambil data TikTok');
      }

      setData(json.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>TikTok Downloader</h1>
      <input
        type="text"
        placeholder="Tempel link TikTok di sini"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      />
      <button onClick={handleDownload} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? 'Memproses...' : 'Download'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div style={{ marginTop: 20 }}>
          <h3>{data.title}</h3>
          <video controls width="100%" src={data.media.videoUrl}></video>
          <p><strong>Author:</strong> {data.author}</p>
          <p><strong>Durasi:</strong> {data.duration} detik</p>
          <p><strong>Tampilan:</strong> {data.playCount}</p>
          <p><strong>Komentar:</strong> {data.comments}</p>
          <p><strong>Berbagi:</strong> {data.shares}</p>
          <audio controls src={data.media.musicUrl}></audio>
        </div>
      )}
    </div>
  );
          }
        
