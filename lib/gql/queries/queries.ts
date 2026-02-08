import { gql } from "graphql-request";

export const PROFILE_QUERY =gql `
query{
  getProfile{
    user{
      name
      avatar
    }
    savedPins{
      id
      mediaUrl
    }
    followersCount
    followingCount
  }
}
`;
