const fs = require('fs');

const checkProjectName = (name) => {
  return /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/.test(name);
};

const checkProjectDir = (dir) => {
  return fs.existsSync(dir);
};

module.exports = {
  checkProjectName,
  checkProjectDir,
};
