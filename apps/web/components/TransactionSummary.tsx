import { Text, VStack, Box, Button } from '@chakra-ui/react'
import { useState } from 'react'

export default function TransactionSummary() {

    const [startingBalance, setStartingBalance] = useState<number>(0)
    const [selectedToken, setSelectedToken] = useState<string>("ETH")
    const [amountToBeSent, setAmountToBeSent] = useState<number>(0)
    const [endingBalance, setEndingBalance] = useState<number>(0)
    const [numberOfTargetAccounts, setNumberOfTargetAccounts] = useState<number>(0)
    const [estimatedFees, setEstimatedFees] = useState<number>(0)

    const [isTransactionSigned, setIsTransactionSigned] = useState<boolean>(false)

    const signTransaction = () => {
        setIsTransactionSigned(true)
        // Implement transaction signature logic here
    }

    const executeTransaction = () => {
        // Implement transaction execution logic here
    }

    return (
        <div>
            <Box mt="7">
                <Text as="b" fontSize="xl">Transaction summary</Text>
                <VStack alignItems="self-start" mt="2">
                    <Box>
                        <Text as="b">Starting balance:</Text>
                        <Text>{startingBalance} {selectedToken}</Text>
                    </Box>
                    <Box>
                        <Text as="b">Amount to be sent:</Text>
                        <Text>{amountToBeSent} {selectedToken}</Text>
                    </Box>
                    <Box>
                        <Text as="b">Expected ending balance:</Text>
                        <Text>{endingBalance} {selectedToken}</Text>
                    </Box>
                    <Box>
                        <Text as="b">Number of accounts receiving funds:</Text>
                        <Text>{numberOfTargetAccounts}</Text>
                    </Box>
                    <Box>
                        <Text as="b">Estimated fees:</Text>
                        <Text>{estimatedFees}</Text>
                    </Box>
                    {/*Add bridge selection & information here*/}
                    <Box>
                        {!isTransactionSigned && <Button onClick={signTransaction}>Sign transaction</Button>}
                        {isTransactionSigned && <Button onClick={executeTransaction}>Execute transaction</Button>}
                    </Box>
                </VStack>
            </Box>
        </div>
    )
}