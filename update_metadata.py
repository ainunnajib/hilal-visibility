#!/usr/bin/env python3
"""
Update metadata for all existing maps to handle the expanded coverage.
This script replaces the functionality of generate_all.py for metadata updates.
"""

import json
import os
import re
from datetime import datetime, timedelta
from pathlib import Path

# Month data
MONTH_DATA = [
    (1, "Muharram", "MUH"),
    (2, "Safar", "SFR"), 
    (3, "Rabi' al-Awwal", "RBA"),
    (4, "Rabi' al-Thani", "RBT"),
    (5, "Jumada al-Awwal", "JMO"),
    (6, "Jumada al-Thani", "JMT"),
    (7, "Rajab", "RJB"),
    (8, "Sha'ban", "SHB"),
    (9, "Ramadan", "RMD"),
    (10, "Shawwal", "SHW"),
    (11, "Dhu al-Qi'dah", "ZQD"),
    (12, "Dhu al-Hijjah", "ZHJ")
]

def get_hijri_month_starts_simple(hijri_year):
    """Simple approximation for month starts."""
    # Hijri year 1 started July 16, 622 CE
    # Average Hijri year = 354.36667 days
    approx_start = datetime(622, 7, 16) + timedelta(days=(hijri_year - 1) * 354.36667)
    
    # Simple month approximation (29.5 days average)
    month_starts = []
    current_date = approx_start
    for month in range(12):
        month_starts.append(current_date.date())
        current_date = current_date + timedelta(days=29.5)
    
    return month_starts

def generate_metadata_entry(hijri_year, month_num, month_name, month_abbr, month_start, resolution):
    """Generate metadata entry for a month."""
    observation_date = month_start - timedelta(days=1)
    
    entry = {
        "hijri_year": hijri_year,
        "hijri_month": month_num,
        "month_name": month_name,
        "month_abbr": month_abbr,
        "observation_date": observation_date.strftime('%Y-%m-%d'),
        "month_start_gregorian": month_start.strftime('%Y-%m-%d'),
        "title": f"{month_name} {hijri_year}H",
        "resolution": resolution
    }
    
    for night in [1, 2, 3]:
        night_date = observation_date + timedelta(days=night-1)
        entry[f"filename_night{night}"] = f"{hijri_year}_{month_num:02d}_{month_abbr}_night{night}.png"
        entry[f"observation_date_night{night}"] = night_date.strftime('%Y-%m-%d')
    
    return entry

def main():
    maps_dir = Path('maps')
    png_files = list(maps_dir.glob('*.png'))
    print(f"Found {len(png_files)} PNG files")
    
    year_months = set()
    pattern = re.compile(r'^(\d{4})_(\d{2})_([A-Z]{3})_night[123]\.png$')
    
    for png_file in png_files:
        match = pattern.match(png_file.name)
        if match:
            year, month, abbr = match.groups()
            year_months.add((int(year), int(month)))
    
    print(f"Found {len(year_months)} unique year/month combinations")
    year_months = sorted(year_months)
    
    all_metadata = []
    for year, month in year_months:
        month_data = None
        for month_num, month_name, month_abbr in MONTH_DATA:
            if month_num == month:
                month_data = (month_num, month_name, month_abbr)
                break
        
        if not month_data:
            continue
        
        month_num, month_name, month_abbr = month_data
        month_starts = get_hijri_month_starts_simple(year)
        month_start = month_starts[month-1]
        
        resolution = 3.0 if year >= 1453 else 2.0
        
        entry = generate_metadata_entry(year, month_num, month_name, month_abbr, month_start, resolution)
        all_metadata.append(entry)
    
    total_maps = len(all_metadata) * 3
    years_covered = sorted(set(entry['hijri_year'] for entry in all_metadata))
    
    metadata = {
        "generated_at": datetime.now().isoformat(),
        "total_maps": total_maps,
        "total_months": len(all_metadata),
        "hijri_years": years_covered,
        "year_range": f"{min(years_covered)}-{max(years_covered)}",
        "resolution_note": "Years 1447-1452: resolution 2.0, Years 1453+: resolution 3.0",
        "maps": all_metadata
    }
    
    metadata_file = maps_dir / 'maps_metadata.json'
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Metadata generated:")
    print(f"   - {len(all_metadata)} months")
    print(f"   - {total_maps} total maps")
    print(f"   - Years: {min(years_covered)}-{max(years_covered)}")

if __name__ == '__main__':
    main()