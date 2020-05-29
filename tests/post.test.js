import 'cross-fetch/polyfill';
import { gql, defaultDataIdFromObject } from 'apollo-boost';
import prisma from '../src/prisma';

import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createPost, updatePost, deletePost, getPosts } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);



test('Should expose only published posts', async () => {
  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  }

  const { data } = await client.mutate({ mutation: updatePost, variables });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false,
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should be able to create post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: {
      title: "My new post title",
      body: "My new post body",
      published: false
    }
  }

  const { data } = await client.mutate({ mutation: createPost, variables });
  const exists = await prisma.exists.Post({
    id: data.createPost.id,
    title: data.createPost.title,
    body: data.createPost.body,
    published: false,
  });

  expect(data.createPost.title).toBe('My new post title');
  expect(data.createPost.body).toBe('My new post body');
  expect(data.createPost.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should be able to delete post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postTwo.post.id
  }

  await client.mutate({ mutation: deletePost, variables });
  const exists = await prisma.exists.Post({
    id: postTwo.post.id,
  });
  const posts = await prisma.query.posts();

  expect(exists).toBe(false);
  expect(posts.length).toBe(1);
});
