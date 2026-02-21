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
  createdAt: DateTime!
  user: User!
 
  # comments: [Comment!]!
  isSaved: Boolean!
  isLiked:Boolean!
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

  # recentPerformance: [DailyStats!]

  # popularTags: [TagStats!]

  # growth: GrowthStats!
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

# Queries and Mutations

type Query {
  user: User
  getCurrentProfile: ProfileResponse
  getAllTags: GetTagsAndUploadCountResponse,

  getSugg(search: String!): [String]

  getPinPageResponse(id: ID!): PinPageResponse

  getPinComments(pinId: ID!, page: Int): [Comment]

  getProfile(userId: ID!): ProfileResponse

  getSavedPins: [Pin]
  
  getUserFeed(limit: Int, page: Int): FeedResponse!
  
  getSearchPagePins(search: String!, limit: Int, page: Int): FeedResponse!

  getCurrentUserPinResponse: CurrentUserAnalyticsResponse!
  getUserAllPins(userId:ID!): FeedResponse!

 
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

  createPin(
    title: String!
    description: String
    mediaUrl: String!
    fileType: FileType!
    tagIds: [String!]!
  ): Pin!

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


`;

export default typeDefs;