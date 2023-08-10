import { Tr, Td, Image, HStack, Checkbox, Input, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { ChainToken } from "../domain/model/ChainToken";
import { store } from "../services/stores/store";

export default function TokenRow(token: any, sending: boolean) {
    
    const [selectedToken, setSelectedToken] = useState<boolean>(false);
    const [chainName, setChainName] = useState<string>("");
    const [amountToBeSent, setAmountToBeSent] = useState<number>(0);
    const [storeTokens, setStoreTokens] = useState<any[]>(store.UserOptions.selectedTokens);

    const { address } = useAccount();

    const balance = useBalance({
        address: address,
        chainId: token.token.chainId,
        token: token.token.contractAddress as `0x${string}`
    })

    // create an empty function to determine chainname from chainid
    useEffect(() => {
        function getChainName() {
            switch(token.token.chainId) {
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

    useEffect(() => {
        store.UserOptions.selectedTokens = storeTokens;
        console.log(store.UserOptions.selectedTokens)
    }, [storeTokens])

    if(!balance.data?.formatted || balance.data?.formatted === "0.0" || chainName === "Unknown") {
        return (
            <></>    
        )

    } else {
        return (
            <Tr>
                <Td>
                    <Checkbox onChange={(e) => {
                        setSelectedToken(e.target.checked);
                    }} isDisabled={token.sending} />
                </Td>
                <Td>
                    <HStack>
                        <Image src={token.token.imgUrl} width="30" height="30" />
                        <Text>{token.token.symbol}</Text>
                    </HStack>
                </Td>
                <Td>{chainName}</Td>
                <Td>
                    {selectedToken ? <Input type="number" placeholder={String(balance.data?.formatted)} onChange={(e) => {
                    const updatedTokens = [...storeTokens];
                    updatedTokens[token.token.index].amountToBeSent = Number(e.target.value);
                    setStoreTokens(updatedTokens);
                    }} isDisabled={token.sending} /> : String(balance.data?.formatted)}
                </Td>
                <Td>{selectedToken ? "Searching..." : "Not selected"}</Td>
                {/*Add amount to be received, fee, bridge to be used. Selector to select among bridges. */}
            </Tr>
        )
    }        
    
}