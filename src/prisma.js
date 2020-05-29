// connect our NodeJS app to the Prisma GraphQL API

import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    // Grant our NodeJS API access to the Prisma API
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})

export { prisma as default };




