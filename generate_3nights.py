#!/usr/bin/env python3
"""
Generate Night 2 and Night 3 visibility maps for all months.
Rename existing maps to Night 1 format for consistency.
"""

import json
import os
import subprocess
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

def load_metadata():
    """Load maps metadata from JSON file."""
    metadata_path = "maps/maps_metadata.json"
    with open(metadata_path, 'r') as f:
        return json.load(f)

def add_days_to_date(date_str, days):
    """Add days to a date string and return new date string."""
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    new_date = date_obj + timedelta(days=days)
    return new_date.strftime('%Y-%m-%d')

def generate_map(year, month, abbr, date, night, title, output_path):
    """Generate a single visibility map."""
    script_path = os.path.expanduser("~/clawd/skills/hilal-visibility/scripts/visibility_map.py")
    
    cmd = [
        "python3", script_path,
        "--date", date,
        "--title", title,
        "--output", output_path,
        "--resolution", "2"
    ]
    
    print(f"🌙 Generating {output_path}...")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            print(f"❌ Error generating {output_path}:")
            print(f"   stdout: {result.stdout}")
            print(f"   stderr: {result.stderr}")
            return False
        else:
            print(f"✅ Generated {output_path}")
            return True
    except subprocess.TimeoutExpired:
        print(f"❌ Timeout generating {output_path}")
        return False
    except Exception as e:
        print(f"❌ Exception generating {output_path}: {e}")
        return False

def main():
    # Load metadata
    metadata = load_metadata()
    maps = metadata['maps']
    
    print(f"📚 Loaded metadata for {len(maps)} maps")
    
    # Step 1: Rename existing maps to Night 1 format
    print("\n🔄 Step 1: Renaming existing maps to Night 1 format...")
    for map_data in maps:
        old_filename = f"maps/{map_data['filename']}"
        year = map_data['hijri_year']
        month = map_data['hijri_month']
        abbr = map_data['month_abbr']
        new_filename = f"maps/{year}_{month:02d}_{abbr}_night1.png"
        
        if os.path.exists(old_filename):
            os.rename(old_filename, new_filename)
            print(f"   📄 Renamed {map_data['filename']} -> {year}_{month:02d}_{abbr}_night1.png")
        else:
            print(f"   ❓ File not found: {old_filename}")
    
    # Step 2: Generate Night 2 and Night 3 maps
    print("\n🌙 Step 2: Generating Night 2 and Night 3 maps...")
    
    tasks = []
    
    for map_data in maps:
        year = map_data['hijri_year']
        month = map_data['hijri_month']
        abbr = map_data['month_abbr']
        base_title = map_data['title']
        observation_date = map_data['observation_date']
        
        # Night 2: +1 day
        night2_date = add_days_to_date(observation_date, 1)
        night2_title = f"{base_title} (Night 2)"
        night2_output = f"maps/{year}_{month:02d}_{abbr}_night2.png"
        
        tasks.append((year, month, abbr, night2_date, 2, night2_title, night2_output))
        
        # Night 3: +2 days
        night3_date = add_days_to_date(observation_date, 2)
        night3_title = f"{base_title} (Night 3)"
        night3_output = f"maps/{year}_{month:02d}_{abbr}_night3.png"
        
        tasks.append((year, month, abbr, night3_date, 3, night3_title, night3_output))
    
    print(f"🔨 Will generate {len(tasks)} maps (2 per month)")
    
    # Generate maps in parallel (4-6 workers for speed)
    success_count = 0
    error_count = 0
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        # Submit all tasks
        future_to_task = {
            executor.submit(generate_map, *task): task 
            for task in tasks
        }
        
        # Process completed tasks
        for future in as_completed(future_to_task):
            task = future_to_task[future]
            try:
                success = future.result()
                if success:
                    success_count += 1
                else:
                    error_count += 1
            except Exception as e:
                error_count += 1
                print(f"❌ Task failed: {task} - {e}")
    
    print(f"\n📊 Generation Summary:")
    print(f"   ✅ Success: {success_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   📈 Total: {success_count + error_count}")
    
    # Step 3: Update metadata with new filenames
    print(f"\n📝 Step 3: Updating metadata...")
    
    for map_data in maps:
        year = map_data['hijri_year']
        month = map_data['hijri_month'] 
        abbr = map_data['month_abbr']
        observation_date = map_data['observation_date']
        
        # Add new fields
        map_data['filename_night1'] = f"{year}_{month:02d}_{abbr}_night1.png"
        map_data['filename_night2'] = f"{year}_{month:02d}_{abbr}_night2.png"
        map_data['filename_night3'] = f"{year}_{month:02d}_{abbr}_night3.png"
        
        map_data['observation_date_night1'] = observation_date
        map_data['observation_date_night2'] = add_days_to_date(observation_date, 1)
        map_data['observation_date_night3'] = add_days_to_date(observation_date, 2)
        
        # Keep old filename field for backward compatibility
        # (will be removed once website is updated)
    
    # Update metadata file
    metadata['updated_at'] = datetime.now().isoformat()
    metadata['total_maps'] = 72 * 3  # Now 216 maps (3 per month)
    
    with open("maps/maps_metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"✅ Updated maps_metadata.json with 3-night structure")
    
    print(f"\n🎉 Complete! Website now has 3 nights per month.")
    print(f"   🌙 Night 1: Original observation evenings")
    print(f"   🌙 Night 2: +1 day from Night 1") 
    print(f"   🌙 Night 3: +2 days from Night 1")
    print(f"\n🔗 Next: Update website UI (index.html, app.js, style.css)")

if __name__ == "__main__":
    main()