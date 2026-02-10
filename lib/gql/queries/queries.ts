import { gql } from "graphql-request";

export const PROFILE_QUERY =gql `
query{
  getProfile {
    user {
      avatar
      name
      uploadCount
      email
      id
      createdAt
    }
    followersCount
    followingCount
    totalLikes
    lastSavedPins {
      id
      title
      # description
      mediaUrl
      fileType
      # tagIds
      # uploadIndex
      createdAt
      
    }
    lastLikedPins {
      title
      createdAt
      # description
      fileType
      id
      mediaUrl
      # tagIds
    }
  }
}
`;
