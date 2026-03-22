#!/usr/bin/env python3
"""Fill missing years 1453-1481 and incomplete 1482."""
import subprocess, os, sys, ephem
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from hijri_converter import Hijri
    HAS_HIJRI = True
except:
    HAS_HIJRI = False

SCRIPT = os.path.expanduser('~/clawd/skills/hilal-visibility/scripts/visibility_map.py')
OUTDIR = os.path.expanduser('~/clawd/projects/hilal-website/maps')
MONTHS = {1:'Muharram',2:'Safar',3:"Rabi' al-Awwal",4:"Rabi' al-Thani",
           5:'Jumada al-Awwal',6:'Jumada al-Thani',7:'Rajab',8:"Sha'ban",
           9:'Ramadan',10:'Shawwal',11:"Dhu al-Qi'dah",12:"Dhu al-Hijjah"}
ABBRS = {1:'MUH',2:'SFR',3:'RBA',4:'RBT',5:'JMO',6:'JMT',7:'RJB',8:'SHB',9:'RMD',10:'SHW',11:'ZQD',12:'ZHJ'}

def get_month_start(year, month):
    if HAS_HIJRI and year <= 1500:
        try:
            return Hijri(year, month, 1).to_gregorian()
        except:
            pass
    # Fallback: ephem
    approx = datetime(622, 7, 16) + timedelta(days=(year - 1) * 354.36667 + (month - 1) * 29.53)
    nm = ephem.previous_new_moon(ephem.Date(approx + timedelta(days=15)))
    return (ephem.Date(nm).datetime() + timedelta(days=1)).date()

def generate_map(args):
    date_str, title, output, resolution = args
    if os.path.exists(output):
        return f"SKIP {output}"
    cmd = [sys.executable, SCRIPT, '--date', date_str, '--title', title, '--output', output, '--resolution', str(resolution)]
    try:
        subprocess.run(cmd, capture_output=True, timeout=120)
        return f"OK {output}"
    except Exception as e:
        return f"FAIL {output}: {e}"

# Find what's missing
existing = set()
for f in os.listdir(OUTDIR):
    if f.endswith('_night1.png'):
        parts = f.replace('_night1.png','').split('_')
        if len(parts) >= 3:
            existing.add((int(parts[0]), int(parts[1])))

tasks = []
for year in range(1453, 1482):
    for month in range(1, 13):
        if (year, month) not in existing:
            ms = get_month_start(year, month)
            obs = ms - timedelta(days=1)
            abbr = ABBRS[month]
            base = f"{year}_{month:02d}_{abbr}"
            for night in range(1, 4):
                d = obs + timedelta(days=night-1)
                title = MONTHS[month] + f" {year}H"
                if night > 1:
                    title += f" (Night {night})"
                out = os.path.join(OUTDIR, f"{base}_night{night}.png")
                tasks.append((d.isoformat(), title, out, 3.0))

# Also check 1482
for month in range(1, 13):
    if (1482, month) not in existing:
        ms = get_month_start(1482, month)
        obs = ms - timedelta(days=1)
        abbr = ABBRS[month]
        base = f"1482_{month:02d}_{abbr}"
        for night in range(1, 4):
            d = obs + timedelta(days=night-1)
            title = MONTHS[month] + f" 1482H"
            if night > 1:
                title += f" (Night {night})"
            out = os.path.join(OUTDIR, f"{base}_night{night}.png")
            tasks.append((d.isoformat(), title, out, 3.0))

print(f"Tasks to generate: {len(tasks)} maps ({len(tasks)//3} months)")

with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(generate_map, t): t for t in tasks}
    done = 0
    for f in as_completed(futures):
        done += 1
        result = f.result()
        if done % 30 == 0 or 'FAIL' in result:
            print(f"[{done}/{len(tasks)}] {result}")

print(f"\nDone! Generated {done} maps.")
