const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talker = [
  {
    name: 'Henrique Albuquerque',
    age: 62,
    id: 1,
    talk: { watchedAt: '23/10/2020', rate: 5 },
  },
  {
    name: 'Heloísa Albuquerque',
    age: 67,
    id: 2,
    talk: { watchedAt: '23/10/2020', rate: 5 },
  },
  {
    name: 'Ricardo Xavier Filho',
    age: 33,
    id: 3,
    talk: { watchedAt: '23/10/2020', rate: 5 },
  },
  {
    name: 'Marcos Costa',
    age: 24,
    id: 4,
    talk: { watchedAt: '23/10/2020', rate: 5 },
  },
];

const token = () => {
  const random = () => Math.random().toString(36).substr(2);
  let tok = random();
  while (tok.length < 16) tok += random();
  return tok.split('').filter((_, index) => index < 16).join('');
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  res.status(200).json(talker);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const findTalker = talker.find((r) => r.id === Number(id));
  if (!findTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(findTalker);
});

app.post('/login', (req, res) => {
  const { body } = req;
  body.token = token();
  res.status(200).json(body);
});

app.listen(PORT, () => {
  console.log('Online');
});
