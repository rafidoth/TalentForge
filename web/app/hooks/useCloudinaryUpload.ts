import { useState, useCallback } from "react";
import { getImageUploadSignature, uploadToCloudinary } from "~/api/attributes";

export function useCloudinaryUpload(attributeName: string) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upload = useCallback(
        async (file: File): Promise<string | null> => {
            setIsUploading(true);
            setError(null);

            try {
                // Step 1: Signature from /api/attributes/image/upload
                const sig = await getImageUploadSignature(attributeName);

                // Step 2: Direct upload to Cloudinary
                const result = await uploadToCloudinary(file, sig);

                setIsUploading(false);
                return result.secure_url;
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Upload failed";
                setError(msg);
                setIsUploading(false);
                return null;
            }
        },
        [attributeName]
    );

    return { upload, isUploading, error };
}
