import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.get('/health', (req, res) => {
    res.status(200).send('ok');
});

const PORT = process.env.PORT || 8012;
app.listen(PORT, () => {
    console.log(`Express server is listening at ${PORT}`);
});