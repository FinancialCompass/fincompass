'use client'

import { useState, useCallback } from 'react';
import { Upload, X, Image, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FileUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState("");
    const [error, setError] = useState('');

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    interface FileUploadProps {
        file: File;
    }

    const validateFile = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/heic'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, or HEIC)');
            return false;
        }

        if (file.size > maxSize) {
            setError('File size must be less than 10MB');
            return false;
        }

        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        setError('');

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && validateFile(droppedFile)) {
            setFile(droppedFile);
            setUrl("");  // Reset URL when new file is dropped
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        const selectedFile = e.target.files?.[0];
        if (selectedFile && validateFile(selectedFile)) {
            setFile(selectedFile);
            setUrl("");  // Reset URL when new file is selected
        }
    }, []);

    const removeFile = useCallback(() => {
        setFile(null);
        setError('');
        setUrl("");
    }, []);

    const uploadFile = async () => {
        try {
            if (!file) {
                setError('No file selected');
                return;
            }

            setUploading(true);
            setError('');

            const data = new FormData();
            data.set("file", file);

            const uploadRequest = await fetch("/api/files", {
                method: "POST",
                body: data,
            });

            if (!uploadRequest.ok) {
                throw new Error('Upload failed');
            }

            const signedUrl = await uploadRequest.json();
            setUrl(signedUrl);
        } catch (e) {
            console.error(e);
            setError('Trouble uploading file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full mx-auto space-y-4">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center ${isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                    } transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {file ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <Image className="w-6 h-6 text-gray-500" />
                            <span className="text-sm text-gray-500">{file.name}</span>
                            <button
                                onClick={removeFile}
                                className="p-1 hover:bg-gray-200 rounded-full"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <button
                            onClick={uploadFile}
                            disabled={uploading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${uploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload Receipt'}
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                            <label className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Drop your receipt here, or{' '}
                                    <span className="text-blue-500 hover:text-blue-600">
                                        browse
                                    </span>
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept="image/jpeg,image/png,image/heic"
                                />
                            </label>
                            <p className="mt-1 text-xs text-gray-500">
                                JPEG, PNG, or HEIC (max. 10MB)
                            </p>
                        </div>
                    </>
                )}
            </div>

            {url && (
                <div className="mt-4 p-4 border rounded-lg bg-white">
                    <img
                        src={url}
                        alt="Uploaded Receipt"
                        className="max-w-full h-auto rounded-md"
                    />
                </div>
            )}
        </div>
    );
};

export default FileUpload;