'use client'

import { Flex, Box, Text, Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { store } from "../services/stores/store"
import { ConnectButton } from "@rainbow-me/rainbowkit"


export default function Header() {

    const router = useRouter()

    return(
        <Box bg="purple.400" w="100%" p={4} color="white" position="sticky" top="0" zIndex="1000">
            <Flex justify="space-between">
                <Flex align="center">
                    <Text fontSize="xl" as="b" mr={4} cursor="pointer" onClick={() => router.push("/")}>
                        PREGEL BRIDGE
                    </Text>
                </Flex>
                <ConnectButton showBalance={false} chainStatus="full"/>
            </Flex>
        </Box>
    )
}