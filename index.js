const fetch = require('node-fetch');

// Helper function to escape MarkdownV2 special characters
function escapeMarkdownV2(text) {
  return text.replace(/[\\_\*\[\]\(\)~`>#+\-=|{}\.!]/g, (match) => `\\${match}`);
}

// Helper function to wait for a given number of seconds
function wait(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function sendMessage(title, body, options = { retries:3}) {
  const botToken = options.botToken || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = options.chatId || process.env.TELEGRAM_CHAT_ID;

  try{
      if (!botToken || !chatId) {
      throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID are missing');
      }

      if (typeof title !== 'string') title = String(title);
      if (typeof body !== 'string') body = String(body);

      // Escape title and body for MarkdownV2
      const safeTitle = escapeMarkdownV2(title);
      const safeBody = escapeMarkdownV2(body);
      const message = `*${safeTitle}*\n${safeBody}`;
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'MarkdownV2'
          })
      });

      const data = await response.json();
      if (!data.ok) {
          // Handle rate limit
          if (response.status === 429 && data.parameters && data.parameters.retry_after && options.retries > 0) {
              await wait(data.parameters.retry_after);
             
              const newOptions = { ...options, retries: options.retries - 1 };
              return await sendMessage(title, body, newOptions);
          }
          throw new Error('Invalid response: ' + JSON.stringify(data));
      }

      return {
          success:1,
          data:data
      }

  }catch(err){

      return {
          success:0,
          error:err.message
      }
      
  }
}

module.exports = { sendMessage };