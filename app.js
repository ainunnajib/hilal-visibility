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
        const mapData = this.getMapForMonth(year, month);
        
        if (!mapData) {
            this.showMapPlaceholder(year, month);
            return;
        }

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
            'observation-date': this.formatDate(mapData.observation_date),
            'month-start': this.formatDate(mapData.month_start_gregorian)
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    /**
     * Update the map image
     */
    updateMapImage(mapData) {
        const mapImage = document.getElementById('map-image');
        const mapPlaceholder = document.getElementById('map-placeholder');
        
        if (!mapImage) return;

        // Hide placeholder
        if (mapPlaceholder) {
            mapPlaceholder.style.display = 'none';
        }

        // Show loading state
        mapImage.classList.add('map-loading');
        
        // Create new image to test if file exists
        const testImage = new Image();
        
        testImage.onload = () => {
            mapImage.src = `./maps/${mapData.filename}`;
            mapImage.alt = `Hilal visibility map for ${mapData.title}`;
            mapImage.classList.remove('map-loading');
            mapImage.style.display = 'block';
        };
        
        testImage.onerror = () => {
            // Image doesn't exist, show placeholder
            mapImage.style.display = 'none';
            mapImage.classList.remove('map-loading');
            if (mapPlaceholder) {
                mapPlaceholder.style.display = 'block';
            }
        };
        
        testImage.src = `./maps/${mapData.filename}`;
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

        // Show placeholder instead of map
        const mapImage = document.getElementById('map-image');
        const mapPlaceholder = document.getElementById('map-placeholder');
        
        if (mapImage) mapImage.style.display = 'none';
        if (mapPlaceholder) mapPlaceholder.style.display = 'block';

        this.showMapContainer();
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