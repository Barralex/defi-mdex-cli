const ora = require("ora");
const Web3 = require("web3");
const { wallet, defaultWaitingTime } = require("../config");
const error = require("../utils/error");
const { print } = require("../utils/console-colors");

const { getBalance } = require("../contracts/mdx-token-contract");
const { sendTokenOperation } = require("../contracts/mdx-pool-contract");

const {
  getMdxPendingReward,
  getMdxInPool,
} = require("../contracts/mdx-pool-contract");

const { getHTBalance, isTransactionConfirmed } = require("../utils/web3-utils");

const deposit = async () => {
  const spinner = ora("Getting MDX Balance").start();

  const currentMdxBalance = await getBalance();

  if (currentMdxBalance > 0) {
    spinner.text = `Depositing ${Web3.utils.fromWei(
      currentMdxBalance,
      "ether"
    )} MDX`;

    let txHash = await sendTokenOperation({
      amount: currentMdxBalance,
      type: "deposit",
    });

    spinner.stop();

    await confirmTxHash(txHash);
  } else {
    spinner.stop();
    print("danger", "🚨 MDX balance in your address must be greather than 0");
  }
};

const analytics = async () => {
  const spinner = ora("Getting pool analytics").start();

  const mdxPendingRewards = await getMdxPendingReward();
  const mdxInPool = await getMdxInPool();

  spinner.stop();

  print(
    "success",
    `Pending rewards: ${Web3.utils.fromWei(mdxPendingRewards, "ether")} MDX`
  );
  print("success", `MDX staked: ${Web3.utils.fromWei(mdxInPool, "ether")} MDX`);
};

const withdraw = async () => {
  const spinner = ora("Getting pool MDX pending rewards").start();

  const mdxPendingRewards = await getMdxPendingReward();
  const rewardsToEther = Web3.utils.fromWei(mdxPendingRewards, "ether");

  if (!(rewardsToEther > 0.001)) {
    spinner.stop();
    print("danger", `The MDX rewards are too low!`);
    return;
  }

  spinner.text = `Withdrawing ${rewardsToEther} MDX`;

  let txHash = await sendTokenOperation({
    amount: mdxPendingRewards,
    type: "withdraw",
  });

  await confirmTxHash(txHash);
};

const confirmTxHash = async (txHash) => {
  const spinner = ora(`Confirming TxHash ${txHash}`).start();

  const status = await isTransactionConfirmed({
    txHash: txHash,
    waitingTime: defaultWaitingTime,
  });

  spinner.stop();

  if (status) {
    print("success", `      Tx status: ✅ https://hecoinfo.com/tx/${txHash}`);
  } else {
    print(
      "danger",
      `      Tx status: ❌ https://hecoinfo.com/tx/${txHash} . Check Tx to see the issue.`
    );
  }
};

const validateConfig = () => {
  return (
    wallet.address !== "" &&
    wallet.privateKey !== "" &&
    wallet.privateKey.substr(0, 2) !== "0x"
  );
};

module.exports = async (args) => {
  let cmd = "";

  if (args.deposit || args.d) {
    cmd = "deposit";
  }

  if (args.withdraw || args.w) {
    cmd = "withdraw";
  }

  if (args.analytics || args.a) {
    cmd = "analytics";
  }

  if (!validateConfig()) {
    print(
      "danger",
      `🚨 Config an HECO address first on config file or remove the 0x part on private key`
    );
    return;
  }

  try {
    switch (cmd) {
      case "deposit":
        await deposit();
        break;

      case "analytics":
        await analytics();
        break;

      case "withdraw":
        await withdraw();
        break;

      default:
        print("danger", `🚨 Not a valid command!`);
        break;
    }
  } catch (e) {
    error(`An error has ocurred: ${e.message}`, "danger", true);
  }
};
