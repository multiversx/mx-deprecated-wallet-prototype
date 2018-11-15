# Elrond Wallet (UI-Prototype)
Simple Setup-Wizzard for Elrond Prototype, Wallet and Protocol Banchmarking

![elrond-core-PoC1](https://cdn-images-1.medium.com/max/2000/1*CJd6EpaGPJH8T4tFEZesgg.jpeg)

# Introduction
This readme will give some insight into the code, architecture and several
concepts used in this prototype.

Elrond Prototype overview - [Progress update #2 - Medium](https://medium.com/elrondnetwork/elrond-prototype-progress-update-2-44202c3c2ef2)

# Table of Contents

-   [Design goal](#design-goal)
-   [What to expect](#what-to-expect)
    - [Node](#node)
    - [Wallet](#wallet)
    - [Stats](#stats)
-   [Getting Started](#getting-started-with-elrond-wallet)
    - [Components](#components)
    - [Dependencies](#dependencies)
    - [Build for development](#build-for-development)
    - [Build for production](#build-for-production)
    - [Code scaffolding](#code-scaffolding)
-   [Troubleshooting](#troubleshooting)

## Design goal
The purpose of this project is to implement a simple and friendly user-interface providing a new experience for testing purposes, connecting to the [Elrond-Prototype](https://github.com/ElrondNetwork/elrond-core) and providing out of the box 1-click application integrating the the prototype as a JVM cross-platform operating tool.

## What to expect
This is a new, well-functioning user interface, Elrond Wallet bundles the following app sections:

#### Node
Features an intuitive configuration section, pre-populated with default values for a smooth progress. It has four guided steps:

Intro screen — basic information and guidelines
Instance setup — establishes the connection parameters between the current node and the network of peers with the ability to test every scenario before starting the node
Keys — covers the key generation process for private and public keys and the initial shard allocation. A new set of keys can be generated, or the user can use an existing valid private key (previously saved)
Summary — presents an overview over all the configuration parameters and starts the node

#### Wallet
This section represents a wallet with the following features:

- displays the balance and the allocated shard for the account address
- allows the user to perform intra-shard and cross-shard transactions between addresses
- acts as a blockchain explorer, verifying balances for any account on the blockchain
- displays a history of the recent transactions performed by the current address


#### Stats
Because tech people like to see under-the-hood details, the statistical sections offers a good perspective:

Live and history values for the entire network and individual details for each active shard, showing information like: active number of nodes, peek and live transactions/second, average transactions per block, total number of transactions, round time
Experimental benchmark feature that allows the early users of the prototype to test the capabilities of the network while triggering thousands of transactions into single and mutiple shards at the same time.
Interactive throughput chart with live data and recent history on the network load, displayed for each active shard at a global level


# Getting Started with Elrond Wallet

### Components
Elrond Wallet is build with Angular & Electron

### Dependencies

`npm install`

`npm install -g @angular/cli`


#### Build for development

`npm start`

`npm run ng:serve`  Execute the app in the browser

`npm run build`	Build the app. Your built files are in the /dist folder.


#### Build for production

`npm run build:prod`	Build the app with Angular aot. Your built files are in the /dist folder.

`npm run electron:local`	Builds your application and start electron

`npm run electron:linux`	Builds your application and creates an app consumable on linux system

`npm run electron:windows`	On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems

`npm run electron:mac`	On a MAC OS, builds your application and generates a .app file of your application that can be run on Mac

`npm run buildng`  Builds the Angular app. Your built files are in the /dist folder.  


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.


# Troubleshooting

On Ubuntu, in case of node js ENOSPC error, run the command:

`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
