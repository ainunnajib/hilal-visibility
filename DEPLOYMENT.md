# Deployment Guide for Hilal Visibility Maps

## Manual Netlify Deployment

Since the Netlify CLI had issues, deploy manually via the web interface:

### Step 1: Access Netlify Dashboard
1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Login with your account

### Step 2: Create New Site
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub" 
3. Select the `ainunnajib/hilal-visibility` repository

### Step 3: Configure Build Settings
```
Build command: (leave empty)
Publish directory: .
```

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for deployment to complete
3. Optionally change site name to `hilal-visibility` in Site settings

## Site Structure

```
hilal-visibility/
├── index.html           # Main page
├── style.css           # Styling  
├── app.js              # JavaScript app
├── maps/               # 72 PNG maps + metadata
│   ├── maps_metadata.json
│   └── *.png           # Visibility maps
├── netlify.toml        # Netlify config
└── README.md           # Documentation
```

## Post-Deployment Checklist

- [ ] Site loads at Netlify URL
- [ ] Year selector populates with 1447-1452
- [ ] Month buttons enable/disable correctly  
- [ ] Maps load when selected
- [ ] Info panel shows correct data
- [ ] Mobile responsive design works
- [ ] Legend displays properly

## Future Map Generation

Use the included `generate_more_maps.sh` script:

```bash
cd ~/clawd/projects/hilal-website
./generate_more_maps.sh --start-year 1453 --end-year 1455
git add .
git commit -m "Add maps for 1453H-1455H"  
git push
```

Netlify will auto-deploy from GitHub pushes.

## Domain Setup (Optional)

If you want a custom domain:
1. In Netlify dashboard → Domain settings
2. Add custom domain
3. Follow DNS configuration instructions

Suggested domain: `hilal.ainunnajib.com` or similar.

## Performance Notes

- Each PNG map is ~384KB  
- Total site size: ~28MB (72 maps)
- Uses browser caching headers via netlify.toml
- Maps load on-demand (not all at once)

## Analytics (Optional)

Add Google Analytics by inserting tracking code in `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Monitoring

The site is static and should be very reliable. Monitor:
- Page load times
- Mobile usability  
- Map image loading
- JavaScript console errors

If issues arise, check:
1. Maps metadata JSON file integrity
2. Image file availability in /maps/
3. Browser JavaScript console for errors