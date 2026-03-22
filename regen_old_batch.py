#!/usr/bin/env python3
"""Regenerate maps for 1447-1452 months that have wrong observation dates."""
import subprocess, sys, os, ephem
from datetime import timedelta
from hijri_converter import Hijri
from concurrent.futures import ThreadPoolExecutor, as_completed

SCRIPT = os.path.expanduser('~/clawd/skills/hilal-visibility/scripts/visibility_map.py')
MAPS_DIR = os.path.expanduser('~/clawd/projects/hilal-website/maps')
MONTHS = {1:'Muharram',2:'Safar',3:"Rabi' al-Awwal",4:"Rabi' al-Thani",
           5:'Jumada al-Awwal',6:'Jumada al-Thani',7:'Rajab',8:"Sha'ban",
           9:'Ramadan',10:'Shawwal',11:"Dhu al-Qi'dah",12:"Dhu al-Hijjah"}
ABBRS = {1:'MUH',2:'SFR',3:'RBA',4:'RBT',5:'JMO',6:'JMT',7:'RJB',8:'SHB',9:'RMD',10:'SHW',11:'ZQD',12:'ZHJ'}

tasks = []
for year in range(1447, 1453):
    for month in range(1, 13):
        h_start = Hijri(year, month, 1).to_gregorian()
        nm = ephem.previous_new_moon(ephem.Date(h_start))
        nm_date = ephem.Date(nm).datetime().date()
        old_obs = h_start - timedelta(days=1)
        if old_obs != nm_date:
            abbr = ABBRS[month]
            base = f"{year}_{month:02d}_{abbr}"
            for night in range(1, 4):
                d = nm_date + timedelta(days=night - 1)
                title = f"{MONTHS[month]} {year}H"
                if night > 1:
                    title += f" (Night {night})"
                output = os.path.join(MAPS_DIR, f"{base}_night{night}.png")
                tasks.append((d.isoformat(), title, output))

print(f"Regenerating {len(tasks)} maps ({len(tasks)//3} months)")

def gen(args):
    d, t, o = args
    subprocess.run([sys.executable, SCRIPT, '--date', d, '--title', t, '--output', o, '--resolution', '3'], capture_output=True, timeout=120)
    return os.path.basename(o)

with ThreadPoolExecutor(max_workers=8) as ex:
    futs = {ex.submit(gen, t): t for t in tasks}
    done = 0
    for f in as_completed(futs):
        done += 1
        if done % 20 == 0:
            print(f"[{done}/{len(tasks)}] {f.result()}")
print(f"Done! Regenerated {done} maps")
