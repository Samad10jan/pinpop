import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import typeDefs from "@/lib/gql/typeDefs/typeDefs";
import resolvers from "@/lib/gql/resolvers/auth";
import { context } from "@/utils/helper/context";

// const resolvers = {
//     Query: {
//         hello: () => "Hello world!"
       
//     },
    
// };

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
// });

// const handler = startServerAndCreateNextHandler<NextRequest>(server, {
//     context: async req => ({ req }),
// });

// export { handler as GET, handler as POST };

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const handler = startServerAndCreateNextHandler(server,{
  context
});

export { handler as GET, handler as POST };