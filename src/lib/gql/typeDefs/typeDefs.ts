import { gql } from "graphql-tag";

const typeDefs = gql`


# Queries and Mutations

type Query {
  user: User
  getCurrentProfile: ProfileResponse
  getAllTags: GetTagsAndUploadCountResponse,

  getSugg(search: String!): [String]

  getPinPageResponse(id: ID!): PinPageResponse

  getPinComments(pinId: ID!, page: Int): CommentResponse

  getProfile(userId: ID!): ProfileResponse

  getSavedPins(limit: Int, page: Int): FeedResponse!
  
  getUserFeed(limit: Int, page: Int): FeedResponse!
  
  getSearchPagePins(search: String!, limit: Int, page: Int): FeedResponse!

  getCurrentUserPins: CurrentUserAnalyticsResponse!
  getUserAllPins(userId:ID!,limit: Int, page: Int): FeedResponse!

  getPinsByTag(tagId: ID!, limit: Int, page: Int): FeedResponse!

 
}

type Mutation {
 sendSignupOtp(email: String!): MessageResponse!
  signup(
    name: String!
    email: String!
    password: String!
    avatar: String
    otp: String!
  ): AuthPayload!

  login(
    email: String!
    password: String!
  ): AuthPayload!

  logout: BooleanResponse!

  createPin(
    title: String!
    description: String
    mediaUrl: String!
    fileType: FileType!
    tagIds: [String!]!
    publicId: String!
  resourceType: ResourceType!
  ): Pin!
  
  deletePin(pinId: ID!): BooleanResponse!

  sendComment(
  pinId: ID!
  content: String!
): Comment!

deleteComment(
  commentId: ID!
): BooleanResponse!

toggleSave(pinId: ID!): ToggleSaveResponse!

toggleLike(pinId:ID!): ToggleLikeResponse

toggleFollow(targetUserId: ID!): BooleanResponse!

# addTags:Boolean!
updateProfile(name: String, avatar: String): User!

}

#types

scalar DateTime

enum FileType {
  PHOTO
  GIF
}
enum ResourceType {
  IMAGE
  VIDEO
  RAW
}

type User {
  id: ID!
  name: String!
  email: String!
  avatar: String
  uploadCount: Int!
  # createdAt: DateTime!
}
type Comment {
  id: ID!
  content: String!
  createdAt: DateTime!
  user: User!
}


type Pin {
  id: ID!
  title: String!
  description: String
  mediaUrl: String!
  fileType: FileType!
  tagIds: [ID!]!
   publicId: String!
  resourceType: ResourceType!
  createdAt: DateTime!
  user: User!
 
  # comments: [Comment!]!
  isSaved: Boolean!
  isLiked:Boolean!
}

type CommentResponse {
  comments: [Comment]
  page: Int
  limit: Int
  totalComments: Int!
  hasNextPage: Boolean!
  hasPrevPage: Boolean!
}

type AuthPayload {
  user: User!
  uplaodCount: Boolean!
}

type ProfileResponse {
  user: User!
  followersCount: Int!
  followingCount: Int!
  lastSavedPins: [Pin]
  totalLikes: Int!
  lastUploadedPins: [Pin]
  isFollowing: Boolean!
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
  page: Int!
  limit: Int!
  totalPins: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPrevPage: Boolean!
}

type PinPageResponse {
  pin: Pin!
  relatedPins: [Pin!]!
  followersCount: Int
  likesCount: Int!
  savesCount: Int!
  tags:[Tag!] 
  isFollowing: Boolean!
  
}
type UserPinAnalytics {
  id: ID!
  title: String!
  description: String
  mediaUrl: String!
  fileType: FileType!
  tagIds: [ID!]!
  createdAt: DateTime!
  publicId: String!

  likesCount: Int!
  savesCount: Int!
  commentsCount: Int!

  engagementScore: Float!
}

type CurrentUserAnalyticsResponse {
  pins: [UserPinAnalytics!]!

  totalPins: Int!
  totalLikes: Int!
  totalSaves: Int!
  totalComments: Int!

  followersCount: Int!
  followingCount: Int!

  avgEngagementPerPin: Float!

  topPins: [UserPinAnalytics!]

}

type ToggleSaveResponse {
  saved: Boolean!
}
type ToggleLikeResponse {
  like: Boolean!
}
type BooleanResponse {
  success: Boolean!
}
type MessageResponse {
  message: String!
}



`;

export default typeDefs;