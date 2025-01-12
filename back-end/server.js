const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const faceapi = require('face-api.js');
const canvas = require('canvas');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    },
});

const upload = multer({ storage });

// Load face-api.js models
async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
}

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    // Load models if not already loaded
    await loadModels();

    // Load image for face detection
    const imgPath = path.join(__dirname, req.file.path);
    const img = await canvas.loadImage(imgPath);
    
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    
    // Process detections as needed
    console.log(detections);

    res.json({ message: 'File uploaded successfully!', detections });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});