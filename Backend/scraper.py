# backend/scraper.py
import requests
from bs4 import BeautifulSoup
import json

def scrape_myntra_search(query, max_results=20):
    """Simple Myntra scraper for demo purposes"""
    # Note: In production, use official API or ethical scraping
    mock_products = [
        {
            "store": "myntra",
            "product_id": f"myntra_{i}",
            "title": f"Women's {query} - Style {i}",
            "price": 500 + (i * 200),
            "image_url": f"https://via.placeholder.com/300x400/ec4899/ffffff?text={query}+{i}",
            "product_url": f"https://www.myntra.com/{query}-{i}",
            "category": "top",
            "color": ["pink", "white", "black"][i % 3],
            "style_tags": ["casual", "minimalist", "trendy"][:i % 3 + 1],
            "formality_level": 3,
            "seasonality": ["all-season"],
            "brand": "Brand X"
        }
        for i in range(max_results)
    ]
    return mock_products

def scrape_amazon_search(query, max_results=20):
    """Simple Amazon scraper for demo purposes"""
    mock_products = [
        {
            "store": "amazon",
            "product_id": f"amazon_{i}",
            "title": f"Amazon Fashion {query} - Option {i}",
            "price": 300 + (i * 150),
            "image_url": f"https://via.placeholder.com/300x400/3b82f6/ffffff?text=Amazon+{query}+{i}",
            "product_url": f"https://www.amazon.in/{query}-{i}",
            "category": "dress",
            "color": ["blue", "red", "green"][i % 3],
            "style_tags": ["classic", "formal", "elegant"][:i % 3 + 1],
            "formality_level": 7,
            "seasonality": ["winter", "summer"][i % 2],
            "brand": "Brand Y"
        }
        for i in range(max_results)
    ]
    return mock_products