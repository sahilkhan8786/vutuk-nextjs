// lib/getIP.ts
export async function isIndian(request?: Request): Promise<boolean> {
    try {
        let clientIP = '';

        // Try to extract the real client IP from known headers
        if (request) {
            const forwarded = request.headers.get('x-forwarded-for');
            const realIp = request.headers.get('x-real-ip');
            clientIP = forwarded
                ? forwarded.split(',')[0].trim()
                : realIp || '';
        }

        // 🧠 Handle localhost & dev mode — assume Indian
        if (
            process.env.NODE_ENV === 'development' ||
            clientIP === '127.0.0.1' ||
            clientIP === '::1'
        ) {
            console.log('🇮🇳 Local or dev mode detected — treating as Indian');
            return true;
        }

        const apiUrl = clientIP
            ? `https://ipwho.is/${clientIP}`
            : `https://ipwho.is/`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        console.log('🌍 User location lookup:', {
            clientIP,
            country: data.country,
            country_code: data.country_code,
            success: data.success,
        });

        // ✅ Fallback: treat unknown IPs as Indian (safer for errors)
        if (!data.success) {
            console.warn('⚠️ Geo lookup failed, defaulting to Indian = true');
            return true;
        }

        return data.country_code === 'IN';
    } catch (error) {
        console.error('❌ Failed to fetch location:', error);
        // fallback to Indian to avoid charging wrong currency
        return true;
    }
}
