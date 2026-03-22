#!/bin/bash
# Run this after generate_all.py finishes to do final deploy
set -e

cd ~/clawd/projects/hilal-website

echo "=== Counting maps ==="
MAP_COUNT=$(ls maps/*.png | wc -l | tr -d ' ')
echo "Total maps: $MAP_COUNT"

echo "=== Updating metadata ==="
python3 update_metadata.py 2>/dev/null || python3 -c "
import json, os, glob
from datetime import datetime

maps_dir = os.path.expanduser('~/clawd/projects/hilal-website/maps')
files = sorted(glob.glob(os.path.join(maps_dir, '*_night1.png')))

hijri_years = set()
maps = []

for f in files:
    base = os.path.basename(f).replace('_night1.png', '')
    parts = base.split('_')
    if len(parts) >= 3:
        year = int(parts[0])
        month = int(parts[1])
        abbr = parts[2]
        hijri_years.add(year)
        
        n2 = f.replace('_night1.png', '_night2.png')
        n3 = f.replace('_night1.png', '_night3.png')
        
        maps.append({
            'filename': base + '.png',
            'hijri_year': year,
            'hijri_month': month,
            'month_abbr': abbr,
            'filename_night1': os.path.basename(f),
            'filename_night2': os.path.basename(n2) if os.path.exists(n2) else None,
            'filename_night3': os.path.basename(n3) if os.path.exists(n3) else None,
        })

data = {
    'generated_at': datetime.now().isoformat(),
    'total_maps': len(glob.glob(os.path.join(maps_dir, '*.png'))),
    'hijri_years': sorted(hijri_years),
    'resolution': 3.0,
    'maps': maps
}

with open(os.path.join(maps_dir, 'maps_metadata.json'), 'w') as f:
    json.dump(data, f, indent=2)
print(f'Metadata updated: {len(maps)} months, {data[\"total_maps\"]} maps, years {min(hijri_years)}-{max(hijri_years)}')
"

echo "=== Git commit ==="
git add -A
git commit -m "Final deploy: 100+ years of hilal maps (1447-1553H)" || echo "Nothing to commit"
git push origin main

echo "=== Netlify deploy ==="
netlify deploy --prod --dir .

echo "=== DONE ==="
