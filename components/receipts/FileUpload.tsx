'use client'

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
    onUploadSuccess?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<{
        [key: string]: {
            uploading: boolean;
            url: string;
            error?: string;
        };
    }>({});
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateFile = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/heic'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            setUploadStatus(prev => ({
                ...prev,
                [file.name]: {
                    uploading: false,
                    url: '',
                    error: 'Invalid file type. Please upload JPEG, PNG, or HEIC'
                }
            }));
            return false;
        }

        if (file.size > maxSize) {
            setUploadStatus(prev => ({
                ...prev,
                [file.name]: {
                    uploading: false,
                    url: '',
                    error: 'File too large. Maximum size is 10MB'
                }
            }));
            return false;
        }

        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(validateFile);
        setFiles(prev => [...prev, ...validFiles]);
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter(validateFile);
        setFiles(prev => [...prev, ...validFiles]);
    }, []);

    const removeFile = useCallback((fileName: string) => {
        setFiles(prev => prev.filter(file => file.name !== fileName));
        setUploadStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[fileName];
            return newStatus;
        });
    }, []);

    const uploadFiles = async () => {
        if (files.length === 0 || isUploading) return;

        setIsUploading(true);
        let hasError = false;

        try {
            const uploadPromises = files.map(async (file) => {
                try {
                    setUploadStatus(prev => ({
                        ...prev,
                        [file.name]: { uploading: true, url: '' }
                    }));

                    const formData = new FormData();
                    formData.append("file", file);

                    const response = await fetch("/api/files/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Upload failed');
                    }

                    const { url } = await response.json();

                    setUploadStatus(prev => ({
                        ...prev,
                        [file.name]: { uploading: false, url }
                    }));
                } catch (error) {
                    hasError = true;
                    console.error(`Error uploading ${file.name}:`, error);
                    setUploadStatus(prev => ({
                        ...prev,
                        [file.name]: {
                            uploading: false,
                            url: '',
                            error: 'Failed to upload file'
                        }
                    }));
                }
            });

            await Promise.all(uploadPromises);

            if (!hasError) {
                setFiles([]);
                setUploadStatus({});
                onUploadSuccess?.();
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Drop Zone */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
                    transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {files.length > 0 ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {files.map((file) => (
                                <div key={file.name} className="flex items-center justify-between p-2 bg-white rounded-md">
                                    <div className="flex items-center space-x-2">
                                        <ImageIcon className="w-5 h-5 text-gray-500" />
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {uploadStatus[file.name]?.error && (
                                            <span className="text-xs text-red-500">
                                                {uploadStatus[file.name].error}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => removeFile(file.name)}
                                            className="p-1 hover:bg-gray-100 rounded-full"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={uploadFiles}
                            disabled={isUploading || files.length === 0}
                            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md
                                ${isUploading || files.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'}
                                transition-colors duration-200`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Receipts'}
                        </button>
                    </div>
                ) : (
                    <label className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                            <span className="text-sm font-medium text-gray-900">
                                Drop receipts here or click to browse
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileSelect}
                                accept="image/jpeg,image/png,image/heic"
                                multiple
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                JPEG, PNG, or HEIC (max. 10MB per file)
                            </p>
                        </div>
                    </label>
                )}
            </div>

            {/* Upload Progress/Preview */}
            {Object.entries(uploadStatus).some(([_, status]) => status.url) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(uploadStatus).map(([fileName, status]) => (
                        status.url && (
                            <div key={fileName} className="p-4 border rounded-lg bg-white">
                                <p className="text-sm font-medium text-gray-700 mb-2">{fileName}</p>
                                <img
                                    src={status.url}
                                    alt={`Receipt - ${fileName}`}
                                    className="w-full h-48 object-cover rounded-md"
                                />
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;