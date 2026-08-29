import os
import math
import numpy as np
import requests
from typing import List, Optional, Dict, Any
from backend.schemas import SKUItem, RFPSummary, SKUMatch

# Comprehensive Real-World Industrial Cable Catalog (25+ SKUs across 220kV, 132kV, 66kV, 33kV, 22kV, 11kV, 6.6kV, LT)
SKU_CATALOG: List[SKUItem] = [
    # --- EHV / Subsea & Marine Transmission Cables (132kV & 220kV) ---
    SKUItem(
        sku="CAB-132KV-CU-XLPE-SUBSEA",
        description="132kV Copper XLPE Lead Sheath Wet-Cured Marine Subsea Transmission Cable",
        voltage="132kV",
        material="Copper",
        insulation="XLPE",
        basePrice=4800,
        cores="3-Core",
        crossSection="630 mm²",
        armoring="Heavy Galvanized Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-132KV-AL-XLPE-EHV",
        description="132kV Aluminium XLPE Heavy-Duty Transmission Grid Power Cable",
        voltage="132kV",
        material="Aluminium",
        insulation="XLPE",
        basePrice=3100,
        cores="1-Core",
        crossSection="800 mm²",
        armoring="Aluminium Wire Armored (AWA)"
    ),
    SKUItem(
        sku="CAB-220KV-CU-XLPE-EHV",
        description="220kV Extra High Voltage Copper XLPE Corrugated Aluminium Sheath Power Cable",
        voltage="220kV",
        material="Copper",
        insulation="XLPE",
        basePrice=7500,
        cores="1-Core",
        crossSection="1000 mm²",
        armoring="Aluminium Sheathed / Non-Magnetic Armored"
    ),
    SKUItem(
        sku="CAB-66KV-AL-XLPE-EHV",
        description="66kV Aluminium XLPE Substation Feeder Power Cable",
        voltage="66kV",
        material="Aluminium",
        insulation="XLPE",
        basePrice=2200,
        cores="3-Core",
        crossSection="400 mm²",
        armoring="Galvanized Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-66KV-CU-XLPE-EHV",
        description="66kV Copper XLPE Substation Grid Interconnect Cable",
        voltage="66kV",
        material="Copper",
        insulation="XLPE",
        basePrice=3600,
        cores="3-Core",
        crossSection="300 mm²",
        armoring="Galvanized Steel Wire Armored (GSWA)"
    ),

    # --- High Voltage / Medium Voltage Cables (33kV) ---
    SKUItem(
        sku="CAB-33KV-AL-XLPE",
        description="33kV Aluminium XLPE Heavy-Duty Substation Transmission Power Cable",
        voltage="33kV",
        material="Aluminium",
        insulation="XLPE",
        basePrice=1450,
        cores="3-Core",
        crossSection="300 mm²",
        armoring="Galvanized Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-33KV-AL-XLPE-400",
        description="33kV Stranded Aluminium XLPE Extra Large Conductor Cable",
        voltage="33kV",
        material="Aluminium",
        insulation="XLPE",
        basePrice=1750,
        cores="3-Core",
        crossSection="400 mm²",
        armoring="Galvanized Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-33KV-CU-XLPE",
        description="33kV Copper XLPE Insulated Heavy Industrial Substation Cable",
        voltage="33kV",
        material="Copper",
        insulation="XLPE",
        basePrice=2500,
        cores="3-Core",
        crossSection="185 mm²",
        armoring="Galvanized Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-33KV-CU-XLPE-300",
        description="33kV High Ampacity Copper XLPE Industrial Transmission Cable",
        voltage="33kV",
        material="Copper",
        insulation="XLPE",
        basePrice=3200,
        cores="3-Core",
        crossSection="300 mm²",
        armoring="Galvanized Steel Wire Armored (GSWA)"
    ),

    # --- Medium Voltage Cables (22kV & 11kV) ---
    SKUItem(
        sku="CAB-22KV-AL-XLPE-240",
        description="22kV Aluminium XLPE Insulated Distribution Power Cable",
        voltage="22kV",
        material="Aluminium",
        insulation="XLPE",
        basePrice=1150,
        cores="3-Core",
        crossSection="240 mm²",
        armoring="Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-22KV-CU-XLPE",
        description="22kV Copper XLPE Industrial Feeder Cable",
        voltage="22kV",
        material="Copper",
        insulation="XLPE",
        basePrice=1800,
        cores="3-Core",
        crossSection="150 mm²",
        armoring="Galvanized Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-11KV-AL-XLPE",
        description="11kV Aluminium XLPE Insulated Medium Voltage Feeder Cable",
        voltage="11kV",
        material="Aluminium",
        insulation="XLPE",
        basePrice=850,
        cores="3-Core",
        crossSection="240 mm²",
        armoring="Steel Strip Armored (SWA)"
    ),
    SKUItem(
        sku="CAB-11KV-AL-PVC-300",
        description="11kV Aluminium PVC Insulated Heavy Duty Utility Cable",
        voltage="11kV",
        material="Aluminium",
        insulation="PVC",
        basePrice=780,
        cores="3-Core",
        crossSection="300 mm²",
        armoring="Double Steel Tape Armored (DSTA)"
    ),
    SKUItem(
        sku="CAB-11KV-CU-XLPE",
        description="11kV Copper XLPE Insulated Industrial Power Cable",
        voltage="11kV",
        material="Copper",
        insulation="XLPE",
        basePrice=1200,
        cores="3-Core",
        crossSection="150 mm²",
        armoring="Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-11KV-CU-XLPE-240",
        description="11kV Heavy-Duty Copper XLPE High Ampacity Feeder Cable",
        voltage="11kV",
        material="Copper",
        insulation="XLPE",
        basePrice=1550,
        cores="3-Core",
        crossSection="240 mm²",
        armoring="Steel Wire Armored (GSWA)"
    ),
    SKUItem(
        sku="CAB-11KV-CU-PVC",
        description="11kV Copper PVC Insulated Medium Voltage Cable",
        voltage="11kV",
        material="Copper",
        insulation="PVC",
        basePrice=1000,
        cores="3-Core",
        crossSection="120 mm²",
        armoring="Double Steel Tape Armored (DSTA)"
    ),

    # --- Intermediate Voltage (6.6kV) ---
    SKUItem(
        sku="CAB-6.6KV-AL-PVC",
        description="6.6kV Aluminium PVC Insulated Substation Secondary Cable",
        voltage="6.6kV",
        material="Aluminium",
        insulation="PVC",
        basePrice=700,
        cores="3-Core",
        crossSection="185 mm²",
        armoring="Steel Tape Armored"
    ),
    SKUItem(
        sku="CAB-6.6KV-AL-XLPE-240",
        description="6.6kV Aluminium XLPE Heavy Distribution Feeder Cable",
        voltage="6.6kV",
        material="Aluminium",
        insulation="XLPE",
        basePrice=820,
        cores="3-Core",
        crossSection="240 mm²",
        armoring="Steel Wire Armored"
    ),
    SKUItem(
        sku="CAB-6.6KV-CU-XLPE",
        description="6.6kV Copper XLPE Insulated Motor Feeder Cable",
        voltage="6.6kV",
        material="Copper",
        insulation="XLPE",
        basePrice=950,
        cores="3-Core",
        crossSection="95 mm²",
        armoring="Steel Wire Armored"
    ),

    # --- Low Voltage / Low Tension (LV / LT 1.1kV) Cables ---
    SKUItem(
        sku="CAB-LV-AL-XLPE-3.5C-185",
        description="1.1kV LT Aluminium XLPE 3.5 Core Armored Utility Distribution Cable",
        voltage="LV",
        material="Aluminium",
        insulation="XLPE",
        basePrice=380,
        cores="3.5-Core",
        crossSection="185 mm²",
        armoring="Strip Armored (SWA)"
    ),
    SKUItem(
        sku="CAB-LV-AL-PVC-4C-120",
        description="1.1kV LT Aluminium PVC 4-Core Armored Power Distribution Cable",
        voltage="LV",
        material="Aluminium",
        insulation="PVC",
        basePrice=320,
        cores="4-Core",
        crossSection="120 mm²",
        armoring="Steel Tape Armored (DSTA)"
    ),
    SKUItem(
        sku="CAB-LV-CU-PVC",
        description="Low Voltage 1.1kV Copper PVC Insulated 4-Core Armored Feeder Cable",
        voltage="LV",
        material="Copper",
        insulation="PVC",
        basePrice=450,
        cores="4-Core",
        crossSection="50 mm²",
        armoring="Steel Wire Armored"
    ),
    SKUItem(
        sku="CAB-LV-CU-XLPE-4C-95",
        description="1.1kV LT Heavy Duty Copper XLPE 4-Core Main Building Riser Cable",
        voltage="LV",
        material="Copper",
        insulation="XLPE",
        basePrice=680,
        cores="4-Core",
        crossSection="95 mm²",
        armoring="Steel Wire Armored"
    ),
    SKUItem(
        sku="CAB-SOLAR-CU-XLPE-4",
        description="1.5kV DC Solar Photovoltaic Copper XLPE UV-Resistant Dual Core Cable",
        voltage="LV",
        material="Copper",
        insulation="XLPE",
        basePrice=210,
        cores="2-Core",
        crossSection="6 mm²",
        armoring="Unarmored / UV Sheathed"
    )
]

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Calculates Cosine Similarity between two numeric vectors using numpy."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    a = np.array(vec_a, dtype=np.float32)
    b = np.array(vec_b, dtype=np.float32)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))

class CatalogService:
    def __init__(self):
        self.catalog = SKU_CATALOG
        self._cached_embeddings: Dict[str, List[float]] = {}
        self._initialized = False

    def get_catalog(self) -> List[SKUItem]:
        return self.catalog

    def find_sku(self, sku_code: str) -> Optional[SKUItem]:
        for item in self.catalog:
            if item.sku.lower() == sku_code.lower():
                return item
        return None

    def fetch_hf_embedding(self, text: str, hf_token: str) -> Optional[List[float]]:
        """Fetches vector embedding for a single text string from Hugging Face Inference API."""
        try:
            api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
            headers = {"Authorization": f"Bearer {hf_token}"}
            response = requests.post(api_url, headers=headers, json={"inputs": text, "options": {"wait_for_model": True}}, timeout=10)
            if response.status_code == 200:
                res_data = response.json()
                if isinstance(res_data, list) and len(res_data) > 0 and isinstance(res_data[0], (int, float)):
                    return [float(x) for x in res_data]
                elif isinstance(res_data, list) and len(res_data) > 0 and isinstance(res_data[0], list):
                    return [float(x) for x in res_data[0]]
            return None
        except Exception as e:
            print(f"Hugging Face embedding request failed: {e}")
            return None

    def ensure_catalog_indexed(self, hf_token: Optional[str] = None):
        """Indexes catalog vectors once at startup rather than re-requesting every SKU on each RFP."""
        if self._initialized or not hf_token:
            return
        try:
            print("=== Pre-indexing SKU Catalog Vector Embeddings ===")
            sku_texts = [f"SKU {s.sku}: {s.description}, Voltage {s.voltage}, Material {s.material}, Insulation {s.insulation}" for s in self.catalog]
            api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
            headers = {"Authorization": f"Bearer {hf_token}"}
            response = requests.post(api_url, headers=headers, json={"inputs": sku_texts, "options": {"wait_for_model": True}}, timeout=15)
            if response.status_code == 200:
                embeddings = response.json()
                if isinstance(embeddings, list) and len(embeddings) == len(self.catalog):
                    for idx, sku in enumerate(self.catalog):
                        self._cached_embeddings[sku.sku] = embeddings[idx]
                    self._initialized = True
                    print(f"Catalog indexed successfully ({len(self._cached_embeddings)} SKUs cached).")
        except Exception as e:
            print(f"Catalog pre-indexing failed: {e}")

    def match_skus_hybrid(self, summary: RFPSummary, hf_token: Optional[str] = None) -> List[SKUMatch]:
        """
        Fast hybrid matching:
        Pre-indexed Vector similarity (50%) + Deterministic Spec Attribute compatibility (50%).
        """
        if hf_token and not self._initialized:
            self.ensure_catalog_indexed(hf_token)

        rfp_query_text = f"Voltage: {summary.voltage or 'N/A'}, Material: {summary.material or 'N/A'}, Insulation: {summary.insulation or 'N/A'}, Requirements: {' '.join(summary.requirements)}"
        rfp_vector = self.fetch_hf_embedding(rfp_query_text, hf_token) if hf_token else None

        matches: List[SKUMatch] = []
        for sku in self.catalog:
            # 1. Attribute scoring
            spec_score = 0.0
            if summary.voltage:
                v_clean = summary.voltage.lower().replace(" ", "")
                sku_v_clean = sku.voltage.lower().replace(" ", "")
                if v_clean == sku_v_clean:
                    spec_score += 40.0
                elif v_clean.replace("kv", "") in sku_v_clean or sku_v_clean.replace("kv", "") in v_clean:
                    spec_score += 20.0
            
            if summary.material and summary.material.lower() == sku.material.lower():
                spec_score += 30.0
            if summary.insulation and summary.insulation.lower() == sku.insulation.lower():
                spec_score += 30.0

            # 2. Vector scoring
            vector_score = spec_score  # fallback if HF vector is absent
            sim_pct = 0.0
            if rfp_vector and sku.sku in self._cached_embeddings:
                sim = cosine_similarity(rfp_vector, self._cached_embeddings[sku.sku])
                sim_pct = sim * 100
                vector_score = min(100.0, max(0.0, sim * 100))

            # Hybrid score (50% vector + 50% spec attribute)
            if rfp_vector and sku.sku in self._cached_embeddings:
                final_pct = min(100.0, max(10.0, round((vector_score * 0.5) + (spec_score * 0.5))))
            else:
                final_pct = min(100.0, max(10.0, round(spec_score)))

            is_material_mismatch = bool(summary.material and summary.material.lower() != sku.material.lower())

            reasoning = (
                f"Material Discrepancy Warning: RFP requested {summary.material}, but catalog matched {sku.material}. Verify specification before final submission."
                if is_material_mismatch
                else (
                    f"Hugging Face ML semantic similarity vector score: {sim_pct:.1f}%"
                    if rfp_vector
                    else f"Technical specification attribute score: {spec_score:.0f}%"
                )
            )

            matches.append(SKUMatch(
                sku=sku.sku,
                description=sku.description,
                matchPercentage=final_pct,
                voltage=sku.voltage,
                material=sku.material,
                insulation=sku.insulation,
                basePrice=sku.basePrice,
                cores=sku.cores,
                crossSection=sku.crossSection,
                armoring=sku.armoring,
                materialMismatch=is_material_mismatch,
                reasoning=reasoning
            ))

        matches.sort(key=lambda m: m.matchPercentage, reverse=True)
        return matches[:3]

catalog_service = CatalogService()
