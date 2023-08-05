import FromAccount from "../components/FromAccount";
import Header from "../components/Header";
import TargetAccounts from "../components/TargetAccounts";
import { Flex, Box } from "@chakra-ui/react";

function Page() {
  return (
    <>
      <Header />
      <Flex p="30">
        <Box p="2" w="35vw">
          <FromAccount />
        </Box>
        <Box p="2">
          <TargetAccounts />
        </Box>
      </Flex>
    </>
  );
}

export default Page;
