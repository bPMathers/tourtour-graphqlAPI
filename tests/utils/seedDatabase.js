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

const postOne = {
    input: {
        title: 'First Post Title',
        body: 'Fist Post Body',
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: 'Second Post Title',
        body: 'Second Post Body',
        published: false,
    },
    post: undefined
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
    await prisma.mutation.deleteManyPosts()
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

    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
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
            post: {
                connect: {
                    id: postOne.post.id
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
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })

}

export { seedDatabase as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo }