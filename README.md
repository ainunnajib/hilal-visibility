# Hilal Visibility Maps

Interactive web application displaying crescent moon (hilal) visibility predictions for Islamic calendar years 1447-1452 (2025-2031 CE).

## Features

- **72 Generated Maps** covering 6 Hijri years (1447-1452)
- **Interactive Navigation** by year and month
- **Shaukat Criterion** zones (A, B, C, D)
- **Turkey 2016/KHGT Criterion** boundary line
- **Responsive Design** for desktop and mobile
- **Dark Theme** matching the map backgrounds

## Methodology

Maps are generated using:
- **PyEphem** for astronomical calculations
- **Shaukat Criterion** for visibility prediction
- **hijri-converter** for Hijri↔Gregorian date conversion
- **2° grid resolution** for computational efficiency

## Deployment

To deploy on Netlify:

1. Connect this GitHub repository to Netlify
2. Build settings: Publish directory = `.` (root)
3. No build command needed (static site)

## Technical Details

- **Total Maps:** 72 (6 years × 12 months)
- **File Size:** ~384KB per map
- **Resolution:** 2° grid (91×181 points)
- **Format:** PNG with black backgrounds

## Local Development

Simply open `index.html` in a web browser. No build process required.

## Credits

Based on the Shaukat Criterion developed by Khalid Shaukat at [moonsighting.com](http://moonsighting.com).

## License

For educational and religious purposes. Maps are based on astronomical calculations and should not be used as the sole basis for religious observances. Always consult local Islamic authorities.