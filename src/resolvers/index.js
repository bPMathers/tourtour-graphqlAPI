import { extractFragmentReplacements } from 'prisma-binding'

import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import User from './User';
import Review from './Review';
import Comment from './Comment';

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Review,
    Comment
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }