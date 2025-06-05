const mineflayer = require('mineflayer');

// Lấy thông tin từ dòng lệnh
const [,, address, port, botCountStr, botNameBase] = process.argv;
const botCount = parseInt(botCountStr);
const bots = [];

if (!address || !port || isNaN(botCount) || !botNameBase) {
  console.log('Cách dùng: node bot.js <address> <port> <bot value> <name bot>');
  process.exit(1);
}

function createBot(index) {
  const username = `${botNameBase}${index}`;
  const bot = mineflayer.createBot({
    host: address,
    port: parseInt(port),
    username,
    version: false // auto-detect version
  });

  bot.once('login', () => {
    console.log(`[+] ${username} đã vào server.`);

    // Gửi lệnh /register hoặc /login nếu cần
    setTimeout(() => {
      bot.chat('/register 123456 123456'); // chỉnh nếu cần
      bot.chat('/login 123456');
    }, 3000);

    // Tránh bị kick: gửi chat ngẫu nhiên
    setInterval(() => {
      bot.chat('Hi from ' + username);
    }, 60000);
  });

  bot.on('end', () => {
    console.log(`[-] ${username} bị disconnect. Đang tạo lại...`);
    setTimeout(() => createBot(index), 5000); // Tự tạo lại bot khi bị kick
  });

  bot.on('error', (err) => {
    console.log(`[!] Lỗi bot ${username}:`, err.message);
  });

  bots.push(bot);
}

// Tạo nhiều bot
for (let i = 0; i < botCount; i++) {
  setTimeout(() => createBot(i), i * 1000); // delay tạo bot cho tránh bị block IP
}