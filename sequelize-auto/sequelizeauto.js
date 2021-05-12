const { has, get, merge, pick, isNil } = require('lodash');
const SequelizeAuto = require('sequelize-auto');
const ENV = process.env.NODE_ENV || 'development';
const program = require('commander');
const options = program
  .option('-e, --env', 'env variable.')
  .option('-s, --sync', 'sync')
  .parse(process.argv)
  .opts();

const config = require('./database/config.json');
if (!has(config, ENV)) {
  console.error('env set is wrong.');
  process.exit(0);
}

const sequelizeConfig = get(config, ENV);
const auto = new SequelizeAuto(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, merge(
  {
    caseFile: 'c',
    caseModel: 'c',
    additional: {
      timestamps: false
    },
    directorys: config.directorys || './models',
    lang: 'ts'
  },
  pick(sequelizeConfig, ['host', 'dialect', 'port']))
);

// process args control to run sequelize-auto sync
if (!isNil(options.sync)) auto.run();

// export for program invoke
module.export = () => {
  auto.run();
  return auto;
};
