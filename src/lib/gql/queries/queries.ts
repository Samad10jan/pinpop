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
      # createdAt
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
    isFollowing
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
      # createdAt
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



export const SUGG_QUERY = gql`
query($search: String!) {
  getSugg(search: $search)
}`


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
        avatar
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
    isFollowing

    pin {
      isSaved
       isLiked
      mediaUrl
      tagIds
      description
      createdAt
      fileType
      publicId
      id
      title
      user {
        avatar
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
      publicId
      fileType
      user {
        id
        name
        avatar
      }
    }
  }
}

`

export const FEED_QUERY = gql`
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
      publicId
      user {
        id
        name
        avatar
      }
    }
     hasNextPage
    hasPrevPage
    limit
    page
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



export const GET_SAVED_PINS_QUERY = gql`
query ($limit: Int, $page: Int) {
  getSavedPins(limit: $limit, page: $page) {
    pins {
      id
      title
      description
      mediaUrl
      fileType
      publicId
      isSaved
      createdAt

      user {
        id
        name
        avatar
      }
    }

    page
    limit
    totalPins
    totalPages
    hasNextPage
    hasPrevPage
  }
}
`;


export const GET_CURRENT_USER_ALL_PINS_QUERY = gql`
query{
  getCurrentUserPins {
    pins {
      id
      title
      description
      mediaUrl
      fileType
      tagIds
     publicId
      createdAt
      likesCount
      savesCount
      commentsCount
      engagementScore
      
    }
    totalPins
    totalLikes
    totalSaves
    totalComments
    followersCount
    followingCount
    avgEngagementPerPin
    topPins {
      id
      title
      description
      mediaUrl
      fileType
      tagIds
      publicId
      createdAt
      likesCount
      savesCount
      commentsCount
      engagementScore
    }
  }
}`

export const GET_A_USER_ALL_PINS_QUERY = gql`

query ($userId: ID!) {
  getUserAllPins(userId: $userId) {
    pins {
      createdAt
      fileType
      id
      isSaved
      mediaUrl
      title
      publicId
      user {
        id
        name
        avatar
      }
    }
    hasNextPage
    hasPrevPage
    limit
    page
    totalPages
    totalPins
  }
}`

export const GET_PINS_BY_TAG_QUERY = gql`
query ($tagId: ID!) {
  getPinsByTag(tagId: $tagId) {
    pins {
      id
      title
      description
      mediaUrl
      fileType
      tagIds
      createdAt
      user {
        avatar
        name
        id
      }
      isSaved
    }
    page
    limit
    totalPins
    totalPages
    hasNextPage
    hasPrevPage
  }
}`
