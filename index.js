const mdxToken = require("./contracts/mdx-token-contract");
const mdxPool = require("./contracts/mdx-pool-contract");
const { isTransactionConfirmed } = require("./utils/web3-utils");
const { defaultWaitingTime } = require("./config");

const Web3 = require("web3");
const Web3Accounts = require("web3-eth-accounts");
const minimist = require("minimist");
const { print } = require("./utils/console-colors");

const error = require("./utils/error");

module.exports = async () => {
  const args = minimist(process.argv.slice(2));

  let cmd = args._[0] || "help";

  if (args.help || args.h) {
    cmd = "help";
  }

  switch (cmd) {
    case "address":
      require("./cmds/address")(args);
      break;

    case "pool":
      require("./cmds/pool")(args);
      break;

    case "help":
      require("./cmds/help")(args);
      break;

    default:
      error(`🚨 ${cmd}" is not a valid command!`, "danger", true);
      break;
  }
};
