import Web3 from "web3";
export const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

// interacting with the smart contract
export const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "addTransaction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "transactionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "transactions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const address = "0x0920650607B43Cd055d0d605055Ab6C4a1864828";

// create a new contract object, providing the ABI and address
export const contract = new web3.eth.Contract(abi, address);

web3.eth.defaultAccount = web3.currentProvider.selectedAddress;

// using contract.methods to get value
export function clcik(defaultAccount, amount, callback){
		alert(defaultAccount);
		contract.methods.addTransaction(defaultAccount, amount )
			.send({ from: defaultAccount, gas: 124644, gasPrice: '20000000'}, (error, transactionHash) => {
				if (error) {
					alert(error);
					return;
			}
		callback(transactionHash)
		alert("Transaction Successful",transactionHash);
	});

}