# TelegramChatNotifier

A simple Node.js library to send formatted messages to a Telegram chat using a bot. Supports MarkdownV2 formatting and automatic rate limit handling.

## Installation

```bash
npm install telegram-chat-notifier
```

## Usage

### 1. Set up your Telegram Bot
- Create a bot via [@BotFather](https://t.me/BotFather) on Telegram and obtain your bot token.
- Add your bot to your desired chat/group and obtain the chat ID (see [How to get chat ID](#how-to-get-chat-id)).

### 2. Configure Environment Variables

Set the following environment variables in your project or system:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `TELEGRAM_CHAT_ID`: The chat ID to send messages to

Alternatively, you can pass these as options to the function.

### 3. Send a Message

```js
const { sendMessage } = require('telegram-chat-notifier');

(async () => {
  const result = await sendMessage(
    'Hello',
    'This is a test message!'
  );
  console.log(result);
})();
```

#### With Custom Options

```js
const { sendMessage } = require('telegram-chat-notifier');

(async () => {
  const result = await sendMessage(
    'Custom Title',
    'Custom body',
    {
      TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN',
      TELEGRAM_CHAT_ID: 'YOUR_CHAT_ID',
      retries: 2 // Optional: number of retry attempts on rate limit
    }
  );
  console.log(result);
})();
```


### 4. Example: Using with Express.js

You can integrate the Telegram-chat-notifier into an Express.js route to send notifications from your web server:

```js
const express = require('express');
const telegram = require('telegram-chat-notifier');

/* gets the TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from the .env file */
require('dotenv').config(); 

const app = express();
app.use(express.json());

app.post('/example1',  (req, res) => {
  const { title, body } = req.body;
 
  telegram.sendMessage(title, body);   //"fire and forget" approach.

  return res.send('hello world');
  
});

app.post('/example2', async (req, res) => {
  const { title, body } = req.body;
  const result = await telegram.sendMessage(title, body);
  if (result.success) {
    res.status(200).json({ message: 'Notification sent!', data: result.data });
  } else {
    res.status(500).json({ error: result.error });
  }
});

app.post('/example3', async (req, res) => {
  const { title, body } = req.body;
  
  //alternatively you can pass the bot token and the chat id as options
  const result = await telegram.sendMessage(title, body,{
      TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN',
      TELEGRAM_CHAT_ID: 'YOUR_CHAT_ID'
  });
  if (result.success) {
    res.status(200).json({ message: 'Notification sent!', data: result.data });
  } else {
    res.status(500).json({ error: result.error });
  }

});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```



## API

### `sendMessage(title, body, options)`

- `title` (string): The message title (will be bolded)
- `body` (string): The message body
- `options` (object, optional):
  - `TELEGRAM_BOT_TOKEN` (string): Telegram bot token (overrides env var)
  - `TELEGRAM_CHAT_ID` (string): Telegram chat ID (overrides env var)
  - `retries` (number): Number of retry attempts on rate limit (default: 3)

**Returns:**
- On success: `{ success: 1, data: <Telegram API response> }`
- On failure: `{ success: 0, error: <error message> }`

## How to get chat ID

1. Start a chat with your bot or add it to a group.
2. Send a message.
3. Use the following URL in your browser (replace `BOT_TOKEN`):
   `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
4. Look for `chat.id` in the response JSON.



## License

MIT 