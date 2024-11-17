'use client'

import { useState, useCallback } from 'react';
import { Upload, X, Image, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FileUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<{
        [key: string]: {
            uploading: boolean,
            url: string,
            error?: string
        }
    }>({});

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
                    error: 'Please upload a valid image file (JPEG, PNG, or HEIC)'
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
                    error: 'File size must be less than 10MB'
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
        const uploadPromises = files.map(async (file) => {
            try {
                setUploadStatus(prev => ({
                    ...prev,
                    [file.name]: { uploading: true, url: '' }
                }));

                const data = new FormData();
                data.set("file", file);

                const uploadRequest = await fetch("/api/files/upload", {
                    method: "POST",
                    body: data,
                });

                if (!uploadRequest.ok) {
                    throw new Error('Upload failed');
                }

                const signedUrl = await uploadRequest.json();
                setUploadStatus(prev => ({
                    ...prev,
                    [file.name]: { uploading: false, url: signedUrl }
                }));
            } catch (e) {
                console.error(e);
                setUploadStatus(prev => ({
                    ...prev,
                    [file.name]: {
                        uploading: false,
                        url: '',
                        error: 'Trouble uploading file'
                    }
                }));
            }
        });

        await Promise.all(uploadPromises);
    };

    return (
        <div className="w-full mx-auto space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center ${isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                    } transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {files.length > 0 ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {files.map((file) => (
                                <div key={file.name} className="flex items-center justify-center space-x-2">
                                    <Image className="w-6 h-6 text-gray-500" />
                                    <span className="text-sm text-gray-500">{file.name}</span>
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        className="p-1 hover:bg-gray-200 rounded-full"
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                    {uploadStatus[file.name]?.error && (
                                        <span className="text-xs text-red-500">
                                            {uploadStatus[file.name].error}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={uploadFiles}
                            disabled={Object.values(uploadStatus).some(status => status.uploading)}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${Object.values(uploadStatus).some(status => status.uploading)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            {Object.values(uploadStatus).some(status => status.uploading)
                                ? 'Uploading...'
                                : 'Upload Receipts'}
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                            <label className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Drop your receipts here, or{' '}
                                    <span className="text-blue-500 hover:text-blue-600">
                                        browse
                                    </span>
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept="image/jpeg,image/png,image/heic"
                                    multiple
                                />
                            </label>
                            <p className="mt-1 text-xs text-gray-500">
                                JPEG, PNG, or HEIC (max. 10MB per file)
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(uploadStatus).map(([fileName, status]) => (
                    status.url && (
                        <div key={fileName} className="p-4 border rounded-lg bg-white">
                            <p className="text-sm text-gray-500 mb-2">{fileName}</p>
                            <img
                                src={status.url}
                                alt={`Uploaded Receipt - ${fileName}`}
                                className="max-w-full h-auto rounded-md"
                            />
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default FileUpload;