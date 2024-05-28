import express from 'express';

const app = express();

const disableCors = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
};

app.use(disableCors);

app.get('/processes', (req, res) => {
  res.send([{ name: 'Approval' }, { name: 'ProductOrderRequest' }]);
});

app.listen(3000, () => {
  console.log('App listening on http://localhost:3000');
});
