'use client'

import { useState } from "react"
import {
    Image,
    Flex,
    Box,
    Switch,
    Button,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    ModalHeader
} from "@chakra-ui/react"

export default function TokenSelect() {

    const [showTokensWithoutBalance, setShowTokensWithoutBalances] = useState<boolean>(false)

    const [selectedToken, setSelectedToken] = useState<Token>()

    const { isOpen, onOpen, onClose } = useDisclosure()

    type Token = {
        symbol: string,
        name: string,
        balance: number,
        imgUrl: string
    }

    const tokens: Token[] = [
        {
            symbol: "ETH",
            name: "Ethereum",
            balance: 0.1,
            imgUrl: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880"
        },
        {
            symbol: "DAI",
            name: "Dai",
            balance: 0.2,
            imgUrl: "https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png?1574218774"
        },
        {
            symbol: "USDC",
            name: "USD Coin",
            balance: 0,
            imgUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389"
        },
        {
            symbol: "USDT",
            name: "Tether",
            balance: 0,
            imgUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707"
        }
    ]
    
    return (
        <div>
            <Button onClick={onOpen}>
                <Text fontSize="sm" as="b">Select a token</Text>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select a token</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box m="2">
                            <Text fontSize="sm" as="b" mr="2">Show tokens without balance</Text>
                            <Switch onChange={() => setShowTokensWithoutBalances(!showTokensWithoutBalance)} />
                        </Box>
                        <Box mb="2">
                            {tokens.map((token: Token) => {
                                let isSelected: boolean;

                                selectedToken?.symbol === token.symbol ? isSelected = true : isSelected = false;

                                if (token.balance > 0 || showTokensWithoutBalance) {
                                    return (
                                        <Flex
                                            alignItems="center"
                                            p="3"
                                            justify="space-between"
                                            _hover={{ bg: 'gray.100' }}
                                            bg={isSelected ? 'gray.100' : 'transparent'}
                                            onClick={() => setSelectedToken(token)}
                                        >
                                            <Flex alignItems="center">
                                                <Box mr="5">
                                                    <Image src={token.imgUrl} boxSize="20px" />
                                                </Box>
                                                <Box>
                                                    <Text fontSize="md" as="b">
                                                        {token.name}
                                                    </Text>
                                                    <Text fontSize="xs">{token.symbol}</Text>
                                                </Box>
                                            </Flex>
                                            <Box>
                                                <Text>
                                                    {token.balance} {token.symbol}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    );
                                }
                            })}
                        </Box>

                    </ModalBody>

                </ModalContent>
            </Modal>
        </div >
    )
}