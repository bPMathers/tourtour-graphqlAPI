import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';

import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, getUsers, login, getProfile } from './utils/operations'

const client = getClient();

beforeEach(seedDatabase);



test('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'Benjamin2',
      email: 'benjamin@example.com',
      password: 'red12345',
    },
  };

  const response = await client.mutate({
    mutation: createUser,
    variables: variables,
  });

  const userExists = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });

  expect(userExists).toBe(true);
});

test('Should not be able to create user with password < 8 characters', async () => {
  const variables = {
    data: {
      name: 'Benjamin3',
      email: 'benjamin3@example.com',
      password: '1234567',
    },
  };
  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
  expect(response.data.users[1].name).toBe('Jen2');
});

test('Should not login with invalid credentials', async () => {
  const variables = {
    data: {
      email: 'benjamin@example.com',
      password: 'red12345',
    },
  };

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
