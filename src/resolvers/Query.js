import getUserId from '../utils/getUserId';

const Query = {
  // is this query (and other single item queries)even used somewhere on the client?
  user(parent, args, { prisma, request }, info) {
    // const userId = getUserId(request);
    return prisma.query.user(
      {
        where: {
          id: args.query,
        },
      },
      info
    );
  },
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
        ],
      };
    }
    return prisma.query.users(opArgs, info);
  },

  reviews(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
    };

    // if (args.query) {
    //   opArgs.where.OR = [
    //     {
    //       title_contains: args.query,
    //     },
    //     {
    //       body_contains: args.query,
    //     },
    //   ];
    // }
    if (args.query) {
      opArgs.where = {
        place: {
          id: args.query
        }
      }
    }

    return prisma.query.reviews(opArgs, info);
  },
  myReviews(parents, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const opArgs = {
      where: {
        author: {
          id: userId,
        },
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return prisma.query.reviews(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
    };

    return prisma.query.comments(opArgs, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      info
    );

    return {
      id: 'abc123',
      name: 'Benjamin',
      email: 'mike@example.com',
    };
  },
  async review(parent, args, { prisma, request }, info) {
    // const userId = getUserId(request, false);

    const reviews = await prisma.query.reviews(
      {
        // where: {
        //   id: args.id,
        //   OR: [
        //     {
        //       published: true,
        //     },
        //     {
        //       author: {
        //         id: userId,
        //       },
        //     },
        //   ],
        // },
      },
      info
    );

    if (reviews.length === 0) {
      throw new Error('review not found');
    }

    return reviews[0];
  },

  categories(parent, args, { prisma }, info) {
    const opArgs = {
      // first: args.first,
      // skip: args.skip,
      // after: args.after,
      // orderBy: args.orderBy
    };

    // if (args.query) {
    //   opArgs.where = {
    //     OR: [{
    //       name_contains: args.query
    //     }]
    //   }
    // }
    return prisma.query.categories(opArgs, info);
  },

  places(parent, args, { prisma }, info) {
    const opArgs = {
      // first: args.first,
      // skip: args.skip,
      // after: args.after,
      // orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        category: {
          id: args.query,
        },
      };
    }

    return prisma.query.places(opArgs, info);
  },

  place(parent, args, { prisma }, info) {
    const opArgs = {
      // first: args.first,
      // skip: args.skip,
      // after: args.after,
      // orderBy: args.orderBy
    };

    return prisma.query.place({
      where: {
        id: args.query
      }
    }, info)
  },

  photos(parent, args, { prisma }, info) {
    const opArgs = {
      // first: args.first,
      // skip: args.skip,
      // after: args.after,
      // orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        place: {
          id: args.query,
        },
      };
    }

    return prisma.query.photos(opArgs, info);
  },
};

export { Query as default };
