import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;
const router = require('./routes/index');

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
