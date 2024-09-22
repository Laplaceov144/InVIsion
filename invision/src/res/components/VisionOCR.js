import React, { useState } from 'react';
import axios from 'axios';
import { VISION_API_KEY } from '../auth';

const VisionOCR = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please upload an image');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = async () => {
      setIsProcessing(true);

      // Google Vision API requires image to be base64 encoded
      const imageBase64 = reader.result.split(',')[1]; // Remove base64 header

      const requestBody = {
        "requests": [
          {
            "image": {
              "content": imageBase64
            },
            "features": [
              {
                "type": "TEXT_DETECTION"
              }
            ]
          }
        ]
      };

      try {
        const response = await axios.post(
          `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
          requestBody
        );

        const annotations = response.data.responses[0].textAnnotations;
        const text = annotations.length ? annotations[0].description : 'No text found';
        //
        console.log(text); // #####
        //
        setExtractedText(text);
      } catch (error) {
        console.error('Error with OCR:', error);
        setExtractedText('Error occurred during processing.');
      } finally {
        setIsProcessing(false);
      }
    };
  };

  return (
    <div>
      <h1>InVision</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Upload Image'}
      </button>
      <div>
        <h3>Extracted Text:</h3>
        <p>{extractedText}</p>
      </div>
    </div>
  );
};

export default VisionOCR;
