export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL tidak ditemukan' });
  }

  try {
    const apiRes = await fetch(`https://fastrestapis.fasturl.cloud/downup/ttdown?url=${encodeURIComponent(url)}`);
    const json = await apiRes.json();

    if (json.status !== 200 || !json.result) {
      return res.status(500).json({ status: 500, error: 'Gagal mengambil data dari API' });
    }

    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ status: 500, error: err.message });
  }
}
