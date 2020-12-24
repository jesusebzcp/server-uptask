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
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET);
        return {
          user,
        };
      } catch (error) {
        console.log(error);
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log("Server running ", url);
});
