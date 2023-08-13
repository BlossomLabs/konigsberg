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
import { BridgeOperationInformation } from "../domain/bridges/BridgeProvider"
import { usePrepareSendTransaction, useSendTransaction } from "wagmi"
import { BigNumberish } from "ethers"

interface TokenSelectorProps {
    chainId: number,
    tokenContractAddress: string | null,
    destinationChainId: number,
    amount: BigInt,
    slippage: number,
    userAddress: string,
    quote: BridgeOperationInformation | undefined
}

export type TransactionsToBeProcessed = {
    chainId: number,
    bridgeContractAddress: string | undefined,
    amountToBeSent: BigInt,
    bestBridgeProvider: BridgeOperationInformation | undefined
}

export default function TokensSelector({ destinationChainId }: TokenSelectorProps) {

    const [sending, setSending] = useState<boolean>(false)
    const [isConfigCompleted, setIsConfigCompleted] = useState<boolean>(false)
    const [bridgeableTokens, setBridgeableTokens] = useState<ChainToken[]>([])
    const [renderingRows, setRenderingRows] = useState<boolean[]>([])
    const [transactionsToBeProcessed, setTransactionsToBeProcessed] = useState<TransactionsToBeProcessed[]>([])

    useEffect(() => {
        (async () => {
            store.bridgeService.getAllBridgeableTokensToChain(destinationChainId).then((tokens) => {
                if (renderingRows.length !== tokens.length) {
                    setRenderingRows(new Array(tokens.length).fill(false))
                }
                setBridgeableTokens(tokens)
            })
        })()
    }, [destinationChainId])

    const sendTokens = async () => {
        setSending(true)
        console.log(transactionsToBeProcessed)
        /*transactionsToBeProcessed.map((transactionToBeProcessed) => {
            const { config, error } = usePrepareSendTransaction({
                request: {
                    to: transactionToBeProcessed.quote?.contractAddress as string,
                    value: transactionToBeProcessed.quote?.transactionValue as BigNumberish,
                    data: transactionToBeProcessed.quote?.transactionData as string
                },
            })

            const { sendTransaction } = useSendTransaction(config)

            console.log(sendTransaction)
        })*/
    }

    const onRenderInfoUpdated = (index: number, rendered: boolean) => {
            if (index < renderingRows.length && renderingRows[index] !== rendered) {
                let newRenderingRows = [...renderingRows]
                newRenderingRows[index] = rendered
                setRenderingRows(newRenderingRows)
            }
        }

        const isAnyRowRendered = (): boolean => {
            return renderingRows.some((rendered) => rendered)
        }

        const onBridgeQuoteObtained = ({ 
            chainId,
            bridgeContractAddress,
            amountToBeSent,
            bestBridgeProvider
        }: TransactionsToBeProcessed
        ) => {
            let newTransactionsToBeProcessed = [...transactionsToBeProcessed]
            newTransactionsToBeProcessed.push({
                chainId,
                bridgeContractAddress,
                amountToBeSent,
                bestBridgeProvider
            })
            setTransactionsToBeProcessed(newTransactionsToBeProcessed)
            console.log(transactionsToBeProcessed)
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

                                        <TokenRow token={token} sending={sending} index={index} onRenderInfoUpdated={onRenderInfoUpdated} onBridgeQuoteObtained={onBridgeQuoteObtained} />
                                    )
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        {isAnyRowRendered() && (
                            <Box display="flex" pt="2">
                                <Button onClick={sendTokens} isLoading={sending} isDisabled={isConfigCompleted} size="lg" width="xl">Send</Button>
                            </Box>)}
                        {!isAnyRowRendered() && (
                            <VStack display="flex" pt="20">
                                <Text fontSize="xl" fontWeight="bold" as="b" color="gray.500">
                                    There are no compatible tokens with balance in your wallet.
                                </Text>
                                <Text fontSize="lg" fontWeight="bold" color="gray.500">
                                    Please try with another destination network.
                                </Text>
                            </VStack>
                        )}
                    </Box>
                </VStack>
            </div>
        )
    }