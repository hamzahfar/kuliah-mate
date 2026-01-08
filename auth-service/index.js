const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'KULIAH_MATE_SECRET_KEY';

mongoose.connect('mongodb://mongo:27017/auth_db', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const User = mongoose.model('User', {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const typeDefs = gql`
  type User { id: ID!, username: String! }
  type AuthPayload { token: String!, user: User! }
  type Query { me: User }
  type Mutation {
    signup(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
  }
`;

const resolvers = {
  Mutation: {
    signup: async (_, { username, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
      return { token, user: { id: user.id, username: user.username } };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User tidak ditemukan');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Password salah');
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
      return { token, user: { id: user.id, username: user.username } };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🔐 Auth Service ready at ${url}`);
});