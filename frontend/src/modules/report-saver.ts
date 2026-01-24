export const downloadFile = async (
    url: string,
    headers: HeadersInit) => {

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    if (!response) return;

    const contentDisposition = response.headers.get('content-disposition');
    let fileName: string = '';

    if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        if (fileNameMatch) {
            fileName = decodeURIComponent(fileNameMatch[1]);
        } else {
            fileName = contentDisposition.split('filename=')[1].split(';')[0].replace(/['"]/g, '');
        }
    }

    const a = document.createElement('a');
    document.body.appendChild(a);

    const blob = await response.blob();
    const urlFile = window.URL.createObjectURL(blob);

    a.href = urlFile;
    a.download = decodeURIComponent(fileName);
    a.click();

    setTimeout(() => {
        window.URL.revokeObjectURL(urlFile);
        document.body.removeChild(a);
    }, 0);
};
