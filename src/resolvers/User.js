import getUserId from '../utils/getUserId';

const User = {
    // only allow client to access their own email (if they are authenticated)
    email: {
        // Use fragment to fetch parent User.id even if it is not in the selection set of the initial Query
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false)

            if (userId && userId === parent.id) {
                return parent.email
            } else {
                return null
            }

        }
    },
    password: {
        resolve(parents, args, ctx, info) {
            return 'you are not allowed to view passwords in the client'
        }
    },
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            })
        }
    }
}

export { User as default }

