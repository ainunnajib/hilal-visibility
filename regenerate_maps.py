#!/usr/bin/env python3
"""
Generate and execute commands to regenerate all 72 hilal visibility maps with fixed colors.
"""

import json
import subprocess
import os
import sys
import time
from pathlib import Path

def main():
    # Read metadata file
    metadata_file = Path('~/clawd/projects/hilal-website/maps/maps_metadata.json').expanduser()
    with open(metadata_file) as f:
        data = json.load(f)
    
    print(f"Found {data['total_maps']} maps to regenerate")
    
    # Generate commands
    commands = []
    script_path = Path('~/clawd/skills/hilal-visibility/scripts/visibility_map.py').expanduser()
    
    for i, map_entry in enumerate(data['maps'], 1):
        output_path = Path(f"~/clawd/projects/hilal-website/maps/{map_entry['filename']}").expanduser()
        
        cmd = [
            'python3', str(script_path),
            '--date', map_entry['observation_date'],
            '--title', map_entry['title'],
            '--output', str(output_path),
            '--resolution', '2'
        ]
        
        commands.append((i, map_entry['filename'], cmd))
    
    # Execute commands in batches of 6
    batch_size = 6
    total_batches = (len(commands) + batch_size - 1) // batch_size
    
    print(f"Executing {len(commands)} commands in {total_batches} batches of {batch_size}")
    
    for batch_num in range(total_batches):
        start_idx = batch_num * batch_size
        end_idx = min(start_idx + batch_size, len(commands))
        batch_commands = commands[start_idx:end_idx]
        
        print(f"\n=== Batch {batch_num + 1}/{total_batches} ===")
        
        # Start all commands in this batch
        processes = []
        for idx, filename, cmd in batch_commands:
            print(f"  Starting {idx}/72: {filename}")
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            processes.append((idx, filename, proc))
        
        # Wait for all to complete
        for idx, filename, proc in processes:
            stdout, stderr = proc.communicate()
            if proc.returncode == 0:
                print(f"  ✅ Completed {idx}/72: {filename}")
            else:
                print(f"  ❌ Failed {idx}/72: {filename}")
                print(f"     Error: {stderr.decode()}")
        
        # Small delay between batches
        if batch_num < total_batches - 1:
            print(f"  Batch {batch_num + 1} complete, waiting 2s before next batch...")
            time.sleep(2)
    
    print(f"\n🎉 All {len(commands)} maps processed!")
    
    # Verify output files exist
    missing = []
    for _, map_entry in enumerate(data['maps'], 1):
        output_path = Path(f"~/clawd/projects/hilal-website/maps/{map_entry['filename']}").expanduser()
        if not output_path.exists():
            missing.append(map_entry['filename'])
    
    if missing:
        print(f"\n⚠️  {len(missing)} files were not generated:")
        for f in missing:
            print(f"  - {f}")
    else:
        print(f"\n✅ All {len(commands)} map files verified to exist!")

if __name__ == '__main__':
    main()