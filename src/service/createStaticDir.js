const fs = require("fs/promises");

const createStaticDir = async (staticDir) => {
  try {
    await fs.access(staticDir);
    await fs.access(`${staticDir}/photos`);
  } catch (error) {
    await fs.mkdir(staticDir);
    await fs.mkdir(`${staticDir}/photos`);
  }
};

module.exports = createStaticDir;
