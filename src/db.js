// Demo User Data
const users = [
  {
    id: '1',
    name: 'Benj',
    email: 'benj@example.com',
    age: 27
  },
  {
    id: '2',
    name: 'Max',
    email: 'max@example.com',
    age: 99,
  },
  {
    id: '3',
    name: 'Jambon',
    email: 'jambon@example.com',
  },
];

// Demo array data
const posts = [
  {
    id: '11',
    title: 'How I ate a caribou',
    body: 'lorem ipsum',
    published: true,
    author: '1',
  },
  {
    id: '12',
    title: 'Karma Chameleonita',
    body: 'lorem ipsum 2',
    published: true,
    author: '2',
  },
  {
    id: '13',
    title: 'HZiggazu Pwpadpl',
    body: 'carnita caluana',
    published: false,
    author: '3',
  },
];

const comments = [
  {
    id: '21',
    text: 'This is comment 21 on post 11',
    author: '1',
    post: '11',
  },
  {
    id: '22',
    text: 'This is comment 22 on post 11',
    author: '2',
    post: '11',
  },
  {
    id: '23',
    text: 'This is comment 23 on post 12',
    author: '2',
    post: '12',
  },
  {
    id: '24',
    text: 'This is comment 24 on post 13',
    author: '1',
    post: '13',
  },
];

const db = {
  users,
  posts,
  comments
}

export { db as default }