# Mdex Pool re-staking CLI

CLI to help you to handle the MDX token re-staking process on [Mdex](https://mdex.me)

## Getting Started

### Installing

* Clone the project.
* On UNIX, run ```chmod +x bin/defi``` inside the folder to allow permissions to the folder. If you're on Windows, do yourself a favor and use the Linux Subsystem.
* On the folder root run ```npm link``` to symlink the binary file to the system path.

## Usage

```
$ defi [ command ] {parameters}
```

You can add --help or -h to the end of your command to get a full explanation of the available options for the command.

## Configuration

First time running the CLI, it's a nice idea to create a new wallet and no re using an old one.

```
$ defi address --create
```

This will return an [HECO](https://m.hecochain.com/) address and private key. Copy, go to config.js file and paste there. 

Private key should be copied without the "0x".

## Disclaimer

🚨&nbsp;Storing private keys on any internet connected device is basically insecure. This is an educational project to learn how [ERC20](https://eips.ethereum.org/EIPS/eip-20) based blockchain contracts works.&nbsp;🚨

## Acknowledgments

* [Node-CLI-Tutorial](https://timber.io/blog/creating-a-real-world-cli-app-with-node/)
* [Web3](https://web3js.readthedocs.io/en/v1.3.4/)
* [ORA](https://github.com/sindresorhus/ora)
