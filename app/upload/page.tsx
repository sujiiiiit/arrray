"use client";

import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [downloadURL, setDownloadURL] = useState<string>("");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        const fileRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setDownloadURL(downloadURL);
                });
            }
        );
    };

    const handleDownload = () => {
        if (!downloadURL) return;
        if (downloadURL) {
            const link = document.createElement("a");
            link.href = downloadURL;
            link.download = file?.name || "";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Upload Files</h1>
            <div className="flex flex-col items-center space-y-4">
                <input type="file" onChange={handleFileChange} className="mb-2" />
                <Button onClick={handleUpload} disabled={!file}>
                    Upload
                </Button>
                {uploadProgress > 0 && (
                    <div className="w-full max-w-md bg-gray-200 rounded-full dark:bg-gray-700">
                        <div
                            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                        >
                            {`${uploadProgress.toFixed(2)}%`}
                        </div>
                    </div>
                )}
                {downloadURL && (
                    <div className="flex flex-col items-center">
                        <p className="text-green-500 font-semibold">
                            File uploaded successfully!
                        </p>
                        <a
                            href={downloadURL}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-blue-500"
                        >
                            Download URL
                        </a>
                        <Button onClick={handleDownload} className="mt-2">
                            Download File
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
