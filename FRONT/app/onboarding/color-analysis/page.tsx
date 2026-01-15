// frontend/app/onboarding/color-analysis/page.tsx - WITH INLINE STYLES
"use client";

import { useState } from 'react';

export default function ColorAnalysisPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files).slice(0, 5));
      setError('');
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const analyzeColors = async () => {
    if (files.length < 2) {
      setError('Please upload at least 2 photos');
      return;
    }

    setIsAnalyzing(true);
    // Mock API call
    setTimeout(() => {
      setResult({
        season: "Spring",
        confidence_score: 0.92,
        flattering_colors: ["Peach", "Coral", "Warm Pink", "Golden Yellow", "Olive Green"],
        colors_to_avoid: ["Icy Blue", "Jet Black", "Pure White"],
        undertone: "warm",
        reasoning: "Your warm undertones and light features perfectly suit the Spring palette!"
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fdf2f8 100%)',
      padding: '2rem 1rem'
    },
    container: {
      maxWidth: '1024px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2.5rem',
      paddingTop: '2rem'
    },
    paletteIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(to right, #ec4899, #f472b6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '2rem',
      margin: '0 auto 1.5rem'
    },
    title: {
      background: 'linear-gradient(to right, #db2777, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      marginBottom: '2rem',
      border: '1px solid #fbcfe8',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    uploadArea: {
      border: '2px dashed #f9a8d4',
      borderRadius: '1rem',
      padding: '3rem',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    button: {
      background: 'linear-gradient(to right, #ec4899, #f472b6)',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.75rem',
      border: 'none',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    buttonDisabled: {
      background: '#e5e7eb',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    seasonCard: {
      background: 'linear-gradient(to right, #fdf2f8, #fce7f3)',
      padding: '1.5rem',
      borderRadius: '1rem',
      border: '1px solid #fbcfe8'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.paletteIcon}>🎨</div>
          <h1 style={styles.title}>Personal Color Analysis</h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Upload 2-5 photos to discover your seasonal color palette
          </p>
        </div>

        {/* Upload Card */}
        <div style={styles.card}>
          
          {/* Upload Area */}
          <div 
            style={styles.uploadArea}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) {
                setFiles(Array.from(e.dataTransfer.files).slice(0, 5));
              }
            }}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📤</div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              Click to select photos
            </p>
            <p style={{ color: '#6b7280' }}>
              or drag & drop 2-5 photos here
            </p>
            <p style={{ color: '#db2777', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              📸 JPG, PNG, or WebP • Max 5 photos
            </p>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
                Selected Photos ({files.length}/5)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                {files.map((file, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '0.5rem', border: '1px solid #fbcfe8' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      style={{
                        position: 'absolute',
                        top: '-0.5rem',
                        right: '-0.5rem',
                        background: '#f43f5e',
                        color: 'white',
                        borderRadius: '50%',
                        width: '1.5rem',
                        height: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '0.5rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Analyze Button */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <button
              onClick={analyzeColors}
              disabled={files.length < 2 || isAnalyzing}
              style={{
                ...styles.button,
                ...(files.length < 2 || isAnalyzing ? styles.buttonDisabled : {}),
                padding: '1rem 3rem',
                fontSize: '1.25rem'
              }}
            >
              {isAnalyzing ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ 
                    animation: 'spin 1s linear infinite',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    width: '1.25rem',
                    height: '1.25rem',
                    marginRight: '0.75rem'
                  }}></div>
                  Analyzing...
                </span>
              ) : '✨ Analyze My Colors'}
            </button>
            {files.length < 2 && files.length > 0 && (
              <p style={{ color: '#f43f5e', marginTop: '0.75rem' }}>
                Add {2 - files.length} more photo{2 - files.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={styles.card}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
              🎉 Your Results
            </h2>

            {/* Season Card */}
            <div style={styles.seasonCard}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Your Season</h3>
                  <p style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#111827', margin: '0.5rem 0' }}>{result.season}</p>
                  <p style={{ color: '#6b7280' }}>Confidence: {(result.confidence_score * 100).toFixed(0)}%</p>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ color: '#374151', fontStyle: 'italic' }}>"{result.reasoning}"</p>
                </div>
              </div>
            </div>

            {/* Color Palettes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Your Best Colors 💖</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {result.flattering_colors.map((color: string, index: number) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #fbcfe8'
                      }}
                    >
                      <div
                        style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          border: '2px solid white',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          backgroundColor: color === 'Peach' ? '#FDBA74' :
                                         color === 'Coral' ? '#FB7185' :
                                         color === 'Warm Pink' ? '#F9A8D4' :
                                         color === 'Golden Yellow' ? '#FBBF24' :
                                         color === 'Olive Green' ? '#84CC16' : '#F472B6'
                        }}
                      />
                      <span style={{ fontWeight: '500' }}>{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Avoid These Colors ⚠️</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {result.colors_to_avoid.map((color: string, index: number) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#f9fafb',
                        borderRadius: '0.5rem',
                        opacity: 0.7
                      }}
                    >
                      <div
                        style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          border: '2px solid white',
                          backgroundColor: color === 'Icy Blue' ? '#7DD3FC' :
                                         color === 'Jet Black' ? '#000000' :
                                         color === 'Pure White' ? '#FFFFFF' : '#9CA3AF'
                        }}
                      />
                      <span style={{ fontWeight: '500', textDecoration: 'line-through' }}>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Step */}
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #fbcfe8', textAlign: 'center' }}>
              <a
                href="/onboarding/wardrobe-scan"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Continue to Wardrobe Scan →
              </a>
            </div>
          </div>
        )}

        {/* Tips */}
        <div style={{
          marginTop: '2.5rem',
          background: 'linear-gradient(to right, #fdf2f8, #fce7f3)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid #fbcfe8'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>💡 Tips for Best Results</h3>
          <ul style={{ color: '#6b7280', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Use natural daylight near a window</li>
            <li style={{ marginBottom: '0.5rem' }}>Face the camera directly in at least one photo</li>
            <li style={{ marginBottom: '0.5rem' }}>Include photos in different colored outfits</li>
            <li>Remove makeup for one photo for accurate skin tone</li>
          </ul>
        </div>

        {/* Add CSS animation */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}