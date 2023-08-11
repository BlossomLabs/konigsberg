export default async function hopBridgeQuote(amount: number, token: string, fromChain: string, toChain: string, slippage: number, decimals: number) {

    console.log(decimals)
    
    const bigAmount: number = Number(amount * 10 ** decimals)

    const apiUrl = `https://api.hop.exchange/v1/quote?amount=${bigAmount}&token=${token}&fromChain=${fromChain}&toChain=${toChain}&slippage=${slippage}`;

    console.log(apiUrl)

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return;
    }
}
