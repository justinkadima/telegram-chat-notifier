const { sendMessage } = require('../index');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());

describe('sendMessage', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should return success when Telegram API responds with ok', async () => {
    fetch.mockResolvedValue({
      json: async () => ({ ok: true, result: { message_id: 1 } }),
      status: 200
    });
    const result = await sendMessage('Test Title', 'Test Body', { botToken: 'token', chatId: 'chat' });
    expect(result.success).toBe(1);
    expect(result.data.result.message_id).toBe(1);
  });

  it('should return error when Telegram API responds with error', async () => {
    fetch.mockResolvedValue({
      json: async () => ({ ok: false, description: 'Bad Request' }),
      status: 400
    });
    const result = await sendMessage('Test Title', 'Test Body', { botToken: 'token', chatId: 'chat' });
    expect(result.success).toBe(0);
    expect(result.error).toMatch(/Invalid response/);
  });

  it('should return error if botToken or chatId is missing', async () => {
    const result = await sendMessage('Test Title', 'Test Body', {});
    expect(result.success).toBe(0);
    expect(result.error).toMatch(/missing/);
  });
}); 