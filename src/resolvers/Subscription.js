const Subscription = {

    comment: {
        subscribe(parents, { reviewId }, { prisma }, info) {
            return prisma.subscription.comment({
                where: {
                    node: {
                        review: {
                            id: reviewId
                        }
                    }
                }
            }, info)

        }
    },

    review: {
        subscribe(parents, args, { prisma }, info) {
            return prisma.subscription.review({
                where: {
                    node: {
                        published: true
                    }
                }
            }, info)
        }
    }
}

export { Subscription as default };