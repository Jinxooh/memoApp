import express from 'express';
import path from 'path';

import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import morgan from 'morgan';
import bodyParser from 'body-parser';

import mongoose from 'mongoose';
import session from 'express-session';
import api from './routes';

const app = express();
const port = 3000;
const devPort = 7777;

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log('Connected to mongodb server');});

mongoose.connect('mongodb://localhost/Jinx');

app.use(session({
  secret: 'JinxMemo1$2$3$4',
  resave: false,
  saveUninitialized: true
}));

app.use('/', express.static(path.join(__dirname, './../public')));

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api', api);

// 라우터에서 throw err 가 실행되면 이 코드가 실행됩니다
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Somethins broke!');
});

app.get('/hello', (req, res) => {
  return res.send('Hello Memo App');
});

app.listen(port, () => {
  console.log('Express is listening on port', port);
})

if(process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');
  const config = require('../webpack.dev.config');
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(
    devPort, () => {
      console.log('webpack-dev-server is listening on port', devPort);
    }
  );
}
