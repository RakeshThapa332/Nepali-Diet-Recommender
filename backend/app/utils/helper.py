"""
Small generic helper functions shared across the app.
"""

import sys
import yaml

from app.utils.exceptions import DietRecommendationException


def read_yaml(file_path: str) -> dict:
    """Loads a YAML file into a plain dict."""
    try:
        with open(file_path, "r") as f:
            return yaml.safe_load(f)
    except Exception as e:
        raise DietRecommendationException(e, sys) from e
