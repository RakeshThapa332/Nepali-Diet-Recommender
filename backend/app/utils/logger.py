"""
Centralized logging configuration.

Usage:
    from app.utils.logger import logging
    logging.info("message")
"""

import logging
import os
from datetime import datetime

LOG_DIR = "artifacts/reports/logs"
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = f"{datetime.now().strftime('%Y_%m_%d')}.log"
LOG_FILE_PATH = os.path.join(LOG_DIR, LOG_FILE)

logging.basicConfig(
    filename=LOG_FILE_PATH,
    format="[%(asctime)s] %(lineno)d %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)

console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s - %(message)s"))
console_handler.setLevel(logging.INFO)
logging.getLogger().addHandler(console_handler)
