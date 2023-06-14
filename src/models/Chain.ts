export type Chain = {
    chainId: string;
    name: string;
    blockExplorerUrl: string;
    rpcUrl: string;
  };
  
export const goerli: Chain = {
    chainId: '5',
    name: 'Goerli',
    blockExplorerUrl: 'https://goerli.etherscan.io',
    rpcUrl: 'https://goerli.infura.io/v3/5da76a026f2b4c0486b051ff6cd7b6c9',
};

export const mainnet: Chain = {
    chainId: '1',
    name: 'Ethereum',
    blockExplorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://mainnet.infura.io/v3/5da76a026f2b4c0486b051ff6cd7b6c9',
};

export const CHAINS_CONFIG = {
    [goerli.chainId]: goerli,
    [mainnet.chainId]: mainnet,
};