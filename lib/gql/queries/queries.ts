import { gql } from "graphql-request";

export const PROFILE_QUERY = gql`
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
  }
}
`;

export const GET_TAGS_QUERY = gql`
query {
  getTags {
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

export const SEARCH_PAGE_PINS_QUERY = gql`
query($search: String!) {
  getSearchPagePins(search: $search) {
    fileType
    id
    createdAt
    mediaUrl
    title
  }
}`

export const PIN_PAGE_QUERY = gql`

query($getPinResponseId: ID!) {
  getPinResponse(id: $getPinResponseId) {
    followersCount
    pin {
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
      likesCount
      savesCount
      # comments {
      #   createdAt
      #   id
      #   user {
      #     avatar
      #     name
      #   }
      #   content
      # }
    }
    relatedPins {
      createdAt
      mediaUrl
      title
      id
      fileType
    }
  }
}
`

export const GET_PIN_COMMENTS_QUERY=gql`
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