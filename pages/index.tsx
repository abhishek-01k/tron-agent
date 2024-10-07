import React, { useState } from 'react';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import {
    WalletActionButton,
    WalletConnectButton,
    WalletDisconnectButton,
    WalletModalProvider,
    WalletSelectButton,
} from '@tronweb3/tronwallet-adapter-react-ui';
import toast from 'react-hot-toast';
import {
    Alert,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
import { tronWeb } from './api/tronweb';
import { Button } from '@tronweb3/tronwallet-adapter-react-ui';
const rows = [
    { name: 'Connect Button', reactUI: WalletConnectButton },
    { name: 'Disconnect Button', reactUI: WalletDisconnectButton },
    { name: 'Select Wallet Button', reactUI: WalletSelectButton },
    { name: 'Multi Action Button', reactUI: WalletActionButton },
];
export default function Home() {
    return (
        <div>
            <UIComponent></UIComponent>
            <Profile></Profile>
            <SignDemo></SignDemo>
        </div>
    );
}

function UIComponent() {
    return (
        <div>
            <h2>UI Component</h2>
            <TableContainer style={{ overflow: 'visible' }} component="div">
                <Table sx={{}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Component</TableCell>
                            <TableCell align="left">React UI</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">
                                    <row.reactUI></row.reactUI>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

function Profile() {
    const { address, connected, wallet } = useWallet();
    return (
        <div>
            <h2>Wallet Connection Info</h2>
            <p>
                <span>Connection Status:</span> {connected ? 'Connected' : 'Disconnected'}
            </p>
            <p>
                <span>Your selected Wallet:</span> {wallet?.adapter.name}
            </p>
            <p>
                <span>Your Address:</span> {address}
            </p>
        </div>
    );
}

function SignDemo() {
    const { signMessage, signTransaction, address } = useWallet();
    const [message, setMessage] = useState('');
    const [signedMessage, setSignedMessage] = useState('');
    // const receiver = 'TMDKznuDWaZwfZHcM61FVFstyYNmK6Njk1';
    const [receiver, setReceiver] = useState('');
    const [open, setOpen] = useState(false);

    async function onSignMessage() {
        const res = await signMessage(message);
        setSignedMessage(res);
    }

    console.log("address", address);

    async function onSignTransaction() {
        // Address of the sender, amount, receiver's address
        const transaction = await tronWeb.transactionBuilder.sendTrx(address, tronWeb.toSun(0.1), receiver);
        console.log(transaction);

        const signedTransaction = await signTransaction(transaction);
        // const signedTransaction = await tronWeb.trx.sign(transaction);
        const res = await tronWeb.trx.sendRawTransaction(signedTransaction);
        setOpen(true);
    }


    async function onSignTRC20Transaction() {
        const trc20ContractAddress = "TQQg4EL8o1BSeKJY4MJ8TB8XK7xufxFBvK";//contract address USDT

        // // Address of the sender, amount, receiver's address
        // const transaction = await tronWeb.transactionBuilder.sendTrx(address, tronWeb.toSun(0.1), receiver);
        // console.log(transaction);

        // const signedTransaction = await signTransaction(transaction);
        // // const signedTransaction = await tronWeb.trx.sign(transaction);
        // const res = await tronWeb.trx.sendRawTransaction(signedTransaction);
        // setOpen(true);

        try {
            let contract = await tronWeb.contract().at(trc20ContractAddress);
            //Use send to execute a non-pure or modify smart contract method on a given smart contract that modify or change values on the blockchain.
            // These methods consume resources(bandwidth and energy) to perform as the changes need to be broadcasted out to the network.
            console.log("Contract", contract);

            let result = await contract.transfer(
                receiver, //address _to
                tronWeb.toSun(0.1)   //amount
            ).send({
                feeLimit: 1000000
            }).then(output => { console.log('- Output:', output, '\n'); });
            console.log('result: ', result);
        } catch (error) {
            console.log("Error ", error);

        }
    }
    async function handleContractDeployment() {

        try {
            const url = 'https://api.shasta.trongrid.io/wallet/deploycontract';

            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    "abi": "[{\"constant\":false,\"inputs\":[{\"name\":\"key\",\"type\":\"uint256\"},{\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"set\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"key\",\"type\":\"uint256\"}],\"name\":\"get\",\"outputs\":[{\"name\":\"value\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"}]",
                    "bytecode": "608060405234801561001057600080fd5b5060de8061001f6000396000f30060806040526004361060485763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416631ab06ee58114604d5780639507d39a146067575b600080fd5b348015605857600080fd5b506065600435602435608e565b005b348015607257600080fd5b50607c60043560a0565b60408051918252519081900360200190f35b60009182526020829052604090912055565b600090815260208190526040902054905600a165627a7a72305820fdfe832221d60dd582b4526afa20518b98c2e1cb0054653053a844cf265b25040029",
                    "owner_address": "TJmmqjb1DK9TTZbQXzRQ2AuA94z4gKAPFh",
                    "name": "SomeContract",
                    "visible": true
                })
            })

            const response = await res.json();
            console.log("Response: ", response);

            const signedTransaction = await signTransaction(response);
            console.log("Signed txn", signedTransaction);

            // const signedTransaction = await tronWeb.trx.sign(transaction);
            const sendTransaction = await tronWeb.trx.sendRawTransaction(signedTransaction);

            console.log("sendTransaction txn", sendTransaction);

        } catch (error) {
            console.log("Error", error);

        }



    }



    return (
        <div>
            <h2>Sign a message</h2>
            <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all' }}>
                You can sign a message by click the button.
            </p>
            <Button style={{ marginRight: '20px' }} onClick={onSignMessage}>
                SignMessage
            </Button>
            <TextField
                size="small"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="input message to signed"
            ></TextField>
            <p>Your sigedMessage is: {signedMessage}</p>
            <h2>Sign a Transaction</h2>
            <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all' }}>
                You can transfer 0.1 Trx to &nbsp;<i>{receiver}</i>&nbsp;by click the button.
            </p>
            <TextField
                size="small"
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="input receiver address"
                style={{ marginRight: '20px' }}
            ></TextField>
            <Button onClick={onSignTransaction}>Transfer</Button>


            <h2>Sign a Transaction for TRC 20 token</h2>
            <p style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all' }}>
                You can transfer 0.1 Trx to &nbsp;<i>{receiver}</i>&nbsp;by click the button.
            </p>
            <TextField
                size="small"
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="input receiver address"
                style={{ marginRight: '20px' }}
            ></TextField>
            <Button onClick={onSignTRC20Transaction}>Transfer TRC 20</Button>


            <Button onClick={handleContractDeployment}>Deploy Contract</Button>


            {open && (
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%', marginTop: 1 }}>
                    Success! You can confirm your transfer on{' '}
                    <a target="_blank" rel="noreferrer" href={`https://nile.tronscan.org/#/address/${address}`}>
                        Tron Scan
                    </a>
                </Alert>
            )}
        </div>
    );
}
