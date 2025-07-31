export async function isIndian() {
    const res = await fetch(`http://ip-api.com/json`);
    const data = await res.json();
    return data.countryCode !== 'IN'

}
