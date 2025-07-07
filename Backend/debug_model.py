import os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from efficientnet_pytorch import EfficientNet

# Global variables for model and device
model = None
device = None
class_names = ['Acne', 'Actinic Keratosis', 'Basal Cell Carcinoma', 'Eczemaa', 'Rosacea']

# Detection-based model architecture
class DetectionModel(nn.Module):
    def __init__(self, num_classes=5):
        super(DetectionModel, self).__init__()
        # Load pre-trained EfficientNet-B0
        self.efficientnet = EfficientNet.from_pretrained('efficientnet-b0')
        # Remove the final classification layer
        self.efficientnet._fc = nn.Identity()
        # Add detection head with sigmoid activation
        self.detection_head = nn.Sequential(
            nn.Linear(1280, 512),  # EfficientNet-B0 feature dimension is 1280
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes),
            nn.Sigmoid()  # Sigmoid for independent detection
        )
    
    def forward(self, x):
        features = self.efficientnet(x)
        detections = self.detection_head(features)
        return detections

def load_model():
    """Load the detection-based EfficientNet model"""
    global model, device
    
    # Set device (CPU for simplicity)
    device = torch.device("cpu")
    
    # Try to load detection model first
    model_path = os.path.join(os.path.dirname(__file__), '..', '#ML', 'DermaScan', 'disease_detector.pth')
    if os.path.exists(model_path):
        model = DetectionModel(num_classes=len(class_names))
        model.load_state_dict(torch.load(model_path, map_location=device))
        print(f"Loaded detection model from {model_path}")
    else:
        # Fallback to classification model if detection model doesn't exist
        print("Detection model not found, using classification model as fallback")
        model = EfficientNet.from_pretrained('efficientnet-b0')
        model._fc = nn.Linear(model._fc.in_features, len(class_names))
        
        classifier_path = os.path.join(os.path.dirname(__file__), '..', '#ML', 'DermaScan', 'disease_classifier.pth')
        if os.path.exists(classifier_path):
            model.load_state_dict(torch.load(classifier_path, map_location=device))
            print(f"Loaded classification model from {classifier_path}")
        else:
            raise FileNotFoundError(f"No model files found")
    
    model.to(device)
    model.eval()
    print("Model loaded successfully!")

def preprocess_image(image_path: str) -> torch.Tensor:
    """Preprocess the image to match the training pipeline"""
    # Open image with PIL
    image = Image.open(image_path).convert('RGB')
    
    # Apply the same transformations as in the notebook
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Apply transformations and add batch dimension
    image_tensor = transform(image).unsqueeze(0)
    
    return image_tensor

def is_detection_model(model) -> bool:
    """Check if the model is a detection model (has sigmoid output)"""
    return isinstance(model, DetectionModel)

def test_model_with_image(image_path: str):
    """Test the model with a specific image and print detailed results"""
    print(f"\n{'='*60}")
    print(f"Testing image: {image_path}")
    print(f"{'='*60}")
    
    try:
        # Preprocess the image
        image_tensor = preprocess_image(image_path)
        image_tensor = image_tensor.to(device)
        
        # Run inference
        with torch.no_grad():
            outputs = model(image_tensor)
            
            print(f"Raw model outputs: {outputs[0].cpu().numpy()}")
            
            if is_detection_model(model):
                # Detection model: outputs are already probabilities (0-1)
                detections = outputs[0].cpu().numpy()
                print(f"Model type: Detection Model (sigmoid outputs)")
            else:
                # Classification model: apply softmax to get probabilities
                detections = torch.softmax(outputs, dim=1)[0].cpu().numpy()
                print(f"Model type: Classification Model (softmax outputs)")
            
            print(f"Processed detections: {detections}")
        
        # Create results dictionary
        results = {}
        for i, class_name in enumerate(class_names):
            results[class_name] = float(detections[i])
        
        print(f"\nDetailed Results:")
        print(f"{'Condition':<25} {'Probability':<15} {'Above Threshold':<15}")
        print(f"{'-'*55}")
        
        detection_threshold = 0.5
        detected_conditions = []
        
        for i, (class_name, prob) in enumerate(zip(class_names, detections)):
            above_threshold = prob > detection_threshold
            print(f"{class_name:<25} {prob:<15.4f} {'Yes' if above_threshold else 'No':<15}")
            
            if above_threshold:
                detected_conditions.append({
                    'condition': class_name,
                    'probability': float(prob)
                })
        
        # Sort detected conditions by probability
        detected_conditions.sort(key=lambda x: x['probability'], reverse=True)
        
        print(f"\nDetection Threshold: {detection_threshold}")
        print(f"Max probability: {max(results.values()):.4f}")
        print(f"Min probability: {min(results.values()):.4f}")
        
        # Determine primary condition and confidence
        if detected_conditions:
            primary_condition = detected_conditions[0]['condition']
            confidence = detected_conditions[0]['probability']
            is_healthy = False
            print(f"\nRESULT: {primary_condition} detected with {confidence:.4f} confidence")
        else:
            primary_condition = "Healthy Skin"
            confidence = 1.0 - max(results.values())  # Confidence is inverse of max detection
            is_healthy = True
            print(f"\nRESULT: Healthy Skin detected with {confidence:.4f} confidence")
        
        print(f"Detected conditions: {[cond['condition'] for cond in detected_conditions]}")
        
    except Exception as e:
        print(f"Error during testing: {str(e)}")

def main():
    """Main function to test the model"""
    print("Loading model...")
    load_model()
    
    # Test with sample images if they exist
    test_images = [
        "test_healthy1.jpg",
        "test_healthy2.jpg", 
        "test_healthy3.jpg"
    ]
    
    # Check if test images exist in current directory
    existing_images = []
    for img in test_images:
        if os.path.exists(img):
            existing_images.append(img)
    
    if existing_images:
        print(f"Found {len(existing_images)} test images")
        for img in existing_images:
            test_model_with_image(img)
    else:
        print("No test images found. Please place test images in the Backend directory.")
        print("Expected files: test_healthy1.jpg, test_healthy2.jpg, test_healthy3.jpg")
        
        # Test with a dummy tensor to see model behavior
        print("\nTesting with dummy tensor...")
        dummy_tensor = torch.randn(1, 3, 224, 224).to(device)
        
        with torch.no_grad():
            outputs = model(dummy_tensor)
            print(f"Raw outputs shape: {outputs.shape}")
            print(f"Raw outputs: {outputs[0].cpu().numpy()}")
            
            if is_detection_model(model):
                detections = outputs[0].cpu().numpy()
                print(f"Detection model outputs: {detections}")
            else:
                detections = torch.softmax(outputs, dim=1)[0].cpu().numpy()
                print(f"Classification model outputs: {detections}")

if __name__ == "__main__":
    main() 