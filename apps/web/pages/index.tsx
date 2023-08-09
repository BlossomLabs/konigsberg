import FromAccount from "../components/FromAccount";
import Header from "../components/Header";
import TargetAccounts from "../components/TargetAccounts";
import { Flex, Box } from "@chakra-ui/react";
import TokensSelector from "../components/TokensSelector";

function Page() {
  return (
    <>
      <Header />
      <Flex p="30" justifyContent="center">
        <Box p="2" w="35vw">
          <TokensSelector />
        </Box>
      </Flex>
    </>
  );
}

export default Page;
