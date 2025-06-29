
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, ArrowUp, FileImage } from "lucide-react";

const DermaScan = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisComplete(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Mock analysis results
  const analysisResults = {
    overall: "Healthy Skin Detected",
    confidence: 94,
    findings: [
      { condition: "Normal Skin", probability: 94, severity: "Normal" },
      { condition: "Mild Dryness", probability: 12, severity: "Minor" },
      { condition: "Age Spots", probability: 8, severity: "Minimal" }
    ],
    recommendations: [
      "Use a daily moisturizer with SPF protection",
      "Consider using a gentle exfoliating scrub twice weekly",
      "Stay hydrated and maintain a healthy diet"
    ]
  };

  const productRecommendations = [
    {
      name: "Hydrating Daily Moisturizer",
      brand: "CeraVe",
      rating: 4.8,
      price: "$12.99"
    },
    {
      name: "Gentle Foaming Cleanser",
      brand: "Neutrogena",
      rating: 4.6,
      price: "$8.99"
    },
    {
      name: "Vitamin C Serum",
      brand: "The Ordinary",
      rating: 4.7,
      price: "$15.50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 medical-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MedicImage</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-8 h-8 rounded-full bg-medical-teal/10 hover:bg-medical-teal/20"
              >
                <User className="w-4 h-4 text-medical-teal" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DermaScan - AI Skin Analysis
          </h1>
          <p className="text-gray-600">
            Upload or capture an image for comprehensive skin analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="medical-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Upload Image</CardTitle>
              <CardDescription>
                Select a clear, well-lit image of the skin area you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!selectedImage ? (
                  <div 
                    className="border-2 border-dashed border-medical-teal/30 rounded-lg p-8 text-center hover:border-medical-teal/60 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileImage className="w-16 h-16 text-medical-teal/40 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={selectedImage} 
                      alt="Selected for analysis" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setSelectedImage(null)}
                    >
                      Change Image
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 border-medical-teal text-medical-teal hover:bg-medical-teal hover:text-white"
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                
                {selectedImage && !isAnalyzing && !analysisComplete && (
                  <Button 
                    onClick={handleAnalyze}
                    className="w-full medical-gradient text-white glow-button"
                    size="lg"
                  >
                    Start AI Analysis
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="medical-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Analysis Results</CardTitle>
              <CardDescription>
                AI-powered skin analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedImage && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-medical-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <p className="text-gray-600">Upload an image to begin analysis</p>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-medical-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <span className="text-2xl">🧬</span>
                    </div>
                    <p className="text-gray-900 font-semibold mb-2">Analyzing your image...</p>
                    <p className="text-gray-600 text-sm mb-4">Our AI is examining skin patterns and conditions</p>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-center text-sm text-gray-600">{progress}% Complete</p>
                </div>
              )}
              
              {analysisComplete && (
                <div className="space-y-6">
                  {/* Overall Result */}
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      {analysisResults.overall}
                    </h3>
                    <p className="text-green-600">
                      Confidence: {analysisResults.confidence}%
                    </p>
                  </div>
                  
                  {/* Detailed Findings */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Detailed Analysis</h4>
                    <div className="space-y-2">
                      {analysisResults.findings.map((finding, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{finding.condition}</span>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              finding.severity === "Normal" ? "bg-green-100 text-green-800" :
                              finding.severity === "Minor" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {finding.severity}
                            </span>
                          </div>
                          <span className="text-gray-600">{finding.probability}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-medical-teal mr-2">•</span>
                          <span className="text-gray-600">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Recommendations */}
        {analysisComplete && (
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {productRecommendations.map((product, index) => (
                <Card key={index} className="medical-card hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{product.name}</CardTitle>
                    <CardDescription className="text-gray-600">{product.brand}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-600 ml-1">{product.rating}</span>
                      </div>
                      <span className="font-semibold text-medical-teal">{product.price}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-medical-teal text-medical-teal hover:bg-medical-teal hover:text-white"
                    >
                      View Product
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DermaScan;
