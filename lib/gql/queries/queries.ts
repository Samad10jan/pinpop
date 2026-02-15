import { gql } from "graphql-request";

export const CURRENT_PROFILE_QUERY = gql`
query{
  getCurrentProfile {
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
      mediaUrl
      fileType
      createdAt
      
    }
  }
}
`;
export const PROFILE_QUERY = gql`

query GetProfile($userId: ID!) {
  getProfile(userId: $userId) {
    followersCount
    followingCount
    totalLikes
    lastUploadedPins{
      id
      title
      mediaUrl
      fileType
      createdAt
    }
    user {
      id
      name
      email
      avatar
      uploadCount
      createdAt
    }
  }
}
`

export const GET_TAGS_QUERY = gql`
query {
  getAllTags {
    tags {
      id
      name
    }
    uploadCount
  }
}`

export const CREATE_PIN_MUTATION = gql`
mutation($title: String!, $description: String, $mediaUrl: String!, $fileType: FileType!, $tagIds: [String!]!) {
  createPin(title: $title, description: $description, mediaUrl: $mediaUrl, fileType: $fileType, tagIds: $tagIds) {
    id
    createdAt
    description
    fileType
    mediaUrl
    tagIds
    title
  }
}`


export const SUGG_QUERY = gql`
query($search: String!) {
  getSugg(search: $search)
}`

// export const SEARCH_PAGE_PINS_QUERY = gql`
// query($search: String!) {
//   getSearchPagePins(search: $search) {
//     # isSaved
//     id
//     mediaUrl
//     fileType
//     tagIds
//     title
//     createdAt
    
//   }
// }`

export const SEARCH_PAGE_PINS_QUERY = gql`
query ($search: String!, $limit: Int, $page: Int) {
  getSearchPagePins(search: $search, limit: $limit, page: $page) {
    hasNextPage
    hasPrevPage
    limit
    page
    pins {
      createdAt
      fileType
      id
      isSaved
      mediaUrl
      tagIds
      title
      user {
        id
        name
      }
    }
    totalPages
    totalPins
  }
}`

export const PIN_PAGE_QUERY = gql`

query($getPinPageResponseId: ID!) {
  getPinPageResponse(id: $getPinPageResponseId) {

    followersCount
    likesCount
    savesCount

    pin {
      isSaved
       isLiked
      mediaUrl
      tagIds
      description
      createdAt
      fileType
      id
      title
      user {
        avatar
        email
        name
        id
      }
    }
    tags {
      id
      name
    }

    relatedPins {
      isSaved
      createdAt
      mediaUrl
      title
      id
      fileType
    }
  }
}

`

// export const FEED_QUERY = gql`
// query ($limit: Int, $page: Int) {
//   getUserFeed(limit: $limit, page: $page) {
//     isSaved
//     id
//     mediaUrl
//     fileType
//     tagIds
//     title
//     createdAt
//     user {
//       id
//       name
//       avatar
//     }
//   }
// }
// `;

export const FEED_QUERY= gql`
query ( $limit: Int, $page: Int) {
  getUserFeed(limit: $limit, page: $page) {
    
    pins {
      createdAt
      fileType
      id
      isSaved
      mediaUrl
      tagIds
      title
      user {
        id
        name
      }
    }
    
    totalPages
    totalPins
  }
}
`

export const GET_PIN_COMMENTS_QUERY = gql`
query($pinId: ID!, $page: Int) {
  getPinComments(pinId: $pinId, page: $page) {
    content
    id
    createdAt
    user {
      id
      avatar
      name
    }
  }
}
`