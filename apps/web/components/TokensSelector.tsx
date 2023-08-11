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
    HStack,
    Select
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { store } from "../services/stores/store"
import { ChainToken } from "../domain/model/ChainToken"
import TokenRow from "./TokenRow"

interface TokenSelectorProps {
    destinationChainId: number
}

export default function TokensSelector({destinationChainId}: TokenSelectorProps) {

    const [sending, setSending] = useState<boolean>(false)
    const [isConfigCompleted, setIsConfigCompleted] = useState<boolean>(false)
    const [bridgeableTokens, setBridgeableTokens] = useState<ChainToken[]>([])

    useEffect(() => {
        (async () => {
            store.bridgeService.getAllBridgeableTokensToChain(destinationChainId).then((tokens) => {
                setBridgeableTokens(tokens)
            })
        })()
    }, [destinationChainId])

    const sendTokens = async () => {
        setSending(true)
        // Implement sending logic here
    }

    return (
        <div>
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