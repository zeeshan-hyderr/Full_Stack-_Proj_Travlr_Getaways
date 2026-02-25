const mongoose = require('mongoose');
const readLine = require('readline');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}:27017/travlr`;

const connect = async () => {
  try {
    await mongoose.connect(dbURI, { autoIndex: true });
    console.log(`Mongoose connected to ${dbURI}`);
  } catch (err) {
    console.error('Mongoose connection error:', err);
  }
};

mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Windows SIGINT fix
if (process.platform === 'win32') {
  const rl = readLine.createInterface({ input: process.stdin, output: process.stdout });
  rl.on('SIGINT', () => process.emit("SIGINT"));
}

const gracefulShutdown = msg => {
  mongoose.connection.close(() => console.log(`Mongoose disconnected through ${msg}`));
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});
process.on('SIGINT', () => {
  gracefulShutdown('app termination');
  process.exit(0);
});
process.on('SIGTERM', () => {
  gracefulShutdown('app shutdown');
  process.exit(0);
});

// connect
connect();

// load models
require('./travlr');

module.exports = mongoose;
