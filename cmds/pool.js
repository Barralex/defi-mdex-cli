const ora = require("ora");
const Web3 = require("web3");
const { wallet, defaultWaitingTime, telegramConfig } = require("../config");

const error = require("../utils/error");
const { print } = require("../utils/console-colors");

const { getBalance } = require("../contracts/mdx-token-contract");
const { sendTokenOperation } = require("../contracts/mdx-pool-contract");

const {
  getMdxPendingReward,
  getMdxInPool,
} = require("../contracts/mdx-pool-contract");

const { getHTBalance, isTransactionConfirmed } = require("../utils/web3-utils");

const { telegrambot, ACTIONS } = require("../utils/telegram-bot");

const deposit = async () => {
  const spinner = ora("Getting MDX Balance").start();

  const currentMdxBalance = await getBalance();
  const currentBalanceToEther = Number(Web3.utils.fromWei(currentMdxBalance, "ether")).toFixed(3);

  if (currentBalanceToEther >= 0.001) {
    spinner.text = `Depositing ${currentBalanceToEther} MDX`;

    let receiptObject = await sendTokenOperation({
      amount: currentMdxBalance,
      type: "deposit",
    });

    spinner.stop();

    print("subtitle", "      Deposit transaction sent.");
    confirmTxHash(receiptObject);

    if (telegramConfig.active) {
      const htBalance = await getHTBalance(wallet.address);

      await telegrambot(ACTIONS.DEPOSIT,
        `\n
<b>Amount</b>:  ${currentBalanceToEther} MDX
<b>Tx</b>: <a href="https://hecoinfo.com/tx/${receiptObject.transactionHash}">Heco explorer</a>
<b>Gas Left</b>:  ${Web3.utils.fromWei(htBalance, "ether")} HT`
      );
    }
  } else {
    spinner.stop();
    print("subtitle", `Found ${currentBalanceToEther} MDX.`);
    print(
      "danger",
      "🚨 MDX balance in your address must be greather than 0.001."
    );
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
  const rewardsToEther = Number(Web3.utils.fromWei(mdxPendingRewards, "ether")).toFixed(3);

  if (!(rewardsToEther >= 0.001)) {
    spinner.stop();
    print("subtitle", `Found ${rewardsToEther} MDX.`);
    print("danger", `🚨 Your rewards must be greather than 0.001`);
    return;
  }

  spinner.text = `Withdrawing ${rewardsToEther} MDX`;

  let receiptObject = await sendTokenOperation({
    amount: mdxPendingRewards,
    type: "withdraw",
  });

  spinner.stop();

  print("subtitle", "      Withdraw transaction sent.");

  confirmTxHash(receiptObject);

  if (telegramConfig.active) {
    const htBalance = await getHTBalance(wallet.address);

    await telegrambot(ACTIONS.WITHDRAW,
      `\n
<b>Amount</b>:  ${rewardsToEther} MDX
<b>Tx</b>: <a href="https://hecoinfo.com/tx/${receiptObject.transactionHash}">Heco explorer</a>
<b>Gas Left</b>:  ${Web3.utils.fromWei(htBalance, "ether")} HT`
    );
  }
};

const confirmTxHash = (receiptObject) => {
  if (receiptObject.status) {
    print(
      "subtitle",
      `      Tx status: ✅ https://hecoinfo.com/tx/${receiptObject.transactionHash}`
    );
  } else {
    print(
      "subtitle",
      `      Tx status: ❌ https://hecoinfo.com/tx/${receiptObject.transactionHash} . Check Tx to see the issue.`
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

const reinvest = async () => {
  await withdraw();
  await deposit();
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

  if (args.reinvest || args.r) {
    cmd = "reinvest";
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

      case "reinvest":
        await reinvest();
        break;

      default:
        print("danger", `🚨 Not a valid command!`);
        break;
    }
  } catch (e) {
    if (telegramConfig.active) await telegrambot(ACTIONS.ERROR,`\n
<b>Reason</b>:  ${e.message}`)
    error(`An error has ocurred: ${e.message}`, "danger", true);
  }
};
