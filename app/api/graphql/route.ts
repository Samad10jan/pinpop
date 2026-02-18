import { login, signup } from "@/lib/gql/resolvers/auth.resolver";
import { deleteComment, getPinComments, sendComment } from "@/lib/gql/resolvers/comments.resolver";
import { createPin, getCurrentUserPinResponse, getPinPageResponse, getSearchPagePins, getSugg, getTagsForPin, getUserFeed } from "@/lib/gql/resolvers/pin.resolver";
import { getAllTags, getSavedPins, toggleFollow, toggleLike, toggleSave } from "@/lib/gql/resolvers/toggles.resolver";
import { getCurrentProfile, getFollowingCount, getFollwersCount, getProfile, getTotalLikes, isFollowing, updateProfile, user } from "@/lib/gql/resolvers/user.resolver";

import typeDefs from "@/lib/gql/typeDefs/typeDefs";
import { context } from "@/utils/helper/context";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";


export const resolvers = {
  Query: {
    user: user,

    getCurrentProfile: getCurrentProfile,

    getProfile: getProfile,

    getAllTags: getAllTags,

    getUserFeed: getUserFeed,

    getSugg: getSugg,

    getSearchPagePins: getSearchPagePins,

    getPinPageResponse: getPinPageResponse,

    getPinComments: getPinComments,

    getSavedPins: getSavedPins,
    getCurrentUserPinResponse:getCurrentUserPinResponse
    
    // isFollowing:isFollowing
  },
  ProfileResponse: {
    followersCount: getFollwersCount,
    followingCount: getFollowingCount,
    totalLikes: getTotalLikes,
    isFollowing:isFollowing
  },
  PinPageResponse: {
    tags: getTagsForPin
  },

  Mutation: {

    signup: signup,
    login: login,

    createPin: createPin,
    sendComment: sendComment,
    toggleSave: toggleSave,
    toggleLike: toggleLike,
    deleteComment: deleteComment,
    updateProfile:updateProfile,
    toggleFollow: toggleFollow,
    
    // addTags:addTags
  }

};



const server = new ApolloServer({
  typeDefs,
  resolvers
});

const handler = startServerAndCreateNextHandler(server, {
  context
});

export { handler as GET, handler as POST };
