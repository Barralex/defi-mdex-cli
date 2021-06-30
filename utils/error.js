const { print } = require("./console-colors");

module.exports = (message, type, exit) => {
  print(type, message);
  exit && process.exit(1);
};
