import  { useState, useRef } from 'react';
import axios from 'axios';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const fileInputRef = useRef();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        const fileURL = URL.createObjectURL(event.target.files[0]);
        setImageUrl(fileURL);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h1>Upload Photo</h1>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                <button type="submit">Upload</button>
            </form>
            {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: '300px', marginTop: '20px' }} />}
        </div>
    );
};

export default ImageUpload;