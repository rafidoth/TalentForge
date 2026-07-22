import { useState, useEffect, useRef } from "react";
import {
    Stack,
    Text,
    Progress,
    Alert,
    Button,
    Center,
} from "@mantine/core";
import {
    UploadSimpleIcon,
    CameraIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import type { AttributeDef } from "./ProfileAttributeInput";
import { useCloudinaryUpload } from "~/hooks/useCloudinaryUpload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const FALLBACK_IMAGE = "https://placehold.co/120x120?text=No+Image";

interface Props {
    attribute: AttributeDef;
    value: any;
    onChange: (id: string, value: any) => void;
}

export function ProfileAttributeInputImage({
    attribute,
    value,
    onChange,
}: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { upload, isUploading, error: uploadError } =
        useCloudinaryUpload(attribute.attributeName);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileSelect = (file: File | null) => {
        setValidationError(null);
        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            setValidationError("Invalid type. Please select JPG, PNG, WebP, or GIF.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setValidationError("File too large. Maximum size is 5 MB.");
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const uploadedUrl = await upload(selectedFile);
        if (uploadedUrl) {
            onChange(attribute.id, uploadedUrl);
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const currentImageUrl = typeof value === "string" && value.length > 0 ? value : null;
    const hasRealImage = Boolean(previewUrl || currentImageUrl);
    const displayUrl = previewUrl || currentImageUrl || FALLBACK_IMAGE;

    return (
        <Stack gap="sm">
            <Text fw={500} size="sm">
                {attribute.attributeName}
            </Text>

            <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                style={{
                    position: "relative",
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: isUploading ? "default" : "pointer",
                    border: hasRealImage ? "none" : "1px dashed var(--mantine-color-gray-4)",
                }}
            >
                <img
                    src={displayUrl}
                    alt={attribute.attributeName}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        opacity: hasRealImage ? 1 : 0.5,
                    }}
                />

                {hasRealImage ? (
                    <Center className="image-hover-overlay" style={overlayStyle(true)}>
                        <CameraIcon size={20} />
                        <Text size="xs" fw={500} c="white">
                            Click to replace photo
                        </Text>
                    </Center>
                ) : (
                    <Center style={overlayStyle(false)}>
                        <UploadSimpleIcon size={20} />
                        <Text size="xs" fw={500} c="dimmed">
                            Upload photo
                        </Text>
                    </Center>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_TYPES.join(",")}
                    onChange={(e) => handleFileSelect(e.currentTarget.files?.[0] ?? null)}
                    disabled={isUploading}
                    style={{ display: "none" }}
                />
            </div>

            <style>{`
                .image-hover-overlay { opacity: 0; transition: opacity 0.15s ease; }
                div:hover > .image-hover-overlay { opacity: 1; }
            `}</style>

            {validationError && (
                <Alert color="red" variant="light" icon={<WarningCircleIcon size={16} />}>
                    {validationError}
                </Alert>
            )}

            {uploadError && (
                <Alert color="red" variant="light" icon={<WarningCircleIcon size={16} />}>
                    Upload error: {uploadError}
                </Alert>
            )}

            {isUploading && <Progress value={60} animated />}

            {selectedFile && !isUploading && (
                <Button
                    leftSection={<UploadSimpleIcon size={16} />}
                    onClick={handleUpload}
                    variant="light"
                    size="sm"
                >
                    Upload image
                </Button>
            )}
        </Stack>
    );
}

function overlayStyle(darkBg: boolean): React.CSSProperties {
    return {
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        background: darkBg ? "rgba(0,0,0,0.55)" : "transparent",
        pointerEvents: "none",
    };
}