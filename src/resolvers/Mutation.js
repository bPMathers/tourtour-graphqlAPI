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
      throw new Error("Mauvais nom d'usager ou mot de passe")
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error("Mauvais nom d'usager ou mot de passe")
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

    // // Update Review count for place
    // const existingReviewsForPlace = await.prisma.mutation.updatePlace({
    //   where: {
    //     place: {
    //       id: args.placeId
    //     }
    //   }
    //   /// etc
    // })

    return prisma.mutation.createReview({
      data: {
        rating: args.data.rating,
        title: args.data.title,
        body: args.data.body,
        author: {
          connect: {
            id: userId
          }
        },
        place: {
          connect: {
            id: args.data.placeId
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

    if (!reviewExistsAndIsByAuthorizedUser) {
      throw new Error('Unable to update review')
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
    const userId = getUserId(request)

    return prisma.mutation.createPhoto({
      data: {
        url: args.data.url,
        addedBy: {
          connect: {
            id: userId
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
  async deletePhoto(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const photoExistsAndIsByAuthorizedUser = await prisma.exists.Photo({
      id: args.id,
      addedBy: {
        id: userId
      }
    })

    if (!photoExistsAndIsByAuthorizedUser) {
      throw new Error('Unable to delete photo')
    }

    return prisma.mutation.deletePhoto({ where: { id: args.id } }, info)

  },

  createPlace(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.createPlace({
      data: {
        name: data.name,
        addedBy: {
          connect: {
            // temporarily hardcoded until we implement auth
            id: userId
          },
        },
        // is not required for now. correct when we implement category arrays
        category: {
          connect: {
            id: data.categoryId
          },
        },
        imageUrl: data.imageUrl,
        lat: data.lat,
        lng: data.lng,
        phone: data.phone,
        url: data.url,
        formatted_address: data.formatted_address ?? "Adresse non définie",
        google_place_id: data.google_place_id,
        avgRating: 0,
        review_count: 0
      }
    }, info)
  },
  async updatePlace(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    // const PlaceExistsAndIsByAuthorizedUser = await prisma.exists.Place({
    //   id: args.id,
    //   addedBy: {
    //     connect: {
    //       id: userId
    //     },
    //   },
    // })

    // if (!PlaceExistsAndIsByAuthorizedUser) {
    //   throw new Error('Unable to update Place')
    // }

    return prisma.mutation.updatePlace({
      data: args.data,
      where: {
        id: args.id
      }
    }, info)
  },
  async deletePlace(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const placeExistsAndIsByAuthorizedUser = await prisma.exists.Place({
      id: args.id,
      addedBy: {
        id: userId
      }
    })

    if (!placeExistsAndIsByAuthorizedUser) {
      throw new Error('Unable to delete place')
    }

    return prisma.mutation.deletePlace({ where: { id: args.id } }, info)

  },
}

export default Mutation
