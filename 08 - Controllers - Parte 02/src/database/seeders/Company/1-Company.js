// módulo para criptografar a senha
const bcrypt = require('bcryptjs');

module.exports = {
  cnpj: 12345678,
  corporate_name: 'administrator',
  name: 'administrator',
  email: 'administrator@administrator.com',
  password_hash: bcrypt.hashSync('admin', 8),
  address: {
    street: 'not found',
    zip_code: 123456,
    city: 'Santa Maria',
    state: 'RS',
  },
  telephone: {
    commercial_phone: 12456789,
    cell_phone: 123456789,
  },
  admin: true,
  active: true,
};

// https://github.com/pkosiec/mongo-seeding/tree/master/cli
// npm install -g mongo-seeding-cli
// criar a pasta e configurar os dados de inserção
// seed -u 'mongodb://127.0.0.1:27017/tech_announcement' --drop-database ./src/database/seeders
