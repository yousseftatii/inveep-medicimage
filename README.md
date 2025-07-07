# MedicImage - AI Skin Disease Classifier

A web application that uses AI to classify skin conditions from uploaded images. Built with FastAPI backend and React frontend.

## ⚠️ Important Disclaimer

**This application is for educational and informational purposes only.**
- The AI classifier provides approximations based on image analysis
- This tool is **NOT a substitute** for professional medical diagnosis
- Always consult with a qualified dermatologist for accurate diagnosis
- Results may vary and should not be used for self-diagnosis

## Features

- **AI-Powered Classification**: Uses EfficientNet-B0 model trained on skin disease datasets
- **Image Upload & Cropping**: Upload images and crop specific areas for analysis
- **Condition Probabilities**: Shows percentage probabilities for all 5 skin conditions
- **Professional Recommendations**: Provides general skincare recommendations based on results
- **Product Suggestions**: Recommends relevant skincare products
- **Medical Report Generation**: Generate and download professional PDF reports
- **Responsive Design**: Modern, medical-themed UI that works on all devices

## Supported Conditions

The AI model can classify the following skin conditions:
1. **Acne** - Common skin condition with pimples and inflammation
2. **Actinic Keratosis** - Precancerous skin growths from sun damage
3. **Basal Cell Carcinoma** - Most common type of skin cancer
4. **Eczema** - Inflammatory skin condition causing itchiness and rashes
5. **Rosacea** - Chronic skin condition causing facial redness and visible blood vessels

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PyTorch** - Deep learning framework
- **EfficientNet-B0** - Pre-trained CNN for image classification
- **PIL/Pillow** - Image processing
- **Pydantic** - Data validation
- **ReportLab** - PDF generation

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **React Router** - Navigation
- **React Image Crop** - Image cropping functionality

## Project Structure

```
inveep-MEDICIMAGE/
├── Backend/
│   ├── app.py                 # FastAPI application
│   ├── report_generator.py    # PDF report generator
│   ├── test_api.py           # API testing script
│   └── requirements.txt      # Python dependencies
├── Frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── ...
│   ├── package.json
│   └── ...
├── #ML/
│   └── DermaScan/
│       ├── disease_classifier.pth  # Trained classification model
│       ├── ML-DermaScan.ipynb     # Training notebook
│       └── DATA/                  # Training dataset
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server:**
   ```bash
   python app.py
   ```
   
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## Usage

1. **Upload Image**: Click the upload area or drag and drop an image
2. **Crop Image**: Use the cropping tool to focus on the specific skin area
3. **Analyze**: Click "Start AI Analysis" to process the image
4. **View Results**: See condition probabilities and recommendations
5. **Generate Report**: Click "Generate Medical Report" to download a PDF report
6. **Get Recommendations**: Review skincare advice and product suggestions

## Medical Report Feature

The application includes a comprehensive medical report generation feature:

### Report Contents
- **Company Branding**: Inveep Inc, MedicImage, DermaScan
- **Patient Information**: Name, date, time, analysis type
- **Analyzed Image**: The uploaded and cropped image
- **Analysis Results**: All condition probabilities with confidence levels
- **Recommendations**: Personalized skincare advice
- **Product Suggestions**: Recommended products with ratings and prices
- **Medical Disclaimer**: Important legal and medical disclaimers

### Report Format
- **Format**: Professional PDF document
- **Layout**: Single portrait page
- **Styling**: Medical-themed with company branding
- **Filename**: `medical_report_[PatientName]_[Timestamp].pdf`

### How to Generate Reports
1. Complete an image analysis
2. Click the "Generate Medical Report" button
3. The PDF will automatically download to your device
4. Reports include all analysis data and recommendations

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/model-info` - Get model information
- `POST /api/classify` - Classify skin condition from image
- `POST /api/generate-report` - Generate medical report PDF

### Classification Response Format

```json
{
  "success": true,
  "predictions": {
    "Acne": 0.15,
    "Actinic Keratosis": 0.05,
    "Basal Cell Carcinoma": 0.02,
    "Eczemaa": 0.75,
    "Rosacea": 0.03
  },
  "primary_condition": "Eczemaa",
  "confidence": 0.75,
  "class_names": ["Acne", "Actinic Keratosis", "Basal Cell Carcinoma", "Eczemaa", "Rosacea"]
}
```

### Report Generation Request Format

```json
{
  "image": "base64_encoded_image_data",
  "analysis_data": {
    "predictions": {...},
    "primary_condition": "Eczemaa",
    "confidence": 0.75,
    "recommendations": [...],
    "products": [...]
  },
  "patient_name": "Mr Ramzi Houidi"
}
```

## Testing

### Backend Testing
```bash
cd Backend
python test_api.py
```

This will test:
- Health check endpoint
- Model information endpoint
- Image classification
- Report generation
- Real image processing (if available)

### Frontend Testing
```bash
cd Frontend
npm test
```

## Model Information

- **Architecture**: EfficientNet-B0
- **Input Size**: 224x224 pixels
- **Output**: 5-class classification probabilities
- **Training**: Fine-tuned on skin disease dataset
- **Framework**: PyTorch

## Medical Disclaimer

This application is designed for educational purposes and general information only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with questions about medical conditions.

The AI model provides probability scores for different skin conditions, but these are approximations and should not be considered definitive diagnoses. Medical decisions should always be made in consultation with licensed healthcare professionals.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. Please ensure compliance with medical device regulations if used in clinical settings.

## Support

For technical support or questions about the application, please open an issue in the repository.

---

**Remember**: This tool is for educational purposes only. Always consult with healthcare professionals for medical concerns. 