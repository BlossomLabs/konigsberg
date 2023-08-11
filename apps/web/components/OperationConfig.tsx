import { VStack, HStack, Box, Text, Select, Button, Input, InputRightAddon, InputGroup } from "@chakra-ui/react";
import { store } from "../services/stores/store";
import { useEffect, useState } from "react";

export default function OperationConfig() {

    const [slipagge, setSlippage] = useState<number>(store.UserBridgeOperation.operationConfig.slippage)
    const [destinationChainId, setDestinationChainId] = useState<number>(store.UserBridgeOperation.operationConfig.destinationChainId)
    const [transferPreference, setTransferPreference] = useState<string>(store.UserBridgeOperation.operationConfig.transferPreference)

    useEffect(() => {
        store.UserBridgeOperation.setDestinationChainId(destinationChainId)
        store.UserBridgeOperation.setTransferPreference(transferPreference)
        store.UserBridgeOperation.setSlippage(slipagge)

    }, [destinationChainId, transferPreference, slipagge])

    return (
        <HStack spacing={4}>
            <Box p="1">
                <Text as="b" fontSize="md">
                    Network
                </Text>
                <Select
                    onChange={(e) => {
                        setDestinationChainId(Number(e.target.value))

                    }}
                >
                    <option value="1">Ethereum</option>
                    <option value="10">Optimism</option>
                </Select>
            </Box>
            <Box p="1">
                <Text as="b" fontSize="md">
                    Route priority
                </Text>
                <Select
                    onChange={(e) => {
                        setTransferPreference(e.target.value)
                    }}
                >
                    <option>Maximum return</option>
                    <option>Fastest transfer</option>
                </Select>
            </Box>
            <Box p="1">
                <Box>
                    <Text as="b" fontSize="md">Slippage tolerance</Text>
                    <HStack>
                        <Button onClick={() => setSlippage(0.5)}>0.5%</Button>
                        <Button onClick={() => setSlippage(1)}>1%</Button>
                        <Button onClick={() => setSlippage(3)}>3%</Button>
                        <InputGroup>
                            <Input value={slipagge} onChange={(e) => setSlippage(Number(e.target.value))}></Input>
                            <InputRightAddon children="%" />
                        </InputGroup>
                    </HStack>
                </Box>
            </Box>
        </HStack>
    );
}
