const { print } = require("../utils/console-colors");
const menus = {
  main: `
      defi [command] <options>
  
      address ............... Set of functions to handle your HECO Address
      pool    ............... Set of functions to handle your Mdex MDX pool
      help    ............... show help menu for a command`,

  address: `
      defi address <options>
  
      --create, -c                                      ..... Create a new address
      --balance <token> [MDX, HT], -b <token> [MDX, HT] ..... Get the balance of the selected token on HECO blockchain
      --approve, -a                                     ..... Perform an approval operation from your address to MDX Token`,

  pool: `
      defi pool <options>
  
      --deposit <amount>, -d <amount>      ............... Deposit MDX token into pool
      --withdraw <amount>, -w  <amount>    ............... Withdraw MDX from pool
      --analytics, -a                      ............... Get MDX total staked and pending rewards
      --reinvest, -r                       ............... Perform withdraw and deposit events`,
};

module.exports = (args) => {
  const subCmd = args._[0] === "help" ? args._[1] : args._[0];

  print("info", menus[subCmd] || menus.main);
};
