const { gql } = require("apollo-server");

const typeDefs = gql`
  #Types definitions auth
  type Token {
    token: String
  }
  #Types definitions project

  type Project {
    name: String!
    id: ID
  }
  type Task {
    name: String
    id: ID
    project: String
    status: Boolean
  }
  type User {
    name: String
    email: String
    exp: String
  }

  #Query
  type Query {
    getProjects: [Project]
    getTask(input: ProjectIDInput): [Task]
    getUser(input: InputToken): User
  }

  #Inputs auth
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  input InputToken {
    token: String!
  }
  input authUser {
    email: String!
    password: String!
  }

  #Inputs projects
  input ProjectIDInput {
    project: String!
  }
  input ProjectInput {
    name: String!
  }
  #Inputs task

  input TaskInput {
    name: String!
    project: String
  }

  type Mutation {
    #User
    createUser(input: UserInput): Token
    authUser(input: authUser): Token

    #Project
    newProject(input: ProjectInput): Project
    updateProject(id: ID!, input: ProjectInput): Project
    deleteProject(id: ID!): String

    #Task
    newTask(input: TaskInput): Task
    updateTask(id: ID!, input: TaskInput, status: Boolean): Task
    deleteTask(id: ID!): String
  }
`;

module.exports = typeDefs;
