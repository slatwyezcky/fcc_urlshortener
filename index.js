require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

const data = {};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function (req, res) {
  const { url } = req.body;
  const id = new Date().getTime();
  data[id] = url;
  console.log(data);
  res.json({ original_url: url, short_url: id });
});

app.get('/api/shorturl/:url', function (req, res) {
  const { url } = req.params;
  if (data.hasOwnProperty(url)) return res.redirect(data[url]);
  res.json({ error: 'invalid url' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
