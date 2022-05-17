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

const valid = (a, b, c) => a >= 3 && b >= 3 && c >= 3;
const validEmail = (email) => {
  console.log(email);
  const atSing = email.split('@');
  if (!Array.isArray(atSing) || atSing.length !== 2) return false;
  const splitPoint = atSing[1].split('.');
  if (!Array.isArray(splitPoint) || splitPoint.length !== 2) return false;
  return valid(atSing[0].length, splitPoint[0].length, splitPoint[1].length);
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

const valid2 = (a) => {
 if (a === undefined || a.length === 0) return true;
 return false;
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (valid2(email)) { 
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  } if (!validEmail(email)) { 
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  } if (valid2(password)) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  } if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  
  const { body } = req;
  body.token = token();
  res.status(200).json(body);
});

app.listen(PORT, () => {
  console.log('Online');
});
