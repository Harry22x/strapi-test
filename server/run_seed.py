#!/usr/bin/env python3

from server.seed import seed_data  # Import here because we don't need `app.py`
from server.app import app

with app.app_context():
    seed_data()
    print("✅ Seed data inserted successfully.")
