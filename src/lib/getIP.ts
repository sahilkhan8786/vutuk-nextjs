// lib/getIP.ts
export async function isIndian(request?: Request): Promise<boolean> {
    try {
        let clientIP = '';

        // If we have access to request headers, get the real client IP
        if (request) {
            const forwarded = request.headers.get('x-forwarded-for');
            clientIP = forwarded ? forwarded.split(',')[0].trim() : '';
        }

        const apiUrl = clientIP
            ? `https://ipwho.is/${clientIP}`
            : `https://ipwho.is/`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        console.log('🌍 User location with real IP:', {
            clientIP,
            country: data.country,
            country_code: data.country_code,
            success: data.success
        });

        return data.country_code === 'IN';
    } catch (error) {
        console.error('Failed to fetch location:', error);
        return false;
    }
}