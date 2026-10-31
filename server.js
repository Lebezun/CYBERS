require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

// Данні додатка з fallback значеннями
const CLIENT_ID = (process.env.GITHUB_CLIENT_ID || 'Ov23lihqXSaiTbK3a8zA').trim();
const CLIENT_SECRET = (process.env.GITHUB_CLIENT_SECRET || 'cb60737e63adb228c2d2ca8e39bf0746bbe126e1').trim();
const REDIRECT_URI = (process.env.REDIRECT_URI || 'http://localhost:3000/auth/github/callback').trim();

// Налаштування сесії
app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key_123',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// 1. Головна сторінка
app.get('/', (req, res) => {
  if (req.session.user) {
    const { name, login, avatar_url } = req.session.user;
    return res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>Вітаємо, ${name || login}!</h1>
        <img src="${avatar_url}" alt="Avatar" width="120" style="border-radius: 50%; border: 3px solid #333;" />
        <br><br>
        <a href="/logout" style="padding: 10px 20px; background-color: #ff4d4d; color: white; text-decoration: none; border-radius: 5px;">Вийти</a>
      </div>
    `);
  }
  
  res.send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1>Головна сторінка</h1>
      <a href="/auth/github" style="padding: 10px 20px; background-color: #24292e; color: white; text-decoration: none; border-radius: 5px;">
        Увійти через GitHub
      </a>
    </div>
  `);
});

// 2. Авторизація через GitHub
app.get('/auth/github', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=read:user&state=${state}`;

  res.redirect(githubAuthUrl);
});

// 3. Обробка колбеку від GitHub
app.get('/auth/github/callback', async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.session.oauthState;

  if (!state || state !== storedState) {
    req.session.oauthState = null;
    return res.status(403).send('Помилка: Недійсний параметр state (CSRF захист).');
  }
  req.session.oauthState = null;

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).send('Не вдалося отримати access token.');
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Node.js-OAuth-App'
      }
    });

    req.session.user = userResponse.data;
    res.redirect('/');
  } catch (error) {
    console.error('Помилка OAuth:', error.response ? error.response.data : error.message);
    res.status(500).send('Помилка авторизації.');
  }
});

// 4. Вихід із системи
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на http://localhost:${PORT}`));