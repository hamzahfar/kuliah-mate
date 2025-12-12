const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

// Koneksi ke Database (MongoDB)
mongoose.connect('mongodb://mongo:27017/schedule_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema GraphQL
const typeDefs = gql`
  type Course {
    id: ID!
    name: String!
    day: String!
    time: String!
  }
  type Query {
    getCourses: [Course]
  }
  type Mutation {
    addCourse(name: String!, day: String!, time: String!): Course
    deleteCourse(id: ID!): String
  }
`;

// Model Database
const Course = mongoose.model('Course', { name: String, day: String, time: String });

// Resolvers
const resolvers = {
  Query: {
    getCourses: async () => await Course.find(),
  },
  Mutation: {
    addCourse: async (_, { name, day, time }) => {
      const course = new Course({ name, day, time });
      await course.save();
      return course;
    },
    // TAMBAHAN: Resolver Delete
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