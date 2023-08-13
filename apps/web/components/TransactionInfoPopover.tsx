import {
    Text,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react'
import { store } from '../services/stores/store'
import { formatEther } from 'ethers/lib/utils.js'

interface TransactionInfoPopoverProps {
    estimatedFee: BigInt | undefined, 
    estimatedReturn: BigInt | undefined, 
    bridgeName: string | undefined
}

export default function TransactionInfoPopover({estimatedFee, estimatedReturn, bridgeName}: TransactionInfoPopoverProps) {

    return (
        <Popover>
            <PopoverTrigger>
                <Button>See proposal</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Transaction details</PopoverHeader>
                <PopoverBody>
                    <Text>Estimated return: {formatEther(estimatedReturn?.toString() || '')}</Text>
                    <Text>Estimated fee: {formatEther(estimatedFee?.toString() || '')}</Text>
                    <Text>Bridge name: {bridgeName}</Text>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )

}