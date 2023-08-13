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
                    <Text>Estimated return: {Number(estimatedReturn)}</Text>
                    <Text>Estimated fee: {Number(estimatedFee)}</Text>
                    <Text>Bridge name: {bridgeName}</Text>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )

}