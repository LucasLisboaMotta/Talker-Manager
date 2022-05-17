const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const talkerJson = 'talker.json';

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

let tokens = ['1231231231231231'];

const randomToken = () => {
  const random = () => Math.random().toString(36).substr(2);
  let tok = random();
  while (tok.length < 16) tok += random();
  return tok.split('').filter((_, index) => index < 16).join('');
};

const valid = (a, b, c) => a >= 3 && b >= 3 && c >= 3;
const validEmail = (email) => {
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
  const algo = JSON.parse(fs.readFileSync(talkerJson, 'utf-8'));
  res.status(200).json(algo);
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
  const newToken = randomToken();
  tokens = [...tokens, newToken];
  body.token = newToken;
  res.status(200).json(body);
});

const invalidToken = (token) => {
  if (!token) return true;
  if (!tokens.find((element) => element === token)) return true;
  return false;
};

const invalidTokenMensage = (token) => {
  if (!token) return 'Token não encontrado';
  return 'Token inválido';
};

const invalidName = (name) => {
  if (!name) return true;
  if (name.length < 3) return true;
  return false;
};

const invalidNameMensage = (name) => {
  if (!name) return 'O campo "name" é obrigatório';
  return 'O "name" deve ter pelo menos 3 caracteres';
};

const invalidAge = (age) => {
  if (!age) return true;
  if (age < 18) return true;
  return false;
};

const invalidAgeMensage = (age) => {
  if (!age) return 'O campo "age" é obrigatório';
  return 'A pessoa palestrante deve ser maior de idade';
};

const valid3 = (a, b, c) => a !== 2 || b !== 2 || c !== 4;
const validDate = (date) => {
  if (!date) return true;
  const splitDate = date.split('/');
  if (splitDate.length !== 3) return true;
  if (valid3(splitDate[0].length, splitDate[1].length, splitDate[2].length)) return true;
  return false;
};

const invalidTalkKeys = (talk) => {
  if (talk.rate === undefined || talk.watchedAt === undefined) return true;
  return false;
};

const talkRate = [1, 2, 3, 4, 5];

const invalidTalk = (talk) => {
  if (!talk) return true;
  if (invalidTalkKeys(talk)) return true;
  if (!talkRate.includes(talk.rate)) return true;
  if (validDate(talk.watchedAt)) return true;
  return false;
};

const invalidTalkMensage = (talk) => {
  if (!talk || invalidTalkKeys(talk)) {
    return 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios';
  } if (!talkRate.includes(talk.rate)) return 'O campo "rate" deve ser um inteiro de 1 à 5';
  return 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
};

app.post('/talker', (req, res) => {
  const { authorization: token } = req.headers;
  if (invalidToken(token)) return res.status(401).json({ message: invalidTokenMensage(token) });
  const { name, age, talk } = req.body;
  if (invalidName(name)) return res.status(400).json({ message: invalidNameMensage(name) });
  if (invalidAge(age)) return res.status(400).json({ message: invalidAgeMensage(age) });
  if (invalidTalk(talk)) return res.status(400).json({ message: invalidTalkMensage(talk) });
  const algo = JSON.parse(fs.readFileSync(talkerJson, 'utf-8'));
  const sortTalker = [...algo];
  sortTalker.sort((a, b) => b.id - a.id);
  const id = sortTalker[0].id + 1;
  const newTalker = { id, name, age, talk };
  fs.writeFileSync(talkerJson, JSON.stringify([...algo, newTalker]));
  res.status(201).json(newTalker);
});

app.put('/talker/:id', (req, res) => {
  const { authorization: token } = req.headers;
  if (invalidToken(token)) return res.status(401).json({ message: invalidTokenMensage(token) });
  const { name, age, talk } = req.body;
  if (invalidName(name)) return res.status(400).json({ message: invalidNameMensage(name) });
  if (invalidAge(age)) return res.status(400).json({ message: invalidAgeMensage(age) });
  if (invalidTalk(talk)) return res.status(400).json({ message: invalidTalkMensage(talk) });
  const { id } = req.params;
  const newTalker = { id: Number(id), name, age, talk };
  const algo = JSON.parse(fs.readFileSync(talkerJson, 'utf-8'));
  const algoNovo = algo.filter(({ id: id2 }) => Number(id) !== id2);
  fs.writeFileSync(talkerJson, JSON.stringify([...algoNovo, newTalker]));
  res.status(200).json(newTalker);
});

app.delete('/talker/:id', (req, res) => {
  const { authorization: token } = req.headers;
  if (invalidToken(token)) return res.status(401).json({ message: invalidTokenMensage(token) });
  const { id } = req.params;
  const algo = JSON.parse(fs.readFileSync(talkerJson, 'utf-8'));
  const algoNovo = algo.filter(({ id: id2 }) => Number(id) !== id2);
  console.log(id, algoNovo, 'Oi mãe');
  fs.writeFileSync(talkerJson, JSON.stringify(algoNovo));
  res.status(204).json();
});

app.listen(PORT, () => {
  console.log('Online');
});
