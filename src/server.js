// create & setup nodeJS graphql server

// import '@babel/polyfill/noConflict' > deprecated!
import 'core-js'
import 'regenerator-runtime/runtime'

import { GraphQLServer, PubSub } from 'graphql-yoga';
import { resolvers, fragmentReplacements } from './resolvers/index';
import db from './db';
import prisma from './prisma';

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    // These resolvers will all be given access to the context defined below
    resolvers,
    // request contains request.headers (so request.resquest.headers) which we use to pass the JWT token from the client
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})

export { server as default }