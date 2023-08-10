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
import { useEffect, useState } from "react"
import { store } from "../services/stores/store"
import { ChainToken } from "../domain/model/ChainToken"
import TokenRow from "./TokenRow"

export default function TokensSelector() {

    const [sending, setSending] = useState<boolean>(false)
    const [isConfigCompleted, setIsConfigCompleted] = useState<boolean>(false)
    const [bridgeableTokens, setBridgeableTokens] = useState<ChainToken[]>([])

    type Tokens = {
        symbol: string,
        name: string,
        network: string,
        balance: number,
        imgUrl: string,
        selected: boolean,
        amountToBeSent: number | undefined
    }

    useEffect(() => {
        (async () => {
            await store.bridgeService.getAllBridgeableTokensToChain(store.UserBridgeOperation.operationConfig.destinationChainId).then((tokens) => {
                setBridgeableTokens(tokens)
            })
        })()
    }, [])

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
        },

    ])

    const sendTokens = async () => {
        setSending(true)
        // Implement sending logic here
    }

    return (
        <div>
            <Text as="b" fontSize="2xl">Select tokens</Text>
            <HStack>
                <Box>
                    <Text as="b" fontSize="md">Network</Text>
                    <Select onChange={(e) => store.UserBridgeOperation.setDestinationChainId(Number(e.target.value))}>
                        <option value="1">Ethereum</option>
                        <option value="10">Optimism</option>
                    </Select>
                    <Box>
                        <Text as="b" fontSize="md">Transfer preferences</Text>
                        <Select onChange={(e) => store.UserBridgeOperation.setTransferPreference(e.target.value)}>
                            <option>Best return</option>
                            <option>Fastest</option>
                        </Select>
                    </Box>
                </Box>
            </HStack>
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
                                {bridgeableTokens.map((token, index) => (
                                    <TokenRow token={token} sending={sending} />
                                )
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" pt="2">
                        <Button onClick={sendTokens} isLoading={sending} isDisabled={isConfigCompleted} size="lg" width="xl">Send</Button>
                    </Box>
                </Box>
            </VStack>
        </div>
    )
}