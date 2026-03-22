#!/bin/bash
# Script to generate additional hilal visibility maps

set -e

# Configuration
SCRIPT_DIR="$HOME/clawd/skills/hilal-visibility/scripts"
OUTPUT_DIR="$HOME/clawd/projects/hilal-website/maps"
RESOLUTION=2.0

# Function to show usage
usage() {
    echo "Usage: $0 --start-year YEAR --end-year YEAR [--resolution RESOLUTION]"
    echo ""
    echo "Example: $0 --start-year 1453 --end-year 1455"
    echo ""
    echo "This will generate maps for additional Hijri years and update the website."
    exit 1
}

# Parse arguments
START_YEAR=""
END_YEAR=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --start-year)
            START_YEAR="$2"
            shift 2
            ;;
        --end-year)
            END_YEAR="$2"
            shift 2
            ;;
        --resolution)
            RESOLUTION="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate arguments
if [[ -z "$START_YEAR" || -z "$END_YEAR" ]]; then
    echo "Error: --start-year and --end-year are required"
    usage
fi

if [[ ! "$START_YEAR" =~ ^[0-9]+$ || ! "$END_YEAR" =~ ^[0-9]+$ ]]; then
    echo "Error: Years must be numbers"
    usage
fi

if [[ $START_YEAR -gt $END_YEAR ]]; then
    echo "Error: Start year must be less than or equal to end year"
    exit 1
fi

echo "Generating additional hilal visibility maps..."
echo "Years: ${START_YEAR}H - ${END_YEAR}H"
echo "Resolution: ${RESOLUTION}°"
echo ""

# Backup current metadata
if [[ -f "$OUTPUT_DIR/maps_metadata.json" ]]; then
    cp "$OUTPUT_DIR/maps_metadata.json" "$OUTPUT_DIR/maps_metadata.json.backup.$(date +%Y%m%d_%H%M%S)"
    echo "Backed up existing metadata file"
fi

# Generate new maps
cd "$SCRIPT_DIR"
python3 batch_generate.py \
    --start-year "$START_YEAR" \
    --end-year "$END_YEAR" \
    --output-dir "$OUTPUT_DIR" \
    --resolution "$RESOLUTION"

if [[ $? -eq 0 ]]; then
    echo ""
    echo "✅ Map generation completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Test the website locally: open $HOME/clawd/projects/hilal-website/index.html"
    echo "2. Commit and push to GitHub:"
    echo "   cd ~/clawd/projects/hilal-website"
    echo "   git add ."
    echo "   git commit -m 'Add maps for ${START_YEAR}H-${END_YEAR}H'"
    echo "   git push"
    echo "3. Netlify will auto-deploy the updated site"
else
    echo "❌ Map generation failed. Check the output above for errors."
    exit 1
fi