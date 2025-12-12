const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

// Koneksi ke Database (DB berbeda sesuai syarat)
mongoose.connect('mongodb://mongo:27017/task_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema GraphQL
const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    deadline: String!
    courseName: String
  }
  type Query {
    getTasks: [Task]
  }
  type Mutation {
    addTask(title: String!, deadline: String!, courseName: String!): Task
    deleteTask(id: ID!): String
  }
`;

const Task = mongoose.model('Task', { title: String, deadline: String, courseName: String });

const resolvers = {
  Query: {
    getTasks: async () => await Task.find(),
  },
  Mutation: {
    addTask: async (_, { title, deadline, courseName }) => {
      const task = new Task({ title, deadline, courseName });
      await task.save();
      return task;
    },
    // TAMBAHAN: Resolver Delete
    deleteTask: async (_, { id }) => {
      await Task.findByIdAndDelete(id);
      return "Tugas berhasil dihapus";
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Task Service ready at ${url}`);
});