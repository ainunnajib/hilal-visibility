#!/usr/bin/env python3
"""
Fix observation dates: Night 1 should be the evening of the new moon (conjunction) day,
NOT month_start - 1. The conjunction evening is when the crescent is youngest/hardest to see.
"""
import json, os, sys, ephem, subprocess, glob
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from hijri_converter import Hijri
    HAS_HIJRI = True
except:
    HAS_HIJRI = False

SCRIPT = os.path.expanduser('~/clawd/skills/hilal-visibility/scripts/visibility_map.py')
MAPS_DIR = os.path.expanduser('~/clawd/projects/hilal-website/maps')
MONTHS = {1:'Muharram',2:'Safar',3:"Rabi' al-Awwal",4:"Rabi' al-Thani",
           5:'Jumada al-Awwal',6:'Jumada al-Thani',7:'Rajab',8:"Sha'ban",
           9:'Ramadan',10:'Shawwal',11:"Dhu al-Qi'dah",12:"Dhu al-Hijjah"}
ABBRS = {1:'MUH',2:'SFR',3:'RBA',4:'RBT',5:'JMO',6:'JMT',7:'RJB',8:'SHB',9:'RMD',10:'SHW',11:'ZQD',12:'ZHJ'}

def get_correct_night1(year, month):
    """Night 1 = evening of the new moon (conjunction) day."""
    # Get approximate date for this Hijri month
    if HAS_HIJRI and year <= 1500:
        try:
            h_start = Hijri(year, month, 1).to_gregorian()
            nm = ephem.previous_new_moon(ephem.Date(h_start))
            return ephem.Date(nm).datetime().date()
        except:
            pass
    # Fallback: ephem-based
    approx = datetime(622, 7, 16) + timedelta(days=(year - 1) * 354.36667 + (month - 1) * 29.53)
    nm = ephem.previous_new_moon(ephem.Date(approx + timedelta(days=15)))
    return ephem.Date(nm).datetime().date()

def generate_map(args):
    date_str, title, output, resolution = args
    cmd = [sys.executable, SCRIPT, '--date', date_str, '--title', title, '--output', output, '--resolution', str(resolution)]
    try:
        subprocess.run(cmd, capture_output=True, timeout=120)
        return f"OK {os.path.basename(output)}"
    except Exception as e:
        return f"FAIL {os.path.basename(output)}: {e}"

# Load current metadata
data = json.load(open(os.path.join(MAPS_DIR, 'maps_metadata.json')))

# Scan all months and find ones that need fixing
to_fix = []  # (year, month, correct_night1, current_night1)
for m in data['maps']:
    hy, hm = m['hijri_year'], m['hijri_month']
    current_obs = m.get('observation_date_night1')
    if not current_obs:
        continue
    
    correct_night1 = get_correct_night1(hy, hm)
    current_date = datetime.fromisoformat(current_obs).date()
    
    if current_date != correct_night1:
        to_fix.append((hy, hm, correct_night1, current_date))

print(f"Months needing fix: {len(to_fix)} out of {len(data['maps'])}")

if not to_fix:
    print("Nothing to fix!")
    sys.exit(0)

# Generate new maps for the wrong night1 dates
# We only need to regenerate Night 1 maps (Night 2 and 3 shift accordingly)
tasks = []
for hy, hm, correct_night1, _ in to_fix:
    abbr = ABBRS[hm]
    base = f"{hy}_{hm:02d}_{abbr}"
    for night in range(1, 4):
        d = correct_night1 + timedelta(days=night - 1)
        title = f"{MONTHS[hm]} {hy}H"
        if night > 1:
            title += f" (Night {night})"
        output = os.path.join(MAPS_DIR, f"{base}_night{night}.png")
        tasks.append((d.isoformat(), title, output, 3.0))

print(f"Maps to regenerate: {len(tasks)}")

# Run in parallel
with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(generate_map, t): t for t in tasks}
    done = 0
    fails = 0
    for f in as_completed(futures):
        done += 1
        result = f.result()
        if 'FAIL' in result:
            fails += 1
            print(f"[{done}/{len(tasks)}] {result}")
        elif done % 50 == 0:
            print(f"[{done}/{len(tasks)}] {result}")

print(f"\nRegenerated {done - fails}/{len(tasks)} maps ({fails} failures)")

# Now rebuild metadata with correct dates
print("\nRebuilding metadata...")
new_maps = []
files = sorted(glob.glob(os.path.join(MAPS_DIR, '*_night1.png')))
hijri_years = set()

for f in files:
    base = os.path.basename(f).replace('_night1.png', '')
    parts = base.split('_')
    if len(parts) < 3:
        continue
    year, month, abbr = int(parts[0]), int(parts[1]), parts[2]
    hijri_years.add(year)
    
    correct_night1 = get_correct_night1(year, month)
    n1 = correct_night1.isoformat()
    n2 = (correct_night1 + timedelta(days=1)).isoformat()
    n3 = (correct_night1 + timedelta(days=2)).isoformat()
    
    new_maps.append({
        'filename': base + '.png',
        'hijri_year': year,
        'hijri_month': month,
        'month_name': MONTHS.get(month, abbr),
        'month_abbr': abbr,
        'title': f'{MONTHS.get(month, abbr)} {year}H',
        'observation_date': n1,
        'filename_night1': f'{base}_night1.png',
        'filename_night2': f'{base}_night2.png' if os.path.exists(os.path.join(MAPS_DIR, f'{base}_night2.png')) else None,
        'filename_night3': f'{base}_night3.png' if os.path.exists(os.path.join(MAPS_DIR, f'{base}_night3.png')) else None,
        'observation_date_night1': n1,
        'observation_date_night2': n2,
        'observation_date_night3': n3,
    })

total_png = len(glob.glob(os.path.join(MAPS_DIR, '*.png')))
new_data = {
    'generated_at': datetime.now().isoformat(),
    'total_maps': total_png,
    'hijri_years': sorted(hijri_years),
    'resolution': 3.0,
    'maps': new_maps
}
with open(os.path.join(MAPS_DIR, 'maps_metadata.json'), 'w') as outf:
    json.dump(new_data, outf, indent=2)

print(f"Metadata updated: {len(new_maps)} months, {total_png} maps")
print("Done!")
