const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/task_db', { useNewUrlParser: true, useUnifiedTopology: true });

// DEFINE MODEL - Bagian ini yang sebelumnya hilang
const Task = mongoose.model('Task', { 
  title: String, 
  deadline: String, 
  courseName: String, 
  userId: String 
});

const typeDefs = gql`
  type Task { id: ID!, title: String!, deadline: String!, courseName: String, userId: String }
  type Query { getTasks(userId: String!): [Task] }
  type Mutation {
    addTask(title: String!, deadline: String!, courseName: String!, userId: String!): Task
    updateTask(id: ID!, title: String!, deadline: String!, courseName: String!): Task
    deleteTask(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    getTasks: async (_, { userId }) => await Task.find({ userId }),
  },
  Mutation: {
    addTask: async (_, { title, deadline, courseName, userId }) => {
      const task = new Task({ title, deadline, courseName, userId });
      await task.save();
      return task;
    },
    updateTask: async (_, { id, title, deadline, courseName }) => {
      return await Task.findByIdAndUpdate(id, { title, deadline, courseName }, { new: true });
    },
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