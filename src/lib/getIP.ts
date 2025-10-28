export async function isIndian() {
    const res = await fetch(`https://ipwho.is/`);
    const data = await res.json();
    return data.country_code === 'IN';
}