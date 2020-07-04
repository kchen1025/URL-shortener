import bodyParser = require('body-parser');
import express = require('express');
import session = require('express-session');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);

app.get('/api', (req, res) => {
  console.log('yeet');
  res.send('api tesdstdsdfd');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up! at ${port}`);
});
