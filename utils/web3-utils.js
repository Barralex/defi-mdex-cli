const Web3 = require("web3");
const { print } = require("../utils/console-colors");

const { rpcURL, mdxPoolContract, chainId } = require("../config");

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const isTransactionConfirmed = async ({ txHash, waitingTime }) => {
  await sleep(waitingTime);
  const result = Web3.eth.getTransactionReceipt(txHash);
  if (!result) {
    return false;
  }
  return result.status;
};

const createAccount = async () => {
  const web3 = new Web3(rpcURL);
  const addressInformation = web3.eth.accounts.create();
  return addressInformation;
};

const getHTBalance = async (address) => {
  const web3 = new Web3(rpcURL);
  const currentHTBalance = await web3.eth.getBalance(address);
  return currentHTBalance;
};

exports.isTransactionConfirmed = isTransactionConfirmed;
exports.createAccount = createAccount;
exports.getHTBalance = getHTBalance;
