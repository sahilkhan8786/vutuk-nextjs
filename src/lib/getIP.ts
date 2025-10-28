export async function isIndian() {
    const res = await fetch(`https://ipwho.is/me`);
    const data = await res.json();
    console.log(data)
    return data.country_code === 'IN';
}