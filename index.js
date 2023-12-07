require('dotenv').config();
const dns = require('dns');
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

app.post('/api/shorturl/', (req, res, next) => {
  let original_url = req.body.url;

  dns.resolveAny(original_url, (err) => {
    if (err) {
      res.json({
        error: 'invalid url',
      });
    } else {
      let id = new Date().getTime();
      data[id] = original_url;
      res.json({
        original_url,
        short_url: id,
      });
    }
  });
});

app.get('/api/shorturl/:url', function (req, res) {
  const { url } = req.params;
  if (data.hasOwnProperty(url)) return res.redirect(data[url]);
  else res.json({ error: 'invalid url' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
