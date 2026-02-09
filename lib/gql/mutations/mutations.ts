import { gql } from "graphql-request";

export const SIGN_UP = gql`
mutation Mutation($name: String!, $email: String!, $password: String!, $avatar: String) {
  signup(name: $name, email: $email, password: $password, avatar: $avatar) {
    user {
      email
      id
      name
      avatar
    }
  }
}`

export const LOGIN = gql`
mutation Mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      name
      email
      avatar
      uploadCount
      createdAt
    }
  }
}`