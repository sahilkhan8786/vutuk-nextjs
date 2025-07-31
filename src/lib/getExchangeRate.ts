export async function getUsdToInrRate() {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
    const data = await res.json();
    return data.rates.INR; // e.g. 87.05
}