const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = '1ed421a0da50ccaa8678ef339eef5b759fcb5da2b155c82d120789c7c84a4e73eac8fdfae11fe4e4dfcec5b64d211ba5674c963deca4bc0aa518ed1f0b58dc959528eff0e92be99afb09ac1140f31b7266335d32ce0e1595f6cfa5136f092b31124d9ef03739e86c75d58a83d125491101d9acb203037f6c765c15975c9ee1ac2dda82a807b21fd77b6b0905a0f8e1bb87f8a9f84662f18e291a6792a1374e0a939c8e404eb178f4b1d293e8cfea38cc6ba81e71ede994561ef7d35d1d65d20dd8fb384f40010f527731cdca8b23e0afe7592ca71a4758d5c7cbfe5cca57801ce37b659e02736096b519ba9c8b6b3b93d4a5d20868f8e75aed52429b80f3856f';

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'test' && password === 'test@123') {
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Protected route
app.get('/protected', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, SECRET_KEY);
        res.json({ message: 'Access granted', user: payload.user });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

// Root
app.get('/', (req, res) => {
    res.send('API is working. Use /login and /protected.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
