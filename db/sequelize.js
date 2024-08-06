import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'postgres',
  username: 'olha',
  database: 'db_contacts_8mv0',
  password: '5PReaJ40QItIdm3f1AjrrNy6YTCt00hR',
  host: 'dpg-cqoa2gdds78s73btb4e0-a.frankfurt-postgres.render.com',
  port: '5432',
  dialectOptions: {
    ssl: true,
  },
});

export default sequelize;
