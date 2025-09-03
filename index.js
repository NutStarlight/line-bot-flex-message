const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

app.use(express.json());

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

const flexMessages = {
  '#promo1': {
    type: 'flex',
    altText: 'โปรโมชั่นพิเศษวันนี้!',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: 'โปรโมชั่นพิเศษวันนี้!', weight: 'bold', size: 'lg' }
        ]
      }
    }
  }
};

app.post('/webhook', async (req, res) => {
  const events = req.body.events || [];
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text;
      const replyToken = event.replyToken;
      if (flexMessages[text]) {
        await client.replyMessage(replyToken, flexMessages[text]);
      } else {
        await client.replyMessage(replyToken, { type: 'text', text: 'ข้อความไม่ตรงกับ Key Message' });
      }
    }
  }
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
