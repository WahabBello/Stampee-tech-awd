import { testConnection } from './db/db';

testConnection().then((success) => {
  if (success) {
    console.log('Database is ready!');
    process.exit(0);
  } else {
    console.error('Database connection failed');
    process.exit(1);
  }
});