import { Tr, Td, Image, HStack, Checkbox, Input, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { store } from "../services/stores/store";

interface TokenRowProps {
    token: any,
    sending: boolean,
    index: number,
    onRenderInfoUpdated: (index: number, rendered: boolean) => void
}

export default function TokenRow({token, sending, index, onRenderInfoUpdated}: TokenRowProps) {

    const [selectedToken, setSelectedToken] = useState<boolean>(false);
    const [chainName, setChainName] = useState<string>("");
    const [amountToBeSent, setAmountToBeSent] = useState<number>(0);

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
                default:
                    setChainName("Unknown")
                    break;
            }
        }
        getChainName();
    }, [])
    
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
                            store.UserBridgeOperation.addOperationToken(token.symbol, token.chainId, amountToBeSent)
                        } else {
                            setSelectedToken(e.target.checked);
                            store.UserBridgeOperation.removeOperationToken(token.symbol, token.chainId)
                        }

                    }} isDisabled={token.sending} />
                </Td>
                <Td>
                    <HStack>
                        <Image src={token.imgUrl} width="30" height="30" />
                        <Text>{token.symbol}</Text>
                    </HStack>
                </Td>
                <Td>{chainName}</Td>
                <Td>
                    {selectedToken ? <Input type="number" value={String(amountToBeSent)} placeholder={String(balance.data?.formatted)} onChange={(e) => {
                        setAmountToBeSent(Number(e.target.value));
                        store.UserBridgeOperation.addOperationToken(token.symbol, token.chainId, Number(e.target.value))
                    }} isDisabled={token.sending} /> : String(balance.data?.formatted)}
                </Td>
                <Td>{selectedToken ? "Searching..." : "Not selected"}</Td>
                {/*Add amount to be received, fee, bridge to be used. Selector to select among bridges. */}
            </Tr>
        )
    }

}