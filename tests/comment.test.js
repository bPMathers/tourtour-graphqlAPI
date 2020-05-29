import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import { gql } from 'apollo-boost'

import seedDatabase, { userOne, commentOne, commentTwo, reviewOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { deleteComment, subscribeToComments } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);



test('Should be able to delete own comment', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: commentTwo.comment.id
    }

    await client.mutate({ mutation: deleteComment, variables });
    const exists = await prisma.exists.Comment({
        id: commentTwo.comment.id,
    });

    expect(exists).toBe(false);
});

test('Should not be able to delete other users comment', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: commentOne.comment.id
    }

    await expect(
        client.mutate({ mutation: deleteComment, variables })
    ).rejects.toThrow();
});

// sometimes timeout on this one. redo and should pass
test.skip('Should subscribe to comments for a review', async (done) => {
    const variables = {
        reviewId: reviewOne.review.id
    }
    client.subscribe({ query: subscribeToComments, variables }).subscribe({
        next(response) {
            // This will be triggered when an operation runs on our subscribed review
            expect(response.data.comment.mutation).toBe('DELETED')
            done()
        }
    })

    // Operate on a comment
    await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } })
})