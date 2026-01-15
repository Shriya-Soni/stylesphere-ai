from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai  # CHANGED THIS LINE
import base64
import json
from typing import List, Optional
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from supabase import create_client, Client
import uuid

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="StyleSphere AI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY")) 
model = genai.GenerativeModel('gemini-1.5-pro') 

# Initialize Supabase
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# ==================== MODELS ====================
class ColorAnalysisRequest(BaseModel):
    user_id: str

class ColorAnalysisResponse(BaseModel):
    season: str
    confidence_score: float
    flattering_colors: List[str]
    colors_to_avoid: List[str]
    undertone: str
    reasoning: str

class WardrobeItemRequest(BaseModel):
    user_id: str
    category_hint: Optional[str] = None

class WardrobeItemResponse(BaseModel):
    category: str
    subcategory: str
    primary_color: str
    secondary_colors: List[str]
    pattern: str
    fit: str
    formality_level: int
    seasonality: List[str]
    style_tags: List[str]
    description: str

class StyleDNARequest(BaseModel):
    user_id: str
    item_ids: List[str]

class StyleDNAResponse(BaseModel):
    dominant_aesthetics: List[str]
    preferred_fit: str
    color_preferences: List[str]
    pattern_affinity: str
    formality_range: str
    risk_taking_score: int
    missing_categories: List[str]
    style_summary: str
    top_style_tags: List[str]

# ==================== UTILITY FUNCTIONS ====================
def encode_image_to_base64(image_file: UploadFile) -> str:
    """Convert uploaded image to base64"""
    image_bytes = image_file.file.read()
    return base64.b64encode(image_bytes).decode('utf-8')

def parse_gemini_json_response(response_text: str) -> dict:
    """Parse Gemini response, handling potential markdown formatting"""
    try:
        # Try to find JSON in response (Gemini sometimes wraps it in ```json ```)
        if '```json' in response_text:
            json_str = response_text.split('```json')[1].split('```')[0].strip()
        elif '```' in response_text:
            json_str = response_text.split('```')[1].split('```')[0].strip()
        else:
            json_str = response_text.strip()
        
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Response was: {response_text}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response")

# ==================== API ENDPOINTS ====================

# 1. COLOR ANALYSIS ENDPOINT
@app.post("/api/analyze-colors", response_model=ColorAnalysisResponse)
async def analyze_colors(
    user_id: str,
    files: List[UploadFile] = File(...)
):
    """
    Analyze user's photos for color season analysis
    Requires: 2-5 photos of the user
    """
    if len(files) < 2 or len(files) > 5:
        raise HTTPException(
            status_code=400, 
            detail="Please upload between 2 and 5 photos"
        )
    
    try:
        # Prepare images for Gemini
        image_parts = []
        for file in files:
            if file.content_type not in ['image/jpeg', 'image/png', 'image/webp']:
                raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}")
            
            encoded_image = encode_image_to_base64(file)
            image_parts.append({
                "mime_type": file.content_type,
                "data": encoded_image
            })
        
        # Prepare the prompt
        prompt = """
        You are a professional personal stylist specializing in color analysis.
        
        Analyze these photos of the same person to determine their seasonal color palette.
        
        CRITERIA:
        1. Skin undertone (cool, warm, neutral) - check veins on wrist (blue/purple = cool, green = warm, both = neutral)
        2. Eye color and contrast against skin
        3. Natural hair color in natural light
        4. How their skin reacts to different colors in the photos
        
        SEASONAL ANALYSIS GUIDE:
        - WINTER: Cool undertone, high contrast, looks great in jewel tones, pure white, black
        - SUMMER: Cool undertone, low contrast, looks great in muted, cool pastels
        - SPRING: Warm undertone, light/clear features, looks great in warm pastels, peach, coral
        - AUTUMN: Warm undertone, rich/earthy features, looks great in olive, mustard, burnt orange
        
        RETURN EXACT JSON FORMAT:
        {
            "season": "Winter|Summer|Spring|Autumn",
            "confidence_score": 0.95,
            "flattering_colors": ["emerald green", "sapphire blue", "berry red", "pure white", "black"],
            "colors_to_avoid": ["pastel orange", "golden yellow", "warm beige"],
            "undertone": "cool|warm|neutral",
            "reasoning": "Brief explanation based on visual cues (2-3 sentences)"
        }
        
        Make flattering colors specific (e.g., "emerald green" not just "green").
        Be honest about confidence. If unsure, use lower confidence_score.
        """
        
        # Call Gemini
        response = model.generate_content([prompt] + image_parts)
        result = parse_gemini_json_response(response.text)
        
        # Validate response structure
        required_fields = ["season", "confidence_score", "flattering_colors", 
                          "colors_to_avoid", "undertone", "reasoning"]
        for field in required_fields:
            if field not in result:
                raise HTTPException(status_code=500, detail=f"AI response missing field: {field}")
        
        # Store in database
        supabase.table("color_analysis").insert({
            "user_id": user_id,
            "season": result["season"],
            "confidence_score": result["confidence_score"],
            "flattering_colors": result["flattering_colors"],
            "colors_to_avoid": result["colors_to_avoid"],
            "undertone": result["undertone"],
            "reasoning": result["reasoning"]
        }).execute()
        
        return result
        
    except Exception as e:
        print(f"Error in color analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# 2. WARDROBE ITEM ANALYSIS ENDPOINT
@app.post("/api/analyze-wardrobe-item", response_model=WardrobeItemResponse)
async def analyze_wardrobe_item(
    user_id: str,
    category_hint: Optional[str] = None,
    file: UploadFile = File(...)
):
    """
    Analyze a single clothing item from user's wardrobe
    """
    try:
        # Validate image
        if file.content_type not in ['image/jpeg', 'image/png', 'image/webp']:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        encoded_image = encode_image_to_base64(file)
        
        # Prepare prompt based on category hint
        category_context = f"The user says this might be a {category_hint}." if category_hint else ""
        
        prompt = f"""
        You are a fashion expert analyzing a clothing item.
        {category_context}
        
        Analyze this clothing item image thoroughly.
        
        RETURN EXACT JSON FORMAT:
        {{
            "category": "top|bottom|dress|outerwear|shoes",
            "subcategory": "t-shirt|blouse|jeans|trousers|midi-dress|blazer|sneakers|heels",
            "primary_color": "specific color name like navy blue, crimson red, olive green",
            "secondary_colors": ["color1", "color2"],
            "pattern": "solid|striped|floral|checkered|graphic|print|animal-print",
            "fit": "oversized|fitted|loose|baggy|regular|bodycon",
            "formality_level": 1-10,
            "seasonality": ["summer", "winter", "all-season"],
            "style_tags": ["minimalist", "streetwear", "bohemian", "classic", "edgy", "preppy", "athleisure"],
            "description": "One-line stylish description"
        }}
        
        GUIDELINES:
        - Formality: 1=casual (t-shirt), 10=formal (evening gown)
        - Seasonality: Items can belong to multiple seasons
        - Style tags: Choose 2-4 relevant tags
        - Be specific with colors (use fashion industry terms)
        - If uncertain about fit, estimate based on silhouette
        """
        
        response = model.generate_content([prompt, {
            "mime_type": file.content_type,
            "data": encoded_image
        }])
        
        result = parse_gemini_json_response(response.text)
        
        # Upload image to Supabase Storage and get URL
        # (You'll need to set up storage in Supabase first)
        # For now, we'll store the analysis without image URL
        
        # Store in database
        db_result = supabase.table("wardrobe_items").insert({
            "user_id": user_id,
            "category": result["category"],
            "subcategory": result["subcategory"],
            "primary_color": result["primary_color"],
            "secondary_colors": result.get("secondary_colors", []),
            "pattern": result["pattern"],
            "fit": result["fit"],
            "formality_level": result["formality_level"],
            "seasonality": result["seasonality"],
            "style_tags": result["style_tags"],
            "description": result["description"]
        }).execute()
        
        return result
        
    except Exception as e:
        print(f"Error in wardrobe analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Item analysis failed: {str(e)}")

# 3. GENERATE STYLE DNA ENDPOINT
@app.post("/api/generate-style-dna", response_model=StyleDNAResponse)
async def generate_style_dna(request: StyleDNARequest):
    """
    Generate overall style profile from all wardrobe items
    """
    try:
        # Fetch user's wardrobe items from database
        response = supabase.table("wardrobe_items")\
            .select("*")\
            .eq("user_id", request.user_id)\
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="No wardrobe items found")
        
        wardrobe_items = response.data
        
        # Prepare data for Gemini
        items_summary = []
        for item in wardrobe_items:
            items_summary.append({
                "category": item["category"],
                "subcategory": item["subcategory"],
                "primary_color": item["primary_color"],
                "pattern": item["pattern"],
                "fit": item["fit"],
                "formality_level": item["formality_level"],
                "style_tags": item["style_tags"]
            })
        
        items_json = json.dumps(items_summary, indent=2)
        
        prompt = f"""
        You are a personal stylist with years of experience in the fashion industry, analyzing a client's entire wardrobe to understand their style DNA and the choices they make when it comes to dressing up based on the type of event.
        
        WARDROBE ITEMS:
        {items_json}
        
        Analyze this wardrobe to understand the person's style personality.
        
        RETURN EXACT JSON FORMAT:
        {{
            "dominant_aesthetics": ["aesthetic1", "aesthetic2"],
            "preferred_fit": "oversized|fitted|mixed",
            "color_preferences": ["color1", "color2", "color3"],
            "pattern_affinity": "low|medium|high",
            "formality_range": "casual|smart-casual|formal|mixed",
            "risk_taking_score": 1-10,
            "missing_categories": ["category1", "category2"],
            "style_summary": "Two sentence summary of their style personality",
            "top_style_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
        }}
        
        ANALYSIS INSTRUCTIONS:
        1. Dominant aesthetics: Based on recurring style_tags
        2. Preferred fit: What fit appears most often?
        3. Color preferences: Most common colors in wardrobe
        4. Pattern affinity: How many items have patterns? (>50%=high, <20%=low)
        5. Formality range: Based on average formality_level
        6. Risk taking: 1=very safe/classic, 10=experimental/trendy
        7. Missing categories: What common clothing categories are NOT in their wardrobe?
        8. Style summary: Be insightful and specific
        9. Top style tags: 5 most relevant tags overall
        
        Be honest. If their wardrobe is minimal, say so.
        If they have conflicting styles, note they're experimental.
        """
        
        response = model.generate_content([prompt])
        result = parse_gemini_json_response(response.text)
        
        # Store in database
        supabase.table("style_dna").insert({
            "user_id": request.user_id,
            "dominant_aesthetics": result["dominant_aesthetics"],
            "preferred_fit": result["preferred_fit"],
            "color_preferences": result["color_preferences"],
            "pattern_affinity": result["pattern_affinity"],
            "formality_range": result["formality_range"],
            "risk_taking_score": result["risk_taking_score"],
            "missing_categories": result["missing_categories"],
            "style_summary": result["style_summary"],
            "top_style_tags": result["top_style_tags"]
        }).execute()
        
        return result
        
    except Exception as e:
        print(f"Error in style DNA generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Style DNA generation failed: {str(e)}")

# 4. GET USER PROFILE ENDPOINT
@app.get("/api/user-profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get complete user profile with color analysis and style DNA"""
    try:
        # Fetch color analysis
        color_response = supabase.table("color_analysis")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
        
        # Fetch wardrobe items count
        wardrobe_response = supabase.table("wardrobe_items")\
            .select("id", count="exact")\
            .eq("user_id", user_id)\
            .execute()
        
        # Fetch style DNA
        dna_response = supabase.table("style_dna")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
        
        return {
            "color_analysis": color_response.data[0] if color_response.data else None,
            "wardrobe_count": len(wardrobe_response.data) if wardrobe_response.data else 0,
            "style_dna": dna_response.data[0] if dna_response.data else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")

# Health check
@app.get("/")
async def root():
    return {"message": "StyleSphere AI Backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



#running the backend
#cd backend
#uvicorn main:app --reload --host 0.0.0.0 --port 8000