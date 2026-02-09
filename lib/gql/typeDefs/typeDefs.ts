import { gql } from "graphql-request";

const typeDefs = gql`

scalar DateTime

enum FileType {
  PHOTO
  GIF
}

type User {
  id: ID!
  name: String!
  email: String!
  avatar: String
  uploadCount: Int!
  createdAt: DateTime!
}

type Pin {
  id: ID!
  title: String!
  description: String
  mediaUrl: String!
  fileType: FileType!
  tagIds: [ID!]!
  uploadIndex: Int!
  createdAt: DateTime!
  user: User!
}

type AuthPayload {
  user: User!
}

type ProfileResponse {
  user: User!
  followersCount: Int!
  followingCount: Int!
  lastSavedPins: [Pin]
}

# Queries and Mutations

type Query {
  user: User
  getProfile: ProfileResponse
}

type Mutation {
  signup(
    name: String!
    email: String!
    password: String!
    avatar: String
  ): AuthPayload!

  login(
    email: String!
    password: String!
  ): AuthPayload!
}
`;
export default typeDefs;