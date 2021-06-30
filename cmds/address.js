const Web3 = require("web3");
const ora = require("ora");
const { wallet } = require("../config");
const error = require("../utils/error");
const { print } = require("../utils/console-colors");
const {
  getBalance,
  tokenApproval,
  isAllowanceGreaterThan0,
} = require("../contracts/mdx-token-contract");

const { createAccount, getHTBalance } = require("../utils/web3-utils");

const create = async () => {
  const newWallet = await createAccount();
  print("success", "Please keep this private key safe");
  print("success", `-> Address: ${newWallet.address}`);
  print("success", `-> Private Key: ${newWallet.privateKey}`);
};

const balance = async (token = "") => {
  let currentBalance = "";

  const spinner = ora().start();

  switch (token.toLowerCase()) {
    case "mdx":
      currentBalance = await getBalance(wallet.address);
      break;
    case "ht":
      currentBalance = await getHTBalance(wallet.address);
      break;
    default:
      spinner.stop();
      print("danger", `🚨 Unsupported token!`);
      return;
  }

  spinner.stop();
  print("success", `${Web3.utils.fromWei(currentBalance, "ether")} ${token}`);
};

const approve = async () => {
  let result = "";

  const spinner = ora().start();

  if (await isAllowanceGreaterThan0()) {
    result = "This address is already approved on MDX token";
  } else {
    const txHash = await tokenApproval();
    result = `Approval transaction sended. Please check ${txHash}`;
  }
  spinner.stop();
  print("success", `${result}`);
};

module.exports = async (args) => {
  let cmd = "";

  if (args.create || args.c) {
    cmd = "create";
  }

  if (args.balance || args.b) {
    cmd = "balance";
  }

  if (args.approve || args.a) {
    cmd = "approve";
  }

  try {
    switch (cmd) {
      case "create":
        await create();
        break;

      case "balance":
        await balance(args.balance || args.b);
        break;

      case "approve":
        await approve();
        break;
      default:
        print("danger", `🚨 Not a valid command!`);
        break;
    }
  } catch (e) {
    error(`An error has ocurred: ${e.message}`, "danger", true);
  }
};
