import {
    TableContainer,
    Text,
    Thead,
    Box,
    Th,
    Table,
    Tbody,
    VStack,
    Button,
    Tr,
    Td,
    Image,
    HStack,
    Checkbox,
    Input,
    Select
} from "@chakra-ui/react"
import { useState } from "react"

export default function TokensSelector() {

    const [sending, setSending] = useState<boolean>(false)

    type Tokens = {
        symbol: string,
        name: string,
        network: string,
        balance: number,
        imgUrl: string,
        selected: boolean,
        amountToBeSent: number | undefined
    }

    const [tokens, setTokens] = useState<Tokens[]>([
        {
            symbol: "ETH",
            name: "Ethereum",
            network: "Ethereum",
            balance: 0.1,
            imgUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
            selected: false,
            amountToBeSent: undefined
        },
        {
            symbol: "DAI",
            name: "Dai",
            network: "Ethereum",
            balance: 100,
            imgUrl: "https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png?1574218774",
            selected: false,
            amountToBeSent: undefined

        },
        {
            symbol: "USDC",
            name: "USD Coin",
            network: "Ethereum",
            balance: 100,
            imgUrl: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389",
            selected: false,
            amountToBeSent: undefined
        },
        {
            symbol: "USDT",
            name: "Tether",
            network: "Ethereum",
            balance: 100,
            imgUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png?1598003707",
            selected: false,
            amountToBeSent: undefined
        }
    ])

    const sendTokens = async () => {
        setSending(true)
        // Implement sending logic here
    }

    return (
        <div>
            <Text as="b" fontSize="2xl">Select tokens</Text>
            <VStack>
                <Box>
                    <TableContainer>
                        <Table variant="simple">
                            <Thead>
                                <Th></Th>
                                <Th>Token</Th>
                                <Th>Network</Th>
                                <Th>Amount</Th>
                                <Th>Status</Th>
                            </Thead>
                            <Tbody>
                                {tokens.map((token, index) => (
                                    <Tr>
                                        <Td>
                                            <Checkbox onChange={(e) => {
                                                const updatedTokens = [...tokens];
                                                updatedTokens[index].selected = e.target.checked;
                                                setTokens(updatedTokens);
                                            }} isDisabled={sending} />
                                        </Td>
                                        <Td>
                                            <HStack>
                                                <Image src={token.imgUrl} width="30" height="30" />
                                                <Text>{token.symbol}</Text>
                                            </HStack>
                                        </Td>
                                        <Td>{token.network}</Td>
                                        <Td>
                                            {token.selected ? <Input type="number" placeholder={String(token.balance)} onChange={(e) => {
                                                const updatedTokens = [...tokens];
                                                updatedTokens[index].amountToBeSent = Number(e.target.value);
                                            }} isDisabled={sending} /> : token.balance}
                                        </Td>
                                        <Td>{token.selected ? "Searching..." : "Not selected"}</Td>
                                        {/*Add amount to be received, fee, bridge to be used. Selector to select among bridges. */}
                                    </Tr>
                                )
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <HStack>
                        <Select>
                            <option>Ethereum..</option>
                            <option>Optimism</option>
                            {/* select networks, if not selected, send disabled*/}
                        </Select>
                        <Select>
                            <option>Fastest</option>
                            <option>Best return</option>
                            {/* select preference */}
                        </Select>
                    </HStack>

                    <Box display="flex" pt="2">
                        <Button onClick={sendTokens} isLoading={sending} isDisabled={
                            tokens.filter((token) => token.selected).length === 0
                        }>Send</Button>
                    </Box>
                </Box>
            </VStack>
        </div>
    )
}