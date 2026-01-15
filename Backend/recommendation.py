# backend/recommendation.py
def get_recommendations(user_id, shopping_intent):
    """
    shopping_intent example:
    {
        "category": "tops",
        "occasion": "casual",
        "budget": 2000,
        "stores": ["myntra", "amazon"],
        "color_preference": "pink"
    }
    """
    # 1. Get user profile
    user_profile = get_user_profile(user_id)  # From Layer 1
    
    # 2. Get products from database
    products = get_products_from_db(shopping_intent)
    
    # 3. Score each product
    scored_products = []
    for product in products:
        score = calculate_match_score(user_profile, product, shopping_intent)
        reason = generate_explanation(user_profile, product, score)
        
        scored_products.append({
            **product,
            "relevance_score": score,
            "reason": reason
        })
    
    # 4. Sort by score and return top recommendations
    scored_products.sort(key=lambda x: x["relevance_score"], reverse=True)
    return scored_products[:10]

def calculate_match_score(user_profile, product, shopping_intent):
    """Calculate how well product matches user"""
    score = 0
    
    # Color match (from color analysis)
    if product["color"] in user_profile["flattering_colors"]:
        score += 30
    elif product["color"] in user_profile["colors_to_avoid"]:
        score -= 20
    
    # Style tag match (from wardrobe analysis)
    user_tags = user_profile["style_dna"]["top_style_tags"]
    product_tags = product["style_tags"]
    common_tags = set(user_tags) & set(product_tags)
    score += len(common_tags) * 10
    
    # Budget match
    if product["price"] <= shopping_intent["budget"]:
        score += 20
    else:
        score -= (product["price"] - shopping_intent["budget"]) / 100
    
    # Formality match
    user_formality = user_profile["style_dna"]["formality_range"]
    # Add formality logic...
    
    return min(max(score, 0), 100)  # Clamp between 0-100