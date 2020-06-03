import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

import hashPassword from '../utils/hashPassword'
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {

    const hashedPassword = await hashPassword(args.data.password)

    // Our choice to sanitize the client requests or not.
    // const emailTaken = await prisma.exists.User({ email: args.data.email })

    // if (emailTaken) {
    //   throw new Error('Email taken.');
    // }

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword
      }, info
    })

    return {
      user,
      token: generateToken(user.id)
    }
  },

  async loginUser(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    })

    if (!user) {
      throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  },

  createReview(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)


    return prisma.mutation.createReview({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },

  async updateReview(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const reviewExistsAndIsByAuthorizedUser = await prisma.exists.Review({
      id: args.id,
      author: {
        id: userId
      }
    })

    const isPublished = await prisma.exists.Review({
      id: args.id,
      published: true
    })

    if (!reviewExistsAndIsByAuthorizedUser) {
      throw new Error('Unable to update review')
    }

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          review: {
            id: args.id
          }
        }
      })
    }

    return prisma.mutation.updateReview({
      data: args.data,
      where: {
        id: args.id
      }
    }, info)

  },

  async deleteReview(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const reviewExistsAndIsByAuthorizedUser = await prisma.exists.Review({
      id: args.id,
      author: {
        id: userId
      }
    })

    if (!reviewExistsAndIsByAuthorizedUser) {
      throw new Error('Unable to delete review')
    }

    return prisma.mutation.deleteReview({ where: { id: args.id } }, info)

  },

  async createComment(parent, args, { prisma, request }, info) {
    const reviewExistsAndIsPublished = await prisma.exists.Review({
      id: args.data.review,
      published: true

    })

    if (!reviewExistsAndIsPublished) {
      throw new Error('Unable to find review')
    }

    const userId = getUserId(request)

    if (!userId) {
      throw new Error('You need to be logged in to comment on a review!')
    }

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId
          }
        },
        review: {
          connect: {
            id: args.data.review
          }
        }
      }

    }, info)
  },

  async updateComment(parents, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExistsAndIsByAuthorizedUser = await prisma.exists.Comment({
      id: args.id, author: {
        id: userId
      }
    })

    if (!commentExistsAndIsByAuthorizedUser) {
      throw new Error('Could not update comment')
    }

    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data

    }, info)
  },

  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExistsAndIsByAuthorizedUser = await prisma.exists.Comment({
      id: args.id, author: {
        id: userId
      }
    })

    if (!commentExistsAndIsByAuthorizedUser) {
      throw new Error('Could not delete comment')
    }

    return prisma.mutation.deleteComment({ where: { id: args.id } }, info)
  },

  createPhoto(parent, args, { prisma, request }, info) {
    // const userId = getUserId(request)

    return prisma.mutation.createPhoto({
      data: {
        url: args.data.url,
        addedBy: {
          connect: {
            id: "ckay6pdbc009u0778w2bb7lb5"
          },
        },
        place: {
          connect: {
            id: args.data.placeId
          },
        },
      }
    }, info)
  },
}

export default Mutation
