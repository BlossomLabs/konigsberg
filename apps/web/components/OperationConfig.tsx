import { VStack, HStack, Box, Text, Select, Button, Input, InputRightAddon, InputGroup } from "@chakra-ui/react";
import { store } from "../services/stores/store";
import { useState } from "react";

export default function OperationConfig() {

    const [slipagge, setSlippage] = useState<number>(store.UserBridgeOperation.operationConfig.slippage)
    const [destinationChainId, setDestinationChainId] = useState<number>(store.UserBridgeOperation.operationConfig.destinationChainId)
    const [transferPreference, setTransferPreference] = useState<string>(store.UserBridgeOperation.operationConfig.transferPreference)

    console.log(store.UserBridgeOperation.operationConfig.destinationChainId)

    return (
        <HStack spacing={4}>
            <Box p="1">
                <Text as="b" fontSize="md">
                    Network
                </Text>
                <Select
                    onChange={(e) => {
                        setDestinationChainId(Number(e.target.value))
                        store.UserBridgeOperation.setDestinationChainId(destinationChainId)
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
                        store.UserBridgeOperation.setTransferPreference(transferPreference)
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
                        <Button onClick={() => { setSlippage(0.5); store.UserBridgeOperation.setSlippage(slipagge) }}>0.5%</Button>
                        <Button onClick={() => { setSlippage(1); store.UserBridgeOperation.setSlippage(slipagge) }}>1%</Button>
                        <Button onClick={() => { setSlippage(3); store.UserBridgeOperation.setSlippage(slipagge) }}>3%</Button>
                        <InputGroup>
                            <Input value={slipagge} onChange={(e) => { setSlippage(Number(e.target.value)); store.UserBridgeOperation.setSlippage(slipagge) }}></Input>
                            <InputRightAddon children="%" />
                        </InputGroup>
                    </HStack>
                </Box>
            </Box>
        </HStack>
    );
}
