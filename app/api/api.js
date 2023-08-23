import axios from 'axios';
// @ts-ignore
const handler = async (req, res) => {
  try {
    
    const { method, body } = req;

    const { url, method: m, data } = body;

    if (method === 'POST') {
      const response = await axios({
        url,
        method: m,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        data,
      });
  
      res.status(response.status).json(response.data);
    } else res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export default handler;