/**
 * Hilal Visibility Maps - JavaScript Application
 * Handles map navigation, data loading, and UI interactions
 */

class HilalApp {
    constructor() {
        this.mapsData = null;
        this.currentYear = null;
        this.currentMonth = null;
        
        // Month names in Arabic and English
        this.monthNames = {
            1: { en: 'Muharram', ar: 'محرم' },
            2: { en: 'Safar', ar: 'صفر' },
            3: { en: "Rabi' al-Awwal", ar: 'ربيع الأول' },
            4: { en: "Rabi' al-Thani", ar: 'ربيع الثاني' },
            5: { en: 'Jumada al-Awwal', ar: 'جمادى الأولى' },
            6: { en: 'Jumada al-Thani', ar: 'جمادى الثانية' },
            7: { en: 'Rajab', ar: 'رجب' },
            8: { en: "Sha'ban", ar: 'شعبان' },
            9: { en: 'Ramadan', ar: 'رمضان' },
            10: { en: 'Shawwal', ar: 'شوال' },
            11: { en: "Dhu al-Qi'dah", ar: 'ذو القعدة' },
            12: { en: 'Dhu al-Hijjah', ar: 'ذو الحجة' }
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            await this.loadMapsData();
            this.setupEventListeners();
            this.populateYearSelector();
            this.showWelcomeMessage();
            window.hilalApp = this;
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load map data. Please refresh the page.');
        }
    }

    /**
     * Load maps metadata from JSON file
     */
    async loadMapsData() {
        try {
            const response = await fetch('./maps/maps_metadata.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.mapsData = await response.json();
            console.log('Maps data loaded:', this.mapsData);
        } catch (error) {
            console.error('Error loading maps data:', error);
            // Create fallback data structure
            this.mapsData = {
                total_maps: 0,
                hijri_years: [1447, 1448, 1449, 1450, 1451, 1452],
                maps: []
            };
            throw error;
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const yearSelect = document.getElementById('year-select');
        if (yearSelect) {
            yearSelect.addEventListener('change', (e) => {
                this.selectYear(parseInt(e.target.value));
            });
        }
    }

    /**
     * Populate the year selector dropdown
     */
    populateYearSelector() {
        const yearSelect = document.getElementById('year-select');
        if (!yearSelect || !this.mapsData) return;

        // Clear existing options except the first one
        yearSelect.innerHTML = '<option value="">Select Year</option>';

        // Add year options
        this.mapsData.hijri_years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `${year} H`;
            yearSelect.appendChild(option);
        });
    }

    /**
     * Select a Hijri year and populate months
     */
    selectYear(year) {
        if (!year) {
            this.showWelcomeMessage();
            return;
        }

        this.currentYear = year;
        this.currentMonth = null;
        this.populateMonthGrid(year);
        this.hideWelcomeMessage();
    }

    /**
     * Populate the month grid for a selected year
     */
    populateMonthGrid(year) {
        const monthGrid = document.getElementById('month-grid');
        if (!monthGrid) return;

        monthGrid.innerHTML = '';

        // Create month buttons
        for (let month = 1; month <= 12; month++) {
            const button = document.createElement('button');
            button.className = 'month-btn';
            button.textContent = this.monthNames[month].en;
            button.dataset.year = year;
            button.dataset.month = month;

            // Check if map exists for this month
            const mapExists = this.getMapForMonth(year, month);
            if (!mapExists) {
                button.disabled = true;
                button.title = 'Map not available yet';
            }

            button.addEventListener('click', () => {
                if (!button.disabled) {
                    this.selectMonth(year, month);
                }
            });

            monthGrid.appendChild(button);
        }
    }

    /**
     * Select a specific month and display its map
     */
    selectMonth(year, month) {
        this.currentYear = year;
        this.currentMonth = month;

        // Update active button
        document.querySelectorAll('.month-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-year="${year}"][data-month="${month}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Display the map
        this.displayMap(year, month);
    }

    /**
     * Display the map for the selected year/month
     */
    displayMap(year, month) {
        console.log('displayMap called:', year, month);
        const mapData = this.getMapForMonth(year, month);
        
        if (!mapData) {
            console.log('No map data found for', year, month);
            this.showMapPlaceholder(year, month);
            return;
        }

        console.log('Map data:', mapData.filename_night1, mapData.filename_night2, mapData.filename_night3);

        // Update info panel
        this.updateInfoPanel(mapData);
        
        // Update map image
        this.updateMapImage(mapData);
        
        // Show map container
        this.showMapContainer();
    }

    /**
     * Get map data for a specific year/month
     */
    getMapForMonth(year, month) {
        if (!this.mapsData || !this.mapsData.maps) return null;
        
        return this.mapsData.maps.find(map => 
            map.hijri_year === year && map.hijri_month === month
        );
    }

    /**
     * Update the info panel with map details
     */
    updateInfoPanel(mapData) {
        const elements = {
            'map-title': mapData.title,
            'hijri-month': `${this.monthNames[mapData.hijri_month].ar} (${this.monthNames[mapData.hijri_month].en})`,
            'hijri-year': `${mapData.hijri_year} H`,
            'observation-date': this.formatDate(mapData.observation_date_night1),
            'month-start': this.formatDate(mapData.month_start_gregorian)
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Update the three night dates
        this.updateNightDates(mapData);
    }

    /**
     * Update the three night map images
     */
    updateMapImage(mapData) {
        // Update all three night maps
        const nights = [
            { id: 'night1', filename: mapData.filename_night1 },
            { id: 'night2', filename: mapData.filename_night2 },
            { id: 'night3', filename: mapData.filename_night3 }
        ];

        nights.forEach(night => {
            this.updateSingleNightMap(night.id, night.filename, mapData.title);
        });
    }

    /**
     * Update a single night map
     */
    updateSingleNightMap(nightId, filename, title) {
        const mapImage = document.getElementById(`map-image-${nightId}`);
        const mapPlaceholder = document.getElementById(`map-placeholder-${nightId}`);
        
        if (!mapImage) return;

        if (!filename) {
            mapImage.style.display = 'none';
            if (mapPlaceholder) mapPlaceholder.style.display = 'block';
            return;
        }

        // Hide placeholder
        if (mapPlaceholder) {
            mapPlaceholder.style.display = 'none';
        }

        // Set image directly — simpler and more reliable
        mapImage.src = `./maps/${filename}`;
        mapImage.alt = `${title} ${nightId.charAt(0).toUpperCase() + nightId.slice(1)}`;
        mapImage.style.display = 'block';
        mapImage.onclick = () => this.openFullscreenMap(filename, title, nightId);
        
        // Handle load error
        mapImage.onerror = () => {
            mapImage.style.display = 'none';
            if (mapPlaceholder) mapPlaceholder.style.display = 'block';
        };
    }

    /**
     * Update the night dates display
     */
    updateNightDates(mapData) {
        const nightDates = [
            { id: 'night1-date', date: mapData.observation_date_night1 },
            { id: 'night2-date', date: mapData.observation_date_night2 },
            { id: 'night3-date', date: mapData.observation_date_night3 }
        ];

        nightDates.forEach(({ id, date }) => {
            const element = document.getElementById(id);
            if (element && date) {
                element.textContent = `Evening, ${this.formatDate(date)}`;
            }
        });
    }

    /**
     * Show placeholder when map is not available
     */
    showMapPlaceholder(year, month) {
        const monthName = this.monthNames[month].en;
        
        // Update info panel with available data
        const elements = {
            'map-title': `${monthName} ${year}H`,
            'hijri-month': `${this.monthNames[month].ar} (${monthName})`,
            'hijri-year': `${year} H`,
            'observation-date': 'Calculating...',
            'month-start': 'Calculating...'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Show placeholders for all three nights
        ['night1', 'night2', 'night3'].forEach(nightId => {
            const mapImage = document.getElementById(`map-image-${nightId}`);
            const mapPlaceholder = document.getElementById(`map-placeholder-${nightId}`);
            
            if (mapImage) mapImage.style.display = 'none';
            if (mapPlaceholder) mapPlaceholder.style.display = 'block';
        });

        // Update night dates
        ['night1-date', 'night2-date', 'night3-date'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Evening, calculating...';
            }
        });

        this.showMapContainer();
    }

    /**
     * Open fullscreen map view
     */
    openFullscreenMap(filename, title, nightId) {
        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <div class="fullscreen-content">
                <div class="fullscreen-header">
                    <h3>${title} - ${nightId.charAt(0).toUpperCase() + nightId.slice(1)}</h3>
                    <button class="close-btn" onclick="this.closest('.fullscreen-overlay').remove()">×</button>
                </div>
                <img src="./maps/${filename}" alt="${title} ${nightId}" class="fullscreen-image">
            </div>
        `;
        
        // Add styles
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        `;

        const content = overlay.querySelector('.fullscreen-content');
        content.style.cssText = `
            background: #1a1a1a;
            border-radius: 12px;
            border: 2px solid #ffd700;
            max-width: 95%;
            max-height: 95%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const header = overlay.querySelector('.fullscreen-header');
        header.style.cssText = `
            background: #333;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #444;
        `;

        const title_elem = header.querySelector('h3');
        title_elem.style.cssText = `
            color: #ffd700;
            margin: 0;
            font-size: 1.3rem;
        `;

        const closeBtn = header.querySelector('.close-btn');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #fff;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
        `;

        const img = overlay.querySelector('.fullscreen-image');
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            flex: 1;
            min-height: 0;
        `;

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        document.body.appendChild(overlay);
    }

    /**
     * Show the welcome message
     */
    showWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcome-message');
        const mapContainer = document.getElementById('map-container');
        
        if (welcomeMessage) welcomeMessage.style.display = 'block';
        if (mapContainer) mapContainer.style.display = 'none';
    }

    /**
     * Hide the welcome message
     */
    hideWelcomeMessage() {
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) welcomeMessage.style.display = 'none';
    }

    /**
     * Show the map container
     */
    showMapContainer() {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) mapContainer.style.display = 'grid';
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Show error message to user
     */
    showError(message) {
        const container = document.querySelector('.container');
        if (!container) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background-color: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: 600;
        `;
        errorDiv.textContent = message;

        const header = container.querySelector('.header');
        if (header) {
            header.insertAdjacentElement('afterend', errorDiv);
        }
    }
}

/**
 * Utility functions
 */

// Scroll to top function (for potential future use)
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Download map function (for potential future feature)
function downloadMap(filename) {
    if (!filename) return;
    
    const link = document.createElement('a');
    link.href = `./maps/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Hilal Visibility Maps app...');
    new HilalApp();
});

// Service worker registration for potential PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you want to add PWA features
        // navigator.serviceWorker.register('./sw.js')
        //     .then(reg => console.log('SW registered'))
        //     .catch(err => console.log('SW registration failed'));
    });
}