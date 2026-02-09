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
  }
}
`;
