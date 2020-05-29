import 'cross-fetch/polyfill';
import { gql, defaultDataIdFromObject } from 'apollo-boost';
import prisma from '../src/prisma';

import seedDatabase, { userOne, reviewOne, reviewTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createReview, updateReview, deleteReview, getReview } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);



test('Should expose only published reviews', async () => {
  const response = await client.query({ query: getReview });

  expect(response.data.reviews.length).toBe(1);
  expect(response.data.reviews[0].published).toBe(true);
});

test('Should be able to update own review', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: reviewOne.review.id,
    data: {
      published: false
    }
  }

  const { data } = await client.mutate({ mutation: updateReview, variables });
  const exists = await prisma.exists.Review({
    id: reviewOne.review.id,
    published: false,
  });

  expect(data.updateReview.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should be able to create review', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: {
      title: "My new review title",
      body: "My new review body",
      published: false
    }
  }

  const { data } = await client.mutate({ mutation: createReview, variables });
  const exists = await prisma.exists.Review({
    id: data.createReview.id,
    title: data.createReview.title,
    body: data.createReview.body,
    published: false,
  });

  expect(data.createReview.title).toBe('My new review title');
  expect(data.createReview.body).toBe('My new review body');
  expect(data.createReview.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should be able to delete review', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: reviewTwo.review.id
  }

  await client.mutate({ mutation: deleteReview, variables });
  const exists = await prisma.exists.Review({
    id: reviewTwo.review.id,
  });
  const reviews = await prisma.query.reviews();

  expect(exists).toBe(false);
  expect(reviews.length).toBe(1);
});
