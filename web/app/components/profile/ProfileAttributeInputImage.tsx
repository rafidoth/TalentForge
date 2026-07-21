import { useState, useEffect } from "react";
import {
    Stack,
    Image,
    Text,
    FileInput,
    Progress,
    Alert,
    Group,
    Button,
} from "@mantine/core";
import {
    UploadSimpleIcon,
    ImageIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import type { AttributeDef } from "./ProfileAttributeInput";
import { useCloudinaryUpload } from "~/hooks/useCloudinaryUpload";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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
    const displayUrl = previewUrl || currentImageUrl;

    return (
        <Stack gap="sm">
            <Text fw={500} size="sm">
                {attribute.attributeName}
            </Text>

            {displayUrl && (
                <Group align="flex-start" gap="md">
                    <Image
                        src={displayUrl}
                        alt={attribute.attributeName}
                        w={120}
                        h={120}
                        radius="md"
                        fit="cover"
                        fallbackSrc="https://placehold.co/120x120?text=No+Image"
                    />
                </Group>
            )}

            <FileInput
                leftSection={<ImageIcon size={16} />}
                placeholder="Choose image to replace..."
                accept={ALLOWED_TYPES.join(",")}
                value={selectedFile}
                onChange={handleFileSelect}
                disabled={isUploading}
                clearable
            />

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
                    Upload Image
                </Button>
            )}
        </Stack>
    );
}
