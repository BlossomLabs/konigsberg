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

export default function TransactionInfoPopover() {

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
                    <Text>Estimated return: </Text>
                    <Text>Estimated fee: </Text>
                    <Text>Bridge name: </Text>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}