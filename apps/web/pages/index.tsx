import Header from "../components/Header";
import OperationConfig from "../components/OperationConfig";
import TokensSelector from "../components/TokensSelector";

import { Flex, Box, Text, VStack, HStack } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useState } from "react";
import { store } from "../services/stores/store";

function Page() {

  const { address } = useAccount();

  const [destinationChainId, setDestinationChainId] = useState<number>(1)

  const userConfigOperationChanged = () => {
    setDestinationChainId(store.UserBridgeOperation.operationConfig.destinationChainId)
  }

  return (
    <>
      <div className="">
        <Header />
        {address && (
          <VStack p="30" justifyContent="center">
            <Text as="b" color="white" fontSize="4xl">Transfer tokens</Text>
            <HStack>
              <OperationConfig onUserConfigOperationChanged={userConfigOperationChanged} />
            </HStack>
            <TokensSelector destinationChainId={destinationChainId} />
          </VStack>
        )}
        {!address && (
          <VStack p="30" justifyContent="center">
            <Text as="b" color="white" fontSize="4xl">Transfer tokens</Text>
            <Text as="b" color="white" fontSize="2xl">To transfer tokens please, connect your wallet first!</Text>
          </VStack>
        )}
      </div>
    </>
  );
}

export default Page;
