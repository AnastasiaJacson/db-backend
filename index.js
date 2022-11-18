const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('{"message": "Hello world"}');
});

app.get('/inspector/Q/alcoholics', (req, res) => {
    // TODO
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
