const rpcURL = "https://http-mainnet.hecochain.com";
const mdxPoolContract = "0x19D054836192200c71EEc12Bc9f255b1faE8eE80";
const mdxTokenContract = "0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c";
const chainId = 128;
const defaultWaitingTime = 10000;
const wallet = {
  address: "",
  privateKey:
    "",
};
const telegramConfig = {
  active: false,
  token: "",
  chatId: ,
};

module.exports = {
  rpcURL,
  mdxPoolContract,
  mdxTokenContract,
  chainId,
  defaultWaitingTime,
  wallet,
  telegramConfig,
};
