export type UploadCategory = "img" | "voice" | "file" | "pdf";

interface UploadResponse {
    url: string;
    key: string;
    category: UploadCategory;
    originalName: string;
    size: number;
    mimeType: string;
}


export const upload = async (
    file: File,
    category?: UploadCategory
): Promise<UploadResponse> => {
    try {
        const detectedCategory = category || detectFileCategory(file);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", detectedCategory);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const data: UploadResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        throw error;
    }
};


const detectFileCategory = (file: File): UploadCategory => {
    const mimeType = file.type;
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (mimeType.startsWith("image/")) return "img";

    if (
        mimeType.startsWith("audio/") ||
        ["webm", "wav", "mp3", "ogg", "m4a"].includes(extension || "")
    ) return "voice";

    if (mimeType === "application/pdf" || extension === "pdf") return "pdf";

    return "file";
};


export const uploadMultiple = async (
    files: File[]
): Promise<UploadResponse[]> => {
    return Promise.all(files.map((file) => upload(file)));
};