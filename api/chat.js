import crypto from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function generateSignature(inputString, key) {
  const hmac = crypto.createHmac('sha256', 'CONSICESIGAIMOVIESkjkjs32120djwejk2372kjsajs3u293829323dkjd8238293938wweiuwe');
  hmac.update(key + inputString + 'normal');
  return hmac.digest('hex');
}

function formatMessages(messages) {
  return messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n');
}

async function scrapeResponse(content) {
  try {
    const response = await axios.get('https://api.siputzx.my.id/api/ai/gemini-pro', {
      params: { content: content },
      headers: { 'accept': '*/*' }
    });
    if (response.data && response.data.status) {
      return response.data.data;
    } else {
      return 'Gagal mendapatkan data dari Gemini API.';
    }
  } catch (error) {
    return 'Scraping error: ' + error.message;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, model } = req.body;
  const user_id = uuidv4().replace(/-/g, '');
  const lastMessage = formatMessages(messages);

  if (model === 'gemini') {
    const geminiResponse = await scrapeResponse(lastMessage);
    return res.status(200).json({ result: geminiResponse });
  }

  const signature = generateSignature(lastMessage, user_id);
  const data = new URLSearchParams();
  data.append('question', lastMessage);
  data.append('conciseaiUserId', user_id);
  data.append('signature', signature);
  data.append('previousChats', JSON.stringify([{ a: '', b: lastMessage, c: false }]));

  try {
    const conciseResponse = await fetch('https://concise-ai.p.rapidapi.com/ask', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'concise-ai.p.rapidapi.com'
      },
      body: data
    });
    const conciseResult = await conciseResponse.json();
    return res.status(200).json(conciseResult);
  } catch (error) {
    return res.status(500).json({ error: 'Concise AI error: ' + error.message });
  }
}
