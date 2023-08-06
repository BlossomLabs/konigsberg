'use client'

import {
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box,
    VStack,
    Button, 
    Select
} from '@chakra-ui/react'

import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { useState } from 'react';
import { useNetwork } from 'wagmi';

export default function TargetAccounts() {

    const symbol: string = "ETH";
    const { chain } = useNetwork();

    type TargetChain = {
        name: string,
        id: number
    }

    type Account = {
        address: string | undefined,
        chainId: number | undefined,
        amount: number | undefined
    }

    const [accounts, setAccounts] = useState<Account[]>([
        {
            address: "0x1234567890",
            chainId: 1,
            amount: 0.1
        },
        {
            address: "0x0987654321",
            chainId: 10,
            amount: 0.2,
        }
    ]);

    const targetChains: TargetChain[] = [
        { name: "Optimism", id: 10 },
        { name: "Ethereum", id: 1 }
    ]

    console.log(accounts)

    const addRow = () => {
        const updatedAccounts: Account[] = [...accounts, {
            address: undefined,
            chainId: undefined,
            amount: undefined
        }];
        setAccounts(updatedAccounts);
    }

    return (
        <div>
            {!chain && <Text fontSize="2xl" as="b">Send to</Text>}
            {chain && <Text fontSize="2xl" as="b">Send {symbol} from {chain?.name} to</Text>}
            <VStack mt="5">
                <TableContainer>
                    <Table variant={"simple"}>
                        <Thead>
                            <Tr>
                                <Th>Address</Th>
                                <Th>Chain</Th>
                                <Th isNumeric>Amount</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {accounts.map((account, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <Input type="string" placeholder="Address" value={account.address} onChange={(e) => {
                                            const updatedAccounts = [...accounts];
                                            updatedAccounts[index].address = e.target.value;
                                            setAccounts(updatedAccounts);
                                        }} />
                                    </Td>
                                    <Td>
                                        <Select value={account.chainId} onChange={
                                            (e) => {
                                                const updatedAccounts = [...accounts];
                                                updatedAccounts[index].chainId = Number(e.target.value);
                                                setAccounts(updatedAccounts);
                                            }
                                        }>
                                            {targetChains.map((chain, index) => (
                                                <option key={index} value={chain.id}>{chain.name}</option>
                                            ))}
                                        </Select>
                                    </Td>
                                    <Td>
                                        <InputGroup>
                                            <Input type="number" placeholder="Amount" value={account.amount} onChange={(e) => {
                                                const updatedAccounts = [...accounts];
                                                updatedAccounts[index].amount = Number(e.target.value);
                                                setAccounts(updatedAccounts);
                                            }} />
                                            <InputRightAddon>{symbol}</InputRightAddon>
                                        </InputGroup>
                                    </Td>
                                    {accounts.length > 1 && <Td>
                                        <IconButton variant="ghost" aria-label="Remove row" icon={<CloseIcon />} colorScheme="red" size="sm" onClick={() => {
                                            const updatedAccounts = accounts.filter((_, i) => i !== index);
                                            setAccounts(updatedAccounts);
                                        }} />
                                    </Td>
                                    }
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Box display="flex" alignSelf="flex-end" pt="2">
                    <Button onClick={addRow}><AddIcon marginRight="1.5" />Add address</Button>
                </Box>
            </VStack>
        </div>
    )

}