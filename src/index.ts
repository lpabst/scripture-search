import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import router from './router';
import addContext from './middleware/addContext';

const app = express();
app.use(addContext);
app.use(router);

const PORT = process.env.PORT || 8012;
app.listen(PORT, () => {
    console.log(`Express server is listening at ${PORT}`);
});