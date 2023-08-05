'use client'

import { Text } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function FromAccount() {

    return (
        <div>
            <Text fontSize="2xl" as="b" >Send from</Text>

            <div className="wallet-button-wrapper">
                <ConnectButton showBalance={false}/>
            </div>
        </div>
    )
}