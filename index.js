const { ApolloServer, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const typeDefs = require("./src/schema");
const resolvers = require("./src/resolvers");
const connectDb = require("./src/config/db");
require("dotenv").config({ path: ".env" });

//Connect db mongoDb
connectDb();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    //Context configurations user global data
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.SECRET
        );
        return {
          user,
        };
      } catch (error) {
        console.log("error context jwt", error);
      }
    }
  },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log("Server running ", url);
});
