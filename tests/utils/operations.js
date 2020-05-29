import { gql } from 'apollo-boost'

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;
const login = gql`
  mutation($data: LoginUserInput!) {
    loginUser(data: $data) {
      token
    }
  }
`;

const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;

const getReviews = gql`
  query {
    reviews {
      id
      title
      body
      published
      author {
        id
        name
      }
    }
  }
`;

const updateReview = gql`
  mutation($id: ID!, $data: UpdateReviewInput!) {
    updateReview(
      id: $id,
      data: $data
  ){
      id
      title
      body
      published
    }
  }
`;

const createReview = gql`
  mutation($data: CreateReviewInput!) {
    createReview(
      data: $data
    ) {
      id
      title
      body
      published
    }
  }
`;

const deleteReview = gql`
  mutation($id: ID!) {
    deleteReview(
        id: $id
    ){
        id
    }
  }
`;

const subscribeToComments = gql`
  subscription($reviewId: ID!) {
    comment(reviewId: $reviewId){
      mutation
      node {
        id
        text
      }
    }
  }
`

const deleteComment = gql`
    mutation($id: ID!) {
        deleteComment(
            id: $id
        ){
            id
            text
        }
    }
`

export { createUser, login, getUsers, getProfile, createReview, updateReview, deleteReview, getReviews, deleteComment, subscribeToComments }