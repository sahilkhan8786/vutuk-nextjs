export async function uploadToBunny(file: File, onProgress?: (percent: number) => void) {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        xhr.open('POST', '/api/upload-bunny');

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const resp = JSON.parse(xhr.responseText);
                if (resp.url) resolve(resp.url);
                else reject(resp.error);
            } else {
                reject(xhr.responseText);
            }
        };

        xhr.onerror = () => reject('Upload failed due to network error');
        xhr.send(formData); // Send FormData instead of file directly
    });
}