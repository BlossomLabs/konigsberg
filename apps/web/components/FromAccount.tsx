'use client'

import { Text, VStack } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function FromAccount() {

    return (
        <div>
            <Text fontSize="2xl" as="b" >Send from</Text>
            <VStack alignItems="flex-start" mt="9">
                <div className="wallet-button-wrapper">
                    <ConnectButton showBalance={false} />
                </div>
            </VStack>
        </div>
    )
}