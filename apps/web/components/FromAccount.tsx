'use client'

import { Text, VStack, Box } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useState } from "react"
import TokenSelect from "./TokenSelect"
import { useAccount } from "wagmi"

export default function FromAccount() {

    const { address } = useAccount()

    return (
        <div>
            <Text fontSize="2xl" as="b" >Send from</Text>
            <VStack alignItems="flex-start" mt="9">
                <div className="wallet-button-wrapper">
                    <ConnectButton showBalance={false} />
                </div>
                <Box mt="3">
                    {address ? <TokenSelect /> : null}
                </Box>
            </VStack>
        </div>
    )
}