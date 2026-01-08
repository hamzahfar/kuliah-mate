const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/schedule_db', { useNewUrlParser: true, useUnifiedTopology: true });

// DEFINE MODEL - Bagian ini yang sebelumnya hilang
const Course = mongoose.model('Course', { 
  name: String, 
  day: String, 
  time: String, 
  userId: String 
});

const typeDefs = gql`
  type Course { id: ID!, name: String!, day: String!, time: String!, userId: String }
  type Query { getCourses(userId: String!): [Course] }
  type Mutation {
    addCourse(name: String!, day: String!, time: String!, userId: String!): Course
    updateCourse(id: ID!, name: String!, day: String!, time: String!): Course
    deleteCourse(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    getCourses: async (_, { userId }) => await Course.find({ userId }),
  },
  Mutation: {
    addCourse: async (_, { name, day, time, userId }) => {
      const course = new Course({ name, day, time, userId });
      await course.save();
      return course;
    },
    updateCourse: async (_, { id, name, day, time }) => {
      return await Course.findByIdAndUpdate(id, { name, day, time }, { new: true });
    },
    deleteCourse: async (_, { id }) => {
      await Course.findByIdAndDelete(id);
      return "Jadwal berhasil dihapus";
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Schedule Service ready at ${url}`);
});