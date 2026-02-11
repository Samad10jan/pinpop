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
  createdAt: DateTime!
  user: User!
  # likesCount: Int!
  # savesCount: Int!
  # commentsCount: Int!
}

type AuthPayload {
  user: User!
}

type ProfileResponse {
  user: User!
  followersCount: Int!
  followingCount: Int!
  lastSavedPins: [Pin]
  totalLikes: Int!
}

type Tag {
  id: ID!
  name: String! 
}

type GetTagsAndUploadCountResponse {
  tags: [Tag!]!
  uploadCount: Boolean!
}

type FeedResponse {
  pins: [Pin!]!
  hasMore: Boolean!
  page: Int!
}

# Queries and Mutations

type Query {
  user: User
  getProfile: ProfileResponse
  getTags: GetTagsAndUploadCountResponse,
  getUserFeed(limit: Int, page: Int): [Pin!]!,
  getSugg(search: String!): [String]
  getSearchPagePins(search: String!,limit: Int, page: Int): [Pin]
  
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

  createPin(
    title: String!
    description: String
    mediaUrl: String!
    fileType: FileType!
    tagIds: [String!]!
  ): Pin!
}
`;

export default typeDefs;