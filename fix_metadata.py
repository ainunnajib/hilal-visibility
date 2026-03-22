#!/usr/bin/env python3
"""Rebuild maps_metadata.json with proper observation dates for all years."""
import json, os, glob, ephem
from datetime import datetime, timedelta

MAPS_DIR = os.path.expanduser('~/clawd/projects/hilal-website/maps')
MONTH_NAMES = {
    1:'Muharram', 2:'Safar', 3:"Rabi' al-Awwal", 4:"Rabi' al-Thani",
    5:'Jumada al-Awwal', 6:'Jumada al-Thani', 7:'Rajab', 8:"Sha'ban",
    9:'Ramadan', 10:'Shawwal', 11:"Dhu al-Qi'dah", 12:"Dhu al-Hijjah"
}
ABBRS = {1:'MUH',2:'SFR',3:'RBA',4:'RBT',5:'JMO',6:'JMT',7:'RJB',8:'SHB',9:'RMD',10:'SHW',11:'ZQD',12:'ZHJ'}

# Try hijri_converter for years up to 1500
try:
    from hijri_converter import Hijri
    HAS_HIJRI = True
except:
    HAS_HIJRI = False

def get_month_starts_hijri(year):
    """Get month start dates using hijri_converter (years 1447-1500)."""
    starts = {}
    for month in range(1, 13):
        try:
            max_day = 30
            try:
                d = Hijri(year, month, 30).to_gregorian()
            except:
                max_day = 29
            d = Hijri(year, month, 1).to_gregorian()
            starts[month] = d
        except:
            pass
    return starts

def get_month_starts_ephem(year):
    """Get month start dates using new moon computation (years 1501+)."""
    # Estimate Gregorian start of Hijri year
    approx_days = (year - 1) * 354.36667
    approx_start = datetime(622, 7, 16) + timedelta(days=approx_days)
    
    # Find new moon near start of year
    nm = ephem.previous_new_moon(ephem.Date(approx_start + timedelta(days=15)))
    
    starts = {}
    for month in range(1, 13):
        nm_dt = ephem.Date(nm).datetime()
        month_start = (nm_dt + timedelta(days=1)).date()
        starts[month] = month_start
        nm = ephem.next_new_moon(nm + 1)
    return starts

# Scan all night1 files to find which years/months we have
files = sorted(glob.glob(os.path.join(MAPS_DIR, '*_night1.png')))
print(f"Found {len(files)} month entries")

hijri_years = set()
maps_list = []

for f in files:
    base = os.path.basename(f).replace('_night1.png', '')
    parts = base.split('_')
    if len(parts) < 3:
        continue
    year = int(parts[0])
    month = int(parts[1])
    abbr = parts[2]
    hijri_years.add(year)

# Now process by year for efficiency
year_month_starts = {}
for year in sorted(hijri_years):
    if HAS_HIJRI and year <= 1500:
        try:
            year_month_starts[year] = get_month_starts_hijri(year)
        except:
            year_month_starts[year] = get_month_starts_ephem(year)
    else:
        year_month_starts[year] = get_month_starts_ephem(year)

print(f"Computed dates for {len(year_month_starts)} years")

# Build maps list
for f in files:
    base = os.path.basename(f).replace('_night1.png', '')
    parts = base.split('_')
    year = int(parts[0])
    month = int(parts[1])
    abbr = parts[2]
    
    n1 = f'{base}_night1.png'
    n2 = f'{base}_night2.png'
    n3 = f'{base}_night3.png'
    
    # Get observation date (day before month start)
    month_start = year_month_starts.get(year, {}).get(month)
    if month_start:
        obs_date = month_start - timedelta(days=1)
        obs1 = obs_date.isoformat()
        obs2 = (obs_date + timedelta(days=1)).isoformat()
        obs3 = (obs_date + timedelta(days=2)).isoformat()
        ms = month_start.isoformat()
    else:
        obs1 = obs2 = obs3 = ms = None
    
    maps_list.append({
        'filename': base + '.png',
        'hijri_year': year,
        'hijri_month': month,
        'month_name': MONTH_NAMES.get(month, abbr),
        'month_abbr': abbr,
        'title': f'{MONTH_NAMES.get(month, abbr)} {year}H',
        'observation_date': obs1,
        'month_start_gregorian': ms,
        'filename_night1': n1,
        'filename_night2': n2 if os.path.exists(os.path.join(MAPS_DIR, n2)) else None,
        'filename_night3': n3 if os.path.exists(os.path.join(MAPS_DIR, n3)) else None,
        'observation_date_night1': obs1,
        'observation_date_night2': obs2,
        'observation_date_night3': obs3,
    })

total_png = len(glob.glob(os.path.join(MAPS_DIR, '*.png')))
data = {
    'generated_at': datetime.now().isoformat(),
    'total_maps': total_png,
    'hijri_years': sorted(hijri_years),
    'resolution': 3.0,
    'maps': maps_list
}

with open(os.path.join(MAPS_DIR, 'maps_metadata.json'), 'w') as outf:
    json.dump(data, outf, indent=2)

# Verify a sample
sample = next((m for m in maps_list if m['hijri_year']==1447 and m['hijri_month']==9), None)
if sample:
    print(f"\nSample - Ramadan 1447: obs_night1={sample['observation_date_night1']}, obs_night2={sample['observation_date_night2']}")

print(f"\nDone: {len(maps_list)} months, {total_png} maps, years {min(hijri_years)}-{max(hijri_years)}")
