import { gql } from "graphql-request";

export const SIGN_UP = gql`
mutation Mutation($name: String!, $email: String!, $password: String!, $avatar: String, $otp: String!) {
  signup(name: $name, email: $email, password: $password, avatar: $avatar,otp: $otp) {
    user {
      email
      id
      name
      avatar
    }
  }
}`

export const SEND_SIGNUP_OTP = gql`
mutation ($email: String!) {
  sendSignupOtp(email: $email) {
    message
  }
}
`

export const LOGIN = gql`
mutation Mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      name
      email
      avatar
      uploadCount
      # createdAt
    }
  }
}`

export const LOGOUT = gql`
mutation {
  logout {
    success
  }
}`

export const CREATE_COMMENT = gql`
mutation Mutation($pinId: ID!, $content: String!) {
  sendComment(pinId: $pinId, content: $content) {
    content
    id
    createdAt
    user {
      avatar
      id
      name
    }
  }
}
`
export const DELETE_COMMENT = gql`
mutation ($commentId: ID!) {
  deleteComment(commentId: $commentId) {
    success
  }
}`

export const UPDATE_PROFILE = gql`

mutation ($name: String, $avatar: String) {
  updateProfile(name: $name, avatar: $avatar) {
    name
    uploadCount
    createdAt
    avatar
    email
    id
  }
}`

export const TOGGLE_FOLLOW = gql`
  mutation ToggleFollow($targetUserId: ID!) {
    toggleFollow(targetUserId: $targetUserId) {
      success
    }
  }
`;

export const CREATE_PIN_MUTATION = gql`
mutation(
  $title: String!
  $description: String
  $mediaUrl: String!
  $publicId: String!
  $resourceType: ResourceType!
  $fileType: FileType!
  $tagIds: [String!]!
) {
  createPin(
    title: $title
    description: $description
    mediaUrl: $mediaUrl
    publicId: $publicId
    resourceType: $resourceType
    fileType: $fileType
    tagIds: $tagIds
  ) {
    id
    createdAt
    title
    description
    mediaUrl
    publicId
    resourceType
    fileType
    tagIds
  }
}
`;