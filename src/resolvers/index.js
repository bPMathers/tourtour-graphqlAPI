import { extractFragmentReplacements } from 'prisma-binding';

import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import User from './User';
import Review from './Review';
import Comment from './Comment';

// Don't really know what this is or why it works
const Node = {
  __resolveType() {
    return null;
  },
};

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Review,
  Node,
  Comment,

};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
