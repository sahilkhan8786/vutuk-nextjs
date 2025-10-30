export async function uploadToBunny(
    file: File,
    onProgress?: (percent: number) => void
): Promise<string> {
    // 1️⃣ Ask backend for signed upload info
    const res = await fetch("/api/upload-bunny");
    const { uploadUrl, accessKey, publicUrl } = await res.json();

    // 2️⃣ Upload file directly to Bunny Storage
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("AccessKey", accessKey);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(publicUrl); // ✅ return CDN URL
            } else {
                reject(`Upload failed: ${xhr.statusText}`);
            }
        };

        xhr.onerror = () => reject("Network error during upload");
        xhr.send(file);
    });
}
