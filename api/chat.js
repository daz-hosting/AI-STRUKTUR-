import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

function generateSignature(inputString, key) {
  const hmac = crypto.createHmac('sha256', 'CONSICESIGAIMOVIESkjkjs32120djwejk2372kjsajs3u293829323dkjd8238293938wweiuwe');
  hmac.update(key + inputString + 'normal');
  return hmac.digest('hex');
}

function formatMessages(messages) {
  return messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;
  const user_id = uuidv4().replace(/-/g, '');
  const lastMessage = formatMessages(messages);
  const signature = generateSignature(lastMessage, user_id);

  const data = new URLSearchParams();
  data.append('question', lastMessage);
  data.append('conciseaiUserId', user_id);
  data.append('signature', signature);
  data.append('previousChats', JSON.stringify([{ a: '', b: lastMessage, c: false }]));
  data.append('model', 'normal');

  const response = await fetch('https://toki-41b08d0904ce.herokuapp.com/api/conciseai/chat', {
    method: 'POST',
    headers: {
      'User-Agent': 'okhttp/4.10.0',
      'Connection': 'Keep-Alive',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  });

  if (!response.ok) return res.status(500).json({ answer: 'API Error' });
  const json = await response.json();
  res.status(200).json({ answer: json.answer || 'No message found.' });
}
