const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);

const routes = {
  setup: (app) => {
    const rootPaths = fs.readdirSync(`${__dirname}/`).filter((file) => file !== basename);

    rootPaths.forEach((folderPath) => {
      const paths = fs.readdirSync(`${__dirname}/${folderPath}`)
        .filter((file) => file.slice(-3) === '.js' && file !== basename);
      paths.forEach((file) => {
        const filePath = `${__dirname}/${folderPath}/${file}`;
        const router = require(filePath);
        const apiName = file.split('.')[0];
        app.use(`/${folderPath}/${apiName}`, router);
      });
    });
  },
};

module.exports = routes;
