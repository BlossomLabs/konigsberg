import { TableContainer, Text, Thead, Box, Th, Table, Tbody, VStack, Button, HStack, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { store } from "../services/stores/store";
import { ChainToken } from "../domain/model/ChainToken";
import TokenRow from "./TokenRow";
import { BridgeOperationInformation, BridgeProvider } from "../domain/bridges/BridgeProvider";
import { BigNumberish } from "ethers";

interface TokenSelectorProps {
    destinationChainId: number;
}

export default function TokensSelector({ destinationChainId }: TokenSelectorProps) {
    const [sending, setSending] = useState<boolean>(false);
    const [isConfigCompleted, setIsConfigCompleted] = useState<boolean>(false);
    const [bridgeableTokens, setBridgeableTokens] = useState<ChainToken[]>([]);
    const [renderingRows, setRenderingRows] = useState<boolean[]>([]);
    const [pendingTransactions, setPendingTransactions] = useState<boolean[]>([]);
    const [finishedTransactions, setFinishedTransaction] = useState<boolean[]>([]);
    const [sendingIndex, setSendingIndex] = useState<number>(-1);

    useEffect(() => {
        (async () => {
            store.bridgeService.getAllBridgeableTokensToChain(destinationChainId).then((tokens) => {
                if (renderingRows.length !== tokens.length) {
                    setRenderingRows(new Array(tokens.length).fill(false));
                }
                if (pendingTransactions.length !== tokens.length) {
                    setPendingTransactions(new Array(tokens.length).fill(false));
                }
                if (finishedTransactions.length !== tokens.length) {
                    setFinishedTransaction(new Array(tokens.length).fill(false));
                }
                setBridgeableTokens(tokens);
            });
        })();
    }, [destinationChainId]);

    const sendTokens = async () => {
        setSending(true);
        setSendingIndex(sendingIndex+1);
        console.log(pendingTransactions);
    };

    const onRenderInfoUpdated = (index: number, rendered: boolean) => {
        if (index < renderingRows.length && renderingRows[index] !== rendered) {
            let newRenderingRows = [...renderingRows];
            newRenderingRows[index] = rendered;
            setRenderingRows(newRenderingRows);
        }
    };

    const isAnyRowRendered = (): boolean => {
        return renderingRows.some((rendered) => rendered);
    };

    const onBridgeQuoteObtained = (index: number, isTransactionPending: boolean) => {
        let newPendingTransactions = [...pendingTransactions];
        newPendingTransactions[index] = isTransactionPending;
        setPendingTransactions(newPendingTransactions);
        console.log(pendingTransactions);
    };

    function onTransactionHasFinished(index: number){
        let newFinishedTransactions = [...finishedTransactions];
        newFinishedTransactions[index] = true;
        setFinishedTransaction(newFinishedTransactions);
        setSendingIndex(newFinishedTransactions.findIndex(e=> e == false));
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
                                    <TokenRow
                                        key={token.chainId+":"+token.contractAddress}
                                        token={token}
                                        transactionsHaveStarted={sending && sendingIndex == index}
                                        index={index}
                                        onRenderInfoUpdated={onRenderInfoUpdated}
                                        onBridgeQuoteObtained={onBridgeQuoteObtained}
                                        onTransactionHasFinished={onTransactionHasFinished}
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    {isAnyRowRendered() && (
                        <Box display="flex" pt="2">
                            <Button
                                onClick={sendTokens}
                                isLoading={sending && pendingTransactions.includes(true) && finishedTransactions.includes(false)}
                                isDisabled={!(pendingTransactions.includes(true) && finishedTransactions.includes(false))}
                                size="lg"
                                width="xl"
                            >
                                {(
                                    finishedTransactions.includes(false)
                                )?"Send":"All transactions completed"}
                                
                            </Button>
                        </Box>
                    )}
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
    );
}
