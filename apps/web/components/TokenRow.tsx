import { Button, Tr, Td, Image, HStack, Checkbox, Input, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { mainnet, useAccount, useBalance } from "wagmi";
import { store } from "../services/stores/store";
import TransactionInfoPopover from "./TransactionInfoPopover";
import { ChainToken } from "../domain/model/ChainToken";
import { BridgeOperationInformation } from "../domain/bridges/BridgeProvider";
import { TransactionsToBeProcessed } from "./TokensSelector";

interface TokenRowProps {
    token: ChainToken,
    sending: boolean,
    index: number,
    onRenderInfoUpdated: (index: number, rendered: boolean) => void,
    onBridgeQuoteObtained: (
        transactionsToBeProcessed: TransactionsToBeProcessed
    ) => void
}


enum BestBridgeProviderType {
    BEST_TIME,
    BEST_RETURN,
}

export default function TokenRow({ token, sending, index, onRenderInfoUpdated, onBridgeQuoteObtained }: TokenRowProps) {

    const [selectedToken, setSelectedToken] = useState<boolean>(false);
    const [chainName, setChainName] = useState<string>("");
    const [amountToBeSent, setAmountToBeSent] = useState<string>("");
    const [quote, setQuote] = useState<any>(null);

    const [estimatedReturn, setEstimatedReturn] = useState<BigInt>();
    const [estimatedFee, setEstimatedFee] = useState<BigInt>();
    const [bridgeName, setBridgeName] = useState<string>();
    const [loadedQuote, setLoadedQuote] = useState<boolean>(false);

    const { address } = useAccount();

    const balance = useBalance({
        address: address,
        chainId: token.chainId,
        token: token.contractAddress as `0x${string}`
    })

    // create an empty function to determine chainname from chainid
    useEffect(() => {
        function getChainName() {
            switch (token.chainId) {
                case 1:
                    setChainName("Ethereum")
                    break;
                case 10:
                    setChainName("Optimism")
                    break;
                case 137:
                    setChainName("Polygon")
                    break;
                case 42161:
                    setChainName("Arbitrum")
                    break;
                default:
                    setChainName("Unknown")
                    break;
            }
        }
        getChainName();
    }, [])

    useEffect(() => {

        let targetChainName: string = "";
        let transferPreference: BestBridgeProviderType;

        if (store.UserBridgeOperation.operationConfig.destinationChainId === 1) {
            targetChainName = "ethereum"
        } else if (store.UserBridgeOperation.operationConfig.destinationChainId === 10) {
            targetChainName = "optimism"
        } else if (store.UserBridgeOperation.operationConfig.destinationChainId === 42161) {
            targetChainName = "arbitrum"
        } else if (store.UserBridgeOperation.operationConfig.destinationChainId === 137) {
            targetChainName = "polygon"
        }

        if (store.UserBridgeOperation.operationConfig.transferPreference === "Maximum return") {
            transferPreference = BestBridgeProviderType.BEST_RETURN
        } else {
            transferPreference = BestBridgeProviderType.BEST_TIME
        }

        if (selectedToken && Number(amountToBeSent) > 0) {
            // TODO: call BridgeService getBestBridgeProviderForBridging and, after having a BridgeProvider, call getBridgeProviderQuoteInformation
            // with getBridgeProviderQuoteInformation, do the transaction
            const bigIntAmount = Number(amountToBeSent) * Math.pow(10, token.nDecimals);
            store.bridgeService.getBestBridgeProviderForBridging(
                token.chainId,
                token.contractAddress,
                store.UserBridgeOperation.operationConfig.destinationChainId,
                BigInt(bigIntAmount),
                store.UserBridgeOperation.operationConfig.slippage,
                String(address),
                transferPreference,
            ).then((bridgeProvider) => {
                bridgeProvider?.getBridgeProviderQuoteInformation(token.chainId,
                    token.contractAddress,
                    store.UserBridgeOperation.operationConfig.destinationChainId,
                    BigInt(bigIntAmount),
                    store.UserBridgeOperation.operationConfig.slippage,
                    String(address)
                ).then((quoteInfo: BridgeOperationInformation | undefined) => {
                    // TODO: use following parameters to call contract
                    // quoteInfo?.contractAddress
                    // quoteInfo?.transactionValue
                    // quoteInfo?.transactionData
                    let transactionsToBeProcessed = {
                        chainId: token.chainId,
                        bridgeContractAddress: quoteInfo?.contractAddress,
                        amountToBeSent: BigInt(bigIntAmount),
                        bestBridgeProvider: quoteInfo
                    }

                    onBridgeQuoteObtained(transactionsToBeProcessed)

                    setEstimatedFee(quoteInfo?.estimatedFee)
                    setEstimatedReturn(quoteInfo?.estimatedAmount)
                    setBridgeName(bridgeProvider.getBridgeProviderInformation().name)

                    setLoadedQuote(true);
                });
            })
        }
    }, [selectedToken, amountToBeSent])

    if (!balance.data?.formatted || balance.data?.formatted === "0.0" || chainName === "Unknown") {

        onRenderInfoUpdated(index, false);

        return (
            <></>
        )

    } else {

        onRenderInfoUpdated(index, true);

        return (
            <Tr>
                <Td>
                    <Checkbox onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedToken(e.target.checked);
                            store.UserBridgeOperation.addOperationToken(token.symbol, token.chainId, Number(amountToBeSent))
                        } else {
                            setSelectedToken(e.target.checked);
                            store.UserBridgeOperation.removeOperationToken(token.symbol, token.chainId)
                        }

                    }} isDisabled={sending} />
                </Td>
                <Td>
                    <HStack>
                        <Image src={token.imgUrl} width="30" height="30" />
                        <Text>{token.symbol}</Text>
                    </HStack>
                </Td>
                <Td>{chainName}</Td>
                <Td>
                    {selectedToken ?
                        <Input type="text" value={String(amountToBeSent)} placeholder={String(balance.data?.formatted)} pattern="^\d*(\.\d*)?$" onChange={(e) => {
                            setAmountToBeSent(e.target.value);
                            store.UserBridgeOperation.addOperationToken(token.symbol, token.chainId, Number(e.target.value))
                        }} isDisabled={sending} /> : String(balance.data?.formatted)}
                </Td>
                <Td>
                    {selectedToken ? (
                        loadedQuote ? (
                            <TransactionInfoPopover estimatedFee={estimatedFee} estimatedReturn={estimatedReturn} bridgeName={bridgeName} />
                        ) : (
                            "Loading..."
                        )
                    ) : (
                        "Not selected"
                    )}
                </Td>
            </Tr>
        )
    }

}