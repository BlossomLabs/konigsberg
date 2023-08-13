import { Button, Tr, Td, Image, HStack, Checkbox, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { mainnet, useAccount, useBalance } from "wagmi";
import { store } from "../services/stores/store";
import TransactionInfoPopover from "./TransactionInfoPopover";
import { ChainToken } from "../domain/model/ChainToken";
import { BridgeOperationInformation, BridgeProvider } from "../domain/bridges/BridgeProvider";
import { Spinner } from "@chakra-ui/react";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";
import { parseEther } from "ethers/lib/utils.js";

interface TokenRowProps {
    token: ChainToken;
    index: number;
    onRenderInfoUpdated: (index: number, rendered: boolean) => void;
    onBridgeQuoteObtained: (rowIndex: number, transactionsToBeProcessed: boolean) => void;
    transactionsHaveStarted: boolean;
    onTransactionHasFinished: (index: number) => void;
}

enum BestBridgeProviderType {
    BEST_TIME,
    BEST_RETURN,
}

enum TransactionStatusEnum {
    NOT_STARTED,
    READY_TO_START,
    IN_PROGRESS,
    FINISHED,
}

class TransactionStatus {
    public status: TransactionStatusEnum = TransactionStatusEnum.NOT_STARTED;
    public hasError: boolean = false;
}

export type TransactionToBeProcessed = {
    chainId: number;
    bridgeContractAddress: string | undefined;
    amountToBeSent: BigInt;
    bridgeOperationInformation: BridgeOperationInformation | undefined;
    bestBridgeProvider: BridgeProvider | undefined;
};

export default function TokenRow({
    token,
    index,
    onRenderInfoUpdated,
    onBridgeQuoteObtained,
    transactionsHaveStarted,
    onTransactionHasFinished,
}: TokenRowProps) {
    const [selectedToken, setSelectedToken] = useState<boolean>(false);
    const [chainName, setChainName] = useState<string>("");
    const [amountToBeSent, setAmountToBeSent] = useState<string>("");
    const [quote, setQuote] = useState<any>(null);

    const [estimatedReturn, setEstimatedReturn] = useState<BigInt>();
    const [estimatedFee, setEstimatedFee] = useState<BigInt>();
    const [bridgeName, setBridgeName] = useState<string>();
    const [loadedQuote, setLoadedQuote] = useState<TransactionToBeProcessed | undefined>(undefined);
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(new TransactionStatus());

    const [prepareSendTransaction, setPrepareSendTransaction] = useState<any>();

    const { address } = useAccount();

    const balance = useBalance({
        address: address,
        chainId: token.chainId,
        token: token.contractAddress as `0x${string}`,
    });

    console.log("prepare send trans, ", prepareSendTransaction);
    const { config, error } = usePrepareSendTransaction(prepareSendTransaction);
    console.log("config, ", config);
    console.log("error ", error);
    const { sendTransaction } = useSendTransaction(config);

    // create an empty function to determine chainname from chainid
    useEffect(() => {
        function getChainName() {
            switch (token.chainId) {
                case 1:
                    setChainName("Ethereum");
                    break;
                case 10:
                    setChainName("Optimism");
                    break;
                case 137:
                    setChainName("Polygon");
                    break;
                case 42161:
                    setChainName("Arbitrum");
                    break;
                case 8564:
                    setChainName("Base");
                    break;
                case 7777777:
                    setChainName("Zora");
                    break;
                default:
                    setChainName("Unknown");
                    break;
            }
        }
        getChainName();
    }, []);
    prepareSendTransaction;
    // when trying to start transactions, if we were not doing them, start them
    useEffect(() => {
        if (transactionStatus.status == TransactionStatusEnum.NOT_STARTED) {
            if (transactionsHaveStarted) {
                changeTransactionStatusEnum(TransactionStatusEnum.READY_TO_START);
            }
        }
    }, [transactionsHaveStarted]);

    useEffect(() => {
        if (transactionStatus.status == TransactionStatusEnum.READY_TO_START) {
            startTransaction();
        } else if (transactionStatus.status == TransactionStatusEnum.FINISHED) {
            onTransactionHasFinished(index);
        }
    }, [transactionStatus]);

    // we have new info for transaction
    function transactionInfoUpdate(
        estimatedFee: BigInt | undefined,
        estimatedReturn: BigInt | undefined,
        bridgeName: string | undefined,
        loadedQuote: TransactionToBeProcessed | undefined,
        pendingTransaction: boolean
    ) {
        setEstimatedFee(estimatedFee);
        setEstimatedReturn(estimatedReturn);
        setBridgeName(bridgeName);
        onBridgeQuoteObtained(index, pendingTransaction);
        setLoadedQuote(loadedQuote);

        if (loadedQuote != undefined) {
            setPrepareSendTransaction({
                request: {
                    to: loadedQuote.bridgeOperationInformation?.contractAddress,
                    data: loadedQuote.bridgeOperationInformation?.transactionData,
                    value: parseEther(loadedQuote.bridgeOperationInformation?.transactionValue.toString() ?? "0"),
                    // onSuccess(data: any) {
                    //     console.log(data);
                    //     var newTransStatus = transactionStatus;
                    //     newTransStatus.status = TransactionStatusEnum.FINISHED;
                    //     newTransStatus.hasError = false;
                    //     setTransactionStatus(newTransStatus);
                    // },
                    // onError(error: any) {
                    //     console.log("Error", error);
                    //     var newTransStatus = transactionStatus;
                    //     newTransStatus.status = TransactionStatusEnum.FINISHED;
                    //     newTransStatus.hasError = true;
                    //     setTransactionStatus(newTransStatus);
                    // },
                },
            });
        }
    }

    function changeTransactionStatusEnum(newTransactionStatusEnum: TransactionStatusEnum) {
        var newTransStatus = new TransactionStatus();
        newTransStatus.status = newTransactionStatusEnum;
        newTransStatus.hasError = transactionStatus.hasError;
        setTransactionStatus(newTransStatus);
    }

    function startTransaction() {
        if (transactionStatus.status != TransactionStatusEnum.READY_TO_START) return;
        console.log("start");
        changeTransactionStatusEnum(TransactionStatusEnum.IN_PROGRESS);
        if (isRowHidden() || !selectedToken || loadedQuote == undefined) {
            // we don't have to do any transaction
            changeTransactionStatusEnum(TransactionStatusEnum.FINISHED);
            return;
        }

        console.log("prepare transaction");
        // we have to start the transaction
        console.log(config);
        if (sendTransaction != undefined) sendTransaction();
    }

    useEffect(() => {
        let transferPreference: BestBridgeProviderType;

        if (store.UserBridgeOperation.operationConfig.transferPreference === "Maximum return") {
            transferPreference = BestBridgeProviderType.BEST_RETURN;
        } else {
            transferPreference = BestBridgeProviderType.BEST_TIME;
        }

        if (selectedToken && Number(amountToBeSent) > 0) {
            // TODO: call BridgeService getBestBridgeProviderForBridging and, after having a BridgeProvider, call getBridgeProviderQuoteInformation
            // with getBridgeProviderQuoteInformation, do the transaction
            const bigIntAmount = Number(amountToBeSent) * Math.pow(10, token.nDecimals);
            store.bridgeService
                .getBestBridgeProviderForBridging(
                    token.chainId,
                    token.contractAddress,
                    store.UserBridgeOperation.operationConfig.destinationChainId,
                    BigInt(bigIntAmount),
                    store.UserBridgeOperation.operationConfig.slippage,
                    String(address),
                    transferPreference
                )
                .then((bridgeProvider) => {
                    if (bridgeProvider == undefined) {
                        transactionInfoUpdate(undefined, undefined, undefined, undefined, false);

                        return;
                    }
                    bridgeProvider
                        .getBridgeProviderQuoteInformation(
                            token.chainId,
                            token.contractAddress,
                            store.UserBridgeOperation.operationConfig.destinationChainId,
                            BigInt(bigIntAmount),
                            store.UserBridgeOperation.operationConfig.slippage,
                            String(address)
                        )
                        .then((quoteInfo: BridgeOperationInformation | undefined) => {
                            if (quoteInfo == undefined) {
                                transactionInfoUpdate(undefined, undefined, undefined, undefined, false);
                                return;
                            }
                            let transactionToBeProcessed: TransactionToBeProcessed = {
                                chainId: token.chainId,
                                bridgeContractAddress: quoteInfo.contractAddress,
                                amountToBeSent: BigInt(bigIntAmount),
                                bestBridgeProvider: bridgeProvider,
                                bridgeOperationInformation: quoteInfo,
                            };
                            transactionInfoUpdate(
                                quoteInfo?.estimatedFee,
                                quoteInfo?.estimatedAmount,
                                bridgeProvider.getBridgeProviderInformation().name,
                                transactionToBeProcessed,
                                true
                            );
                        });
                });
        } else {
            transactionInfoUpdate(undefined, undefined, undefined, undefined, false);
        }
    }, [selectedToken, amountToBeSent]);

    function isRowHidden(): boolean {
        return (
            !balance.data?.formatted ||
            balance.data?.formatted === "0.0" ||
            store.UserBridgeOperation.operationConfig.destinationChainId == undefined
        );
    }

    if (isRowHidden()) {
        onRenderInfoUpdated(index, false);

        return <></>;
    } else {
        onRenderInfoUpdated(index, true);

        return (
            <Tr>
                <Td>
                    <Checkbox
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedToken(e.target.checked);
                                store.UserBridgeOperation.addOperationToken(
                                    token.symbol,
                                    token.chainId,
                                    Number(amountToBeSent)
                                );
                            } else {
                                setSelectedToken(e.target.checked);
                                store.UserBridgeOperation.removeOperationToken(token.symbol, token.chainId);
                            }
                        }}
                        isDisabled={transactionStatus.status != TransactionStatusEnum.NOT_STARTED}
                    />
                </Td>
                <Td>
                    <HStack>
                        <Image src={token.imgUrl} width="30" height="30" />
                        <Text>{token.symbol}</Text>
                    </HStack>
                </Td>
                <Td>{chainName}</Td>
                <Td>
                    {selectedToken ? (
                        <Input
                            type="text"
                            value={String(amountToBeSent)}
                            placeholder={String(balance.data?.formatted)}
                            pattern="^\d*(\.\d*)?$"
                            onChange={(e) => {
                                setAmountToBeSent(e.target.value);
                                store.UserBridgeOperation.addOperationToken(
                                    token.symbol,
                                    token.chainId,
                                    Number(e.target.value)
                                );
                            }}
                            isDisabled={transactionStatus.status != TransactionStatusEnum.NOT_STARTED}
                        />
                    ) : (
                        String(balance.data?.formatted)
                    )}
                </Td>
                <Td>
                    {selectedToken ? (
                        loadedQuote ? (
                            transactionStatus.status == TransactionStatusEnum.FINISHED ? (
                                "Transaction Finished"
                            ) : transactionStatus.status == TransactionStatusEnum.IN_PROGRESS ? (
                                <Spinner />
                            ) : (
                                <TransactionInfoPopover
                                    estimatedFee={estimatedFee}
                                    estimatedReturn={estimatedReturn}
                                    bridgeName={bridgeName}
                                />
                            )
                        ) : Number(amountToBeSent) > 0 ? (
                            "Loading..."
                        ) : (
                            "Select amount"
                        )
                    ) : (
                        "Not selected"
                    )}
                </Td>
            </Tr>
        );
    }
}
