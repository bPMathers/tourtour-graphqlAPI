import prisma from '../../src/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


// Create assets to be able to access their properties in test files
const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('red12345')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'Jen2',
        email: 'jen2@example.com',
        password: bcrypt.hashSync('red12345')
    },
    user: undefined,
    jwt: undefined
}

const reviewOne = {
    input: {
        title: 'First review Title',
        body: 'Fist review Body',
        published: true,
    },
    review: undefined
}

const reviewTwo = {
    input: {
        title: 'Second review Title',
        body: 'Second review Body',
        published: false,
    },
    review: undefined
}

const commentOne = {
    input: {
        text: 'Comment One'
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: 'Comment Two'
    },
    comment: undefined
}

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyComments()
    await prisma.mutation.deleteManyReviews()
    await prisma.mutation.deleteManyUsers()

    // Finish constructing assets with data coming back from the DB upon creation
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

    reviewOne.review = await prisma.mutation.createReview({
        data: {
            ...reviewOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    reviewTwo.review = await prisma.mutation.createReview({
        data: {
            ...reviewTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },

        }
    })

    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            review: {
                connect: {
                    id: reviewOne.review.id
                }
            }
        }
    })

    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            review: {
                connect: {
                    id: reviewOne.review.id
                }
            }
        }
    })

}

export { seedDatabase as default, userOne, userTwo, reviewOne, reviewTwo, commentOne, commentTwo }