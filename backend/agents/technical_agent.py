import os
from typing import List
from backend.schemas import RFPSummary, SKUMatch
from backend.services.catalog_service import catalog_service

async def run_technical_agent(summary: RFPSummary) -> List[SKUMatch]:
    """
    AI-Powered Technical Agent - Matches RFP specifications to the SKU catalog
    using pre-indexed hybrid vector semantic similarity + attribute scoring.
    """
    hf_token = os.getenv("HF_TOKEN")
    
    # 1. Run hybrid catalog matcher
    matches = catalog_service.match_skus_hybrid(summary, hf_token=hf_token)
    
    # If matches found, return top matches
    if matches:
        return matches

    # Fallback to top catalog items if empty
    catalog = catalog_service.get_catalog()
    fallback_matches = []
    for item in catalog[:3]:
        fallback_matches.append(SKUMatch(
            sku=item.sku,
            description=item.description,
            matchPercentage=60.0,
            voltage=item.voltage,
            material=item.material,
            insulation=item.insulation,
            basePrice=item.basePrice,
            cores=item.cores,
            crossSection=item.crossSection,
            armoring=item.armoring,
            reasoning="Baseline catalog match.",
            materialMismatch=False
        ))
    return fallback_matches
