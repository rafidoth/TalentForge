import { useState, useEffect } from "react";
import {
    Stack,
    Image,
    Text,
    Progress,
    Alert,
    Button,
    FileButton,
    Box,
    Overlay,
    Center,
} from "@mantine/core";
import {
    UploadSimpleIcon,
    ImageIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import type { AttributeDef } from "./ProfileAttributeInput";
import { useCloudinaryUpload } from "~/hooks/useCloudinaryUpload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
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

            <FileButton onChange={handleFileSelect} accept={ALLOWED_TYPES.join(",")} disabled={isUploading}>
                {(props) => (
                    <Box
                        {...props}
                        pos="relative"
                        w="100%"
                        maw={100}
                        h={100}
                        style={{
                            cursor: isUploading ? "not-allowed" : "pointer",
                            borderRadius: "var(--mantine-radius-md)",
                            overflow: "hidden",
                            backgroundColor: "var(--mantine-color-gray-1)",
                        }}
                    >
                        <Image
                            src={displayUrl}
                            alt={attribute.attributeName}
                            w="100%"
                            h="100%"
                            fit="cover"
                            fallbackSrc="https://placehold.co/300x200?text=Upload+Image"
                        />
                        <Overlay color="#000" backgroundOpacity={0.5} zIndex={1} />
                        <Center pos="absolute" top={0} left={0} right={0} bottom={0} >
                            <Stack align="center" gap={4}>
                                <ImageIcon size={32} color="white" opacity={0.8} />
                                <Text c="white" size="sm" fw={500} ta="center">
                                    Click to replace image
                                </Text>
                            </Stack>
                        </Center>
                    </Box>
                )}
            </FileButton>

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
