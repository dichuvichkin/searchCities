import compression from 'compression';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

import { APP_NAME, STATIC_PATH, WEB_PORT } from '../shared/config';
import { isProd } from '../shared/util';
import renderApp from './render-app';
import findMatches from './functions/findMatches';
import howMuchLeft from './functions/howMuchLeft';
import setLimit from './functions/setLimit';

const app = express();

app.use(compression());
app.use(STATIC_PATH, express.static('dist'));
app.use(STATIC_PATH, express.static('public'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get('/', (req, res) => {
  res.send(renderApp(APP_NAME));
});

const citiesPath = `public/kladr.json`;

app.post('/cities', (req, res) => {
  fs.readFile(citiesPath, (err, data) => {
    if (err) throw err;
    const matchArray = findMatches(req.body.word, JSON.parse(data));
    const wordsToSend = [];
    const count = Number(req.body.count);
    setLimit(wordsToSend, matchArray, count);
    howMuchLeft(wordsToSend, matchArray, count);
    res.write(JSON.stringify(wordsToSend));
    res.end();
  });
});

app.post('/citiesAdd', (req, res) => {
  fs.readFile(citiesPath, (err, data) => {
    if (err) throw err;
    const json = JSON.parse(data);
    const newCity = {
      id: json.length,
      City: req.body.word,
    };
    json.push(newCity);
    fs.writeFile(citiesPath, JSON.stringify(json), error => {
      if (error) throw error;
      res.send();
    });
  });
});

app.listen(WEB_PORT, () => {
  global.console.log(
    `Server running on port ${WEB_PORT} ${isProd ? '(production)' : '(development).\nKeep "yarn dev:wds" running in an other terminal'}.`,
  );
});
