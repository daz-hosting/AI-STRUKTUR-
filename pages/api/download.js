export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ status: 400, error: 'URL kosong' });

  try {
    const api = `https://fastrestapis.fasturl.cloud/downup/ttdown?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const result = await response.json();

    if (result.status !== 200 || !result.result) {
      return res.status(500).json({ status: result.status, error: 'Gagal ambil data' });
    }

    res.status(200).json({ status: 200, result: result.result });
  } catch {
    res.status(500).json({ status: 500, error: 'Internal server error' });
  }
}
