// frontend/app/onboarding/wardrobe-scan/page.tsx
"use client";

import { useState, useCallback } from 'react';

interface WardrobeItem {
  id: string;
  category: string;
  subcategory: string;
  primary_color: string;
  pattern: string;
  fit: string;
  formality_level: number;
  style_tags: string[];
  season: 'summer' | 'winter';
}

export default function WardrobeScanPage() {
  // Separate states for summer and winter items
  const [summerFiles, setSummerFiles] = useState<File[]>([]);
  const [winterFiles, setWinterFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedItems, setAnalyzedItems] = useState<WardrobeItem[]>([]);
  const [styleDNA, setStyleDNA] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'summer' | 'winter'>('summer');

  const handleSummerDrop = useCallback((acceptedFiles: File[]) => {
    setSummerFiles(prev => [...prev, ...acceptedFiles.slice(0, 10 - prev.length)]);
  }, []);

  const handleWinterDrop = useCallback((acceptedFiles: File[]) => {
    setWinterFiles(prev => [...prev, ...acceptedFiles.slice(0, 10 - prev.length)]);
  }, []);

  const removeSummerFile = (index: number) => {
    setSummerFiles(summerFiles.filter((_, i) => i !== index));
  };

  const removeWinterFile = (index: number) => {
    setWinterFiles(winterFiles.filter((_, i) => i !== index));
  };

  const analyzeWardrobe = async () => {
    const totalItems = summerFiles.length + winterFiles.length;
    if (totalItems < 10) {
      setError(`Please upload at least 10 items total (${10 - totalItems} more needed)`);
      return;
    }

    setIsAnalyzing(true);
    setError('');

    // Mock analysis for summer items
    const summerItems: WardrobeItem[] = summerFiles.map((file, index) => ({
      id: `summer-${index}`,
      category: ['top', 'bottom', 'dress'][index % 3],
      subcategory: ['t-shirt', 'jeans', 'midi-dress'][index % 3],
      primary_color: ['navy blue', 'white', 'pastel pink'][index % 3],
      pattern: 'solid',
      fit: ['oversized', 'fitted', 'regular'][index % 3],
      formality_level: [2, 5, 7][index % 3],
      style_tags: ['minimalist', 'casual'],
      season: 'summer'
    }));

    // Mock analysis for winter items
    const winterItems: WardrobeItem[] = winterFiles.map((file, index) => ({
      id: `winter-${index}`,
      category: ['top', 'bottom', 'outerwear'][index % 3],
      subcategory: ['sweater', 'trousers', 'coat'][index % 3],
      primary_color: ['black', 'grey', 'burgundy'][index % 3],
      pattern: 'solid',
      fit: ['fitted', 'regular', 'oversized'][index % 3],
      formality_level: [4, 6, 8][index % 3],
      style_tags: ['classic', 'minimalist'],
      season: 'winter'
    }));

    const allItems = [...summerItems, ...winterItems];
    setAnalyzedItems(allItems);

    // Generate mock Style DNA
    setTimeout(() => {
      setStyleDNA({
        dominant_aesthetics: ["Minimalist", "Classic"],
        preferred_fit: "Mixed",
        color_preferences: ["Navy Blue", "Black", "White", "Grey"],
        pattern_affinity: "Low",
        formality_range: "Casual to Smart-Casual",
        risk_taking_score: 3,
        missing_categories: ["Statement Jewelry", "Evening Wear"],
        style_summary: "You prefer clean, minimalist basics in neutral colors. Your style is practical yet polished with a focus on comfort and versatility.",
        top_style_tags: ["minimalist", "classic", "neutral", "comfortable", "versatile"]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fdf2f8 100%)',
      padding: '2rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '3rem',
      paddingTop: '1rem'
    },
    titleIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(to right, #ec4899, #f472b6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '2.5rem',
      margin: '0 auto 1rem',
      boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.3)'
    },
    title: {
      background: 'linear-gradient(to right, #db2777, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: '3.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#6b7280',
      maxWidth: '800px',
      margin: '0 auto 2rem'
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem'
    },
    '@media (min-width: 1024px)': {
      mainContent: {
        gridTemplateColumns: '1fr 1fr'
      }
    },
    section: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '1px solid #fbcfe8',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    tabContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    tab: {
      flex: 1,
      padding: '1rem',
      background: 'transparent',
      border: '2px solid #f9a8d4',
      borderRadius: '0.75rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center' as const
    },
    activeTab: {
      background: 'linear-gradient(to right, #ec4899, #f472b6)',
      color: 'white',
      borderColor: 'transparent'
    },
    uploadArea: {
      border: '3px dashed #f9a8d4',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: '#fdf2f8'
    },
    uploadAreaHover: {
      borderColor: '#ec4899',
      background: '#fce7f3'
    },
    uploadIcon: {
      fontSize: '3rem',
      marginBottom: '1rem'
    },
    seasonTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    seasonSubtitle: {
      color: '#db2777',
      marginBottom: '1rem'
    },
    filesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    fileCard: {
      position: 'relative' as const,
      aspectRatio: '1/1',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      border: '2px solid #fbcfe8'
    },
    fileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const
    },
    removeButton: {
      position: 'absolute' as const,
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
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    counter: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '0.5rem',
      textAlign: 'center' as const
    },
    analyzeButton: {
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(to right, #ec4899, #f472b6)',
      color: 'white',
      borderRadius: '1rem',
      border: 'none',
      fontSize: '1.25rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1.5rem'
    },
    analyzeButtonDisabled: {
      background: '#e5e7eb',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    progressContainer: {
      background: 'linear-gradient(to right, #dbeafe, #dbeafe)',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginTop: '1.5rem'
    },
    progressText: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
      color: '#1e40af',
      fontWeight: '600'
    },
    progressBar: {
      width: '100%',
      height: '0.5rem',
      background: '#bfdbfe',
      borderRadius: '0.25rem',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
      transition: 'width 0.3s ease'
    },
    analyzedItems: {
      maxHeight: '300px',
      overflowY: 'auto' as const,
      marginTop: '1.5rem'
    },
    itemCard: {
      background: '#f9fafb',
      padding: '1rem',
      borderRadius: '0.75rem',
      marginBottom: '0.75rem',
      border: '1px solid #f3f4f6'
    },
    itemHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.5rem'
    },
    itemName: {
      fontWeight: '600',
      color: '#1f2937'
    },
    itemDetails: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    tag: {
      padding: '0.25rem 0.5rem',
      background: '#e0e7ff',
      color: '#3730a3',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    styleDNACard: {
      background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #fbcfe8'
    },
    dnaHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    checkIcon: {
      fontSize: '2rem',
      color: '#10b981'
    },
    dnaTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    dnaSection: {
      marginBottom: '2rem'
    },
    dnaSubtitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    aestheticsContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.75rem'
    },
    aestheticTag: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(to right, #fce7f3, #fbcfe8)',
      color: '#9d174d',
      borderRadius: '9999px',
      fontWeight: '600',
      fontSize: '1.125rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'white',
      padding: '1rem',
      borderRadius: '0.75rem',
      border: '1px solid #f3f4f6'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.25rem'
    },
    statValue: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    styleTagsContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.5rem'
    },
    styleTag: {
      padding: '0.5rem 1rem',
      background: '#dbeafe',
      color: '#1e40af',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    nextButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 2rem',
      background: 'linear-gradient(to right, #10b981, #059669)',
      color: 'white',
      borderRadius: '1rem',
      border: 'none',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    tipsContainer: {
      background: 'linear-gradient(to right, #fdf2f8, #fce7f3)',
      borderRadius: '1rem',
      padding: '2rem',
      marginTop: '2rem',
      border: '1px solid #fbcfe8'
    },
    tipsTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    tipsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem'
    },
    '@media (min-width: 768px)': {
      tipsGrid: {
        gridTemplateColumns: '1fr 1fr'
      }
    },
    tipColumn: {
      background: 'rgba(255, 255, 255, 0.7)',
      padding: '1.5rem',
      borderRadius: '0.75rem'
    },
    tipList: {
      paddingLeft: '1.5rem',
      color: '#4b5563'
    },
    tipItem: {
      marginBottom: '0.75rem'
    },
    tipIcon: {
      color: '#ec4899',
      marginRight: '0.5rem'
    }
  };

  const currentFiles = activeTab === 'summer' ? summerFiles : winterFiles;
  const currentRemoveFn = activeTab === 'summer' ? removeSummerFile : removeWinterFile;
  const currentSeason = activeTab === 'summer' ? 'Summer ☀️' : 'Winter ❄️';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleIcon}>👗</div>
          <h1 style={styles.title}>Wardrobe Style Analysis</h1>
          <p style={styles.subtitle}>
            Upload photos of your clothing items (minimum 5 tops & 5 bottoms recommended for each season)
          </p>
        </div>

        <div style={styles.mainContent}>
          {/* Left Column: Upload & Analysis */}
          <div>
            <div style={styles.section}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                Upload Clothing Items
              </h2>
              
              {/* Season Tabs */}
              <div style={styles.tabContainer}>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'summer' ? styles.activeTab : {})
                  }}
                  onClick={() => setActiveTab('summer')}
                >
                  ☀️ Summer Clothing
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'winter' ? styles.activeTab : {})
                  }}
                  onClick={() => setActiveTab('winter')}
                >
                  ❄️ Winter Clothing
                </button>
              </div>

              {/* Upload Area */}
              <div
                style={styles.uploadArea}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    const files = Array.from(e.dataTransfer.files);
                    if (activeTab === 'summer') {
                      handleSummerDrop(files);
                    } else {
                      handleWinterDrop(files);
                    }
                  }
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.multiple = true;
                  input.onchange = (e) => {
                    const files = Array.from((e.target as HTMLInputElement).files || []);
                    if (activeTab === 'summer') {
                      handleSummerDrop(files);
                    } else {
                      handleWinterDrop(files);
                    }
                  };
                  input.click();
                }}
              >
                <div style={styles.uploadIcon}>📤</div>
                <div style={styles.seasonTitle}>{currentSeason}</div>
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  Drag & drop photos here
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  or click to select photos (max 10 items per season)
                </p>
                <p style={styles.counter}>
                  {currentFiles.length}/10 items uploaded
                </p>
              </div>

              {/* Files Preview */}
              {currentFiles.length > 0 && (
                <div style={styles.filesGrid}>
                  {currentFiles.map((file, index) => (
                    <div key={index} style={styles.fileCard}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        style={styles.fileImage}
                      />
                      <button
                        onClick={() => currentRemoveFn(index)}
                        style={styles.removeButton}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Season Counters */}
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.75rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0ea5e9' }}>{summerFiles.length}</div>
                  <div style={{ fontSize: '0.875rem', color: '#0369a1' }}>Summer Items</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#fef2f2', borderRadius: '0.75rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{winterFiles.length}</div>
                  <div style={{ fontSize: '0.875rem', color: '#b91c1c' }}>Winter Items</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.75rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{summerFiles.length + winterFiles.length}</div>
                  <div style={{ fontSize: '0.875rem', color: '#047857' }}>Total Items</div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '0.5rem' }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={analyzeWardrobe}
                disabled={isAnalyzing || (summerFiles.length + winterFiles.length) < 10}
                style={{
                  ...styles.analyzeButton,
                  ...((isAnalyzing || (summerFiles.length + winterFiles.length) < 10) ? styles.analyzeButtonDisabled : {})
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
                    Analyzing Your Wardrobe...
                  </span>
                ) : (
                  '✨ Analyze My Wardrobe'
                )}
              </button>

              {/* Analyzed Items */}
              {analyzedItems.length > 0 && (
                <div style={styles.analyzedItems}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                    Analyzed Items ({analyzedItems.length})
                  </h3>
                  {analyzedItems.slice(0, 5).map((item, index) => (
                    <div key={index} style={styles.itemCard}>
                      <div style={styles.itemHeader}>
                        <div>
                          <div style={styles.itemName}>{item.subcategory}</div>
                          <div style={styles.itemDetails}>
                            {item.category} • {item.primary_color} • {item.season}
                          </div>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: item.season === 'summer' ? '#fef3c7' : '#dbeafe',
                          color: item.season === 'summer' ? '#92400e' : '#1e40af',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {item.season}
                        </span>
                      </div>
                      <div style={styles.tagsContainer}>
                        <span style={styles.tag}>{item.fit} fit</span>
                        <span style={styles.tag}>Formality: {item.formality_level}/10</span>
                        {item.style_tags.slice(0, 2).map((tag, i) => (
                          <span key={i} style={{...styles.tag, background: '#e0e7ff', color: '#3730a3'}}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div style={styles.tipsContainer}>
              <h3 style={styles.tipsTitle}>💡 For Best Wardrobe Analysis</h3>
              <div style={styles.tipsGrid}>
                <div style={styles.tipColumn}>
                  <ul style={styles.tipList}>
                    <li style={styles.tipItem}>
                      <span style={styles.tipIcon}>•</span>
                      <strong>Lay items flat</strong> on a plain background
                    </li>
                    <li style={styles.tipItem}>
                      <span style={styles.tipIcon}>•</span>
                      Ensure <strong>good lighting</strong>, no shadows
                    </li>
                    <li style={styles.tipItem}>
                      <span style={styles.tipIcon}>•</span>
                      Photograph <strong>one item at a time</strong>
                    </li>
                    <li style={styles.tipItem}>
                      <span style={styles.tipIcon}>•</span>
                      Include <strong>both front and back</strong> if needed
                    </li>
                  </ul>
                </div>
                <div style={styles.tipColumn}>
                  <ul style={styles.tipList}>
                    <li style={styles.tipItem}>
                      <span style={styles.tipIcon}>•</span>
                      Start with <strong>5 tops and 5 bottoms</strong> for each season
                    </li>
                    <li style={styles.tipItem}>
                      <span style={styles.tipIcon}>•</span>
                      Include <strong>different styles and occasions</strong>
                    </li>
                    <li style={styles.tipItem}>
                      <span style={styles.tipIcon}>•</span>
                      Show <strong>patterns and textures</strong> clearly
                    </li>
                    <li style={styles.tipItem}>
                      <span style={styles.tipIcon}>•</span>
                      Remove accessories/hangers from photos
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Style DNA Results */}
          <div>
            {styleDNA ? (
              <div style={styles.section}>
                <div style={styles.dnaHeader}>
                  <div style={styles.checkIcon}>✅</div>
                  <h2 style={styles.dnaTitle}>Your Style DNA</h2>
                </div>

                {/* Summary Card */}
                <div style={styles.dnaSection}>
                  <h3 style={styles.dnaSubtitle}>Style Summary</h3>
                  <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: '1.6' }}>
                    {styleDNA.style_summary}
                  </p>
                </div>

                {/* Dominant Aesthetics */}
                <div style={styles.dnaSection}>
                  <h3 style={styles.dnaSubtitle}>Dominant Aesthetics</h3>
                  <div style={styles.aestheticsContainer}>
                    {styleDNA.dominant_aesthetics.map((aesthetic: string, index: number) => (
                      <span key={index} style={styles.aestheticTag}>
                        {aesthetic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Preferred Fit</div>
                    <div style={styles.statValue}>{styleDNA.preferred_fit}</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Pattern Affinity</div>
                    <div style={styles.statValue}>{styleDNA.pattern_affinity}</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Formality Range</div>
                    <div style={styles.statValue}>{styleDNA.formality_range}</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statLabel}>Risk Taking</div>
                    <div style={styles.statValue}>{styleDNA.risk_taking_score}/10</div>
                  </div>
                </div>

                {/* Color Preferences */}
                <div style={styles.dnaSection}>
                  <h3 style={styles.dnaSubtitle}>🎨 Color Preferences</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {styleDNA.color_preferences.map((color: string, index: number) => (
                      <span key={index} style={{
                        padding: '0.5rem 1rem',
                        background: '#f3f4f6',
                        color: '#1f2937',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Style Tags */}
                <div style={styles.dnaSection}>
                  <h3 style={styles.dnaSubtitle}>🏷️ Your Style Tags</h3>
                  <div style={styles.styleTagsContainer}>
                    {styleDNA.top_style_tags.map((tag: string, index: number) => (
                      <span key={index} style={styles.styleTag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Next Step */}
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                  <a
                    href="/dashboard"
                    style={styles.nextButton}
                  >
                    Go to Your Dashboard →
                  </a>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div style={styles.section}>
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👕</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Your Style Profile Awaits
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    Upload and analyze your wardrobe to discover your unique Style DNA
                  </p>
                </div>
              </div>
            )}
          </div>
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