const Tx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common").default;
const Web3 = require("web3");

const { rpcURL, mdxPoolContract, chainId, wallet } = require("../config");

const ABI = [
  {
    inputs: [
      { internalType: "address", name: "_mdx", type: "address" },
      { internalType: "uint256", name: "_cycle", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EmergencyWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      {
        internalType: "contract IERC20",
        name: "_lpToken",
        type: "address",
      },
      { internalType: "bool", name: "_withUpdate", type: "bool" },
    ],
    name: "add",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cycle",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "endBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "massUpdatePools",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mdx",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mdxPerBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_mdxAmount", type: "uint256" },
      { internalType: "uint256", name: "_newPerBlock", type: "uint256" },
      { internalType: "uint256", name: "_startBlock", type: "uint256" },
    ],
    name: "newAirdrop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "pending",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "poolInfo",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "lpToken",
        type: "address",
      },
      { internalType: "uint256", name: "allocPoint", type: "uint256" },
      {
        internalType: "uint256",
        name: "lastRewardBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "accMDXPerShare",
        type: "uint256",
      },
      { internalType: "uint256", name: "mdxAmount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      { internalType: "bool", name: "_withUpdate", type: "bool" },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_newCycle", type: "uint256" }],
    name: "setCycle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAllocPoint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
    name: "updatePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "userInfo",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "rewardDebt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const HECO_MAIN = Common.forCustomChain(
  "mainnet",
  {
    name: "hecochain",
    networkId: 128,
    chainId: 128,
  },
  "petersburg"
);

const getMdxPendingReward = async () => {
  const web3 = new Web3(rpcURL);
  const { pending } = new web3.eth.Contract(ABI, mdxPoolContract).methods;
  const pendingReward = await pending(0, wallet.address).call();
  return pendingReward;
};

const getMdxInPool = async () => {
  const web3 = new Web3(rpcURL);
  const { userInfo } = new web3.eth.Contract(ABI, mdxPoolContract).methods;
  const mdxInpool = await userInfo(0, wallet.address).call();
  return mdxInpool.amount;
};

const sendTokenOperation = async ({ amount, type }) => {
  const web3 = new Web3(rpcURL);
  const contract = new web3.eth.Contract(ABI, mdxPoolContract);
  const { toHex, toWei } = web3.utils;

  const privateKey = Buffer.from(wallet.privateKey, "hex");

  let nonce = await web3.eth.getTransactionCount(wallet.address);
  let gasPrice = await web3.eth.getGasPrice();

  const data =
    type === "deposit"
      ? contract.methods.deposit(0, amount).encodeABI()
      : contract.methods.withdraw(0, amount).encodeABI();

  const multiplier = 2;

  let txObject = {
    from: wallet.address,
    nonce: toHex(nonce),
    to: mdxPoolContract,
    value: toHex(toWei("0", "ether")),
    gasPrice: toHex(gasPrice),
    data,
    chainId,
  };

  const gasLimit = Math.floor(
    (await web3.eth.estimateGas(txObject)) * multiplier
  );

  txObject.gasLimit = toHex(gasLimit);

  const tx = new Tx(txObject, { common: HECO_MAIN });
  tx.sign(privateKey);

  const serializedTx = tx.serialize();
  const raw = "0x" + serializedTx.toString("hex");

  const receiptObject = await web3.eth.sendSignedTransaction(raw);
  return receiptObject;
};

exports.getMdxPendingReward = getMdxPendingReward;
exports.getMdxInPool = getMdxInPool;
exports.sendTokenOperation = sendTokenOperation;
