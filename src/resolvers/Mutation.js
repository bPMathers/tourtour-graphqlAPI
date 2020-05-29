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

  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)


    return prisma.mutation.createPost({
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

  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExistsAndIsByAuthorizedUser = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    })

    if (!postExistsAndIsByAuthorizedUser) {
      throw new Error('Unable to update post')
    }

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }
      })
    }

    return prisma.mutation.updatePost({
      data: args.data,
      where: {
        id: args.id
      }
    }, info)

  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExistsAndIsByAuthorizedUser = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if (!postExistsAndIsByAuthorizedUser) {
      throw new Error('Unable to delete post')
    }

    return prisma.mutation.deletePost({ where: { id: args.id } }, info)

  },

  async createComment(parent, args, { prisma, request }, info) {
    const postExistsAndIsPublished = await prisma.exists.Post({
      id: args.data.post,
      published: true

    })

    if (!postExistsAndIsPublished) {
      throw new Error('Unable to find post')
    }

    const userId = getUserId(request)

    if (!userId) {
      throw new Error('You need to be logged in to comment on a post!')
    }

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: args.data.post
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
  }
}

export default Mutation
