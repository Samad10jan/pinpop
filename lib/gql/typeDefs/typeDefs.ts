import { gql } from "graphql-request";

export const typeDefs = gql`
type User {
  id: ID!
  name: String!
  email: String!
  avatar: String
}
enum FileType {
  IMAGE
  VIDEO
  OTHER
}
type Pin {
  id: ID!
  title: String
  description: String
  mediaUrl: String!
  fileType: FileType!
  createdAt: String!
}

type AuthPayload {
  user:User!
}


type ProfileResponse {
  user: User!
  savedPins: [Pin!]!
  followersCount: Int!
  followingCount: Int!
}

type Query {
  user:User,
  getProfile: ProfileResponse!
}

type Mutation {
  signup(name:String!,email:String!,password:String!,avatar:String):AuthPayload
  login(email:String!,password:String!):AuthPayload
}
`;
export default typeDefs;