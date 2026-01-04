import type { PDFContent } from "~/pages/Chat/common/message-type";

export const selectFiles = async (event: React.ChangeEvent<HTMLInputElement>): Promise<PDFContent[]> => {
    const files = event.target.files;
    if (!files) return [];

    const newFiles: PDFContent[] = [];

    for (const file of Array.from(files)) {
        // Check if it's a PDF
        if (file.type !== 'application/pdf') {
            alert(`${file.name} is not a PDF file. Only PDF files are supported.`);
            continue;
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert(`${file.name} is too large. Maximum file size is 10MB.`);
            continue;
        }

        try {
            const base64 = await fileToBase64(file);
            newFiles.push({
                file_name: file.name,
                type: "pdf",
                media_type: "application/pdf",
                data: base64.split(',')[1], // Remove data:application/pdf;base64, prefix
            });
        } catch (error) {
            console.error('Error converting file to base64:', error);
            alert(`Failed to process ${file.name}`);
        }
    }

    return newFiles
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};