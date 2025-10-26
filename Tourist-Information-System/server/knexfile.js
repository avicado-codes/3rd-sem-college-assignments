module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: '../data/tis.db'
    },
    useNullAsDefault: true,
    migrations: {
        directory: './db/migrations'
    }
  }
};