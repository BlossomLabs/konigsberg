export default async function hopBridgeQuote(amount: number, token: string, fromChain: string, toChain: string, slippage: number) {
    const apiUrl = 'https://api.hop.exchange/v1/quote?amount=${amount}&token=${token}&fromChain=${fromChain}&toChain=${toChain}&slippage=${slippage}';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return
    }
}
