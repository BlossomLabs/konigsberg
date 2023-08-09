class SelectedToken {
    name: string|undefined = undefined;
    symbol: string|undefined = undefined;
}

export default class UserOptions{
    selectedToken: SelectedToken = new SelectedToken();
}