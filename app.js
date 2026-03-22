/**
 * Kawal Hilal — Bilingual (ID/EN) Hilal Visibility Maps
 */

const I18N = {
    id: {
        subtitle: 'Peta Prediksi Visibilitas Hilal',
        methodology: 'Berdasarkan Kriteria Shaukat & Parameter Turki 2016/KHGT',
        hijriYear: 'Tahun Hijriah:',
        selectYear: 'Pilih Tahun',
        welcomeTitle: 'Selamat Datang di Kawal Hilal',
        welcomeDesc: 'Pilih tahun Hijriah di atas untuk melihat prediksi visibilitas hilal setiap bulan. Peta ini menunjukkan di mana dan kapan hilal (bulan sabit baru) dapat diamati setelah konjungsi.',
        threeNightsTitle: 'Cerita Visibilitas 3 Malam',
        threeNightsDesc: 'Setiap bulan menampilkan <strong>tiga malam berturut-turut</strong> untuk menunjukkan perkembangan visibilitas hilal:',
        night1Label: 'Malam 1:', night1Desc: 'Malam pengamatan tradisional (sering sulit)',
        night2Label: 'Malam 2:', night2Desc: 'Satu hari kemudian (biasanya lebih mudah)',
        night3Label: 'Malam 3:', night3Desc: 'Dua hari kemudian (jelas terlihat di sebagian besar wilayah)',
        threeNightsConclusion: 'Progresi ini menunjukkan peningkatan dramatis visibilitas yang terjadi setiap hari.',
        legendTitle: 'Legenda Peta',
        zoneA: 'Zona A: Mudah terlihat (mata telanjang)',
        zoneB: 'Zona B: Terlihat (kondisi sempurna)',
        zoneC: 'Zona C: Perlu alat bantu optik untuk menemukan',
        zoneD: 'Zona D: Terlihat hanya dengan alat bantu optik',
        khgtLine: 'Kriteria Turki 2016 / KHGT',
        hijriMonthLabel: 'Bulan Hijriah:',
        hijriYearLabel: 'Tahun Hijriah:',
        obsDateLabel: 'Tanggal Pengamatan:',
        visAtLocation: 'Visibilitas di lokasi Anda:',
        detectBtn: 'Deteksi',
        checkBtn: 'Cek',
        locationPlaceholder: 'contoh: -6.2, 106.8 (Jakarta)',
        night1Header: 'Malam 1', night2Header: 'Malam 2', night3Header: 'Malam 3',
        legendNote: 'Garis kuning menunjukkan batas kriteria Turki 2016/KHGT (elongasi ≥ 8° DAN altitude bulan ≥ 5°).',
        aboutTitle: 'Tentang Peta Ini',
        methodologyTitle: 'Metodologi',
        methodologyDesc: 'Peta ini menggunakan <strong>Kriteria Shaukat</strong> yang dikembangkan oleh Khalid Shaukat, berdasarkan analisis ekstensif data pengamatan hilal historis. Kriteria ini mempertimbangkan altitude bulan, lebar sabit, dan kondisi pengamatan untuk memprediksi zona visibilitas.',
        zoneClassTitle: 'Klasifikasi Zona',
        zoneALabel: 'Zona A (Biru):', zoneADesc: 'Hilal mudah terlihat dengan mata telanjang dalam kondisi baik',
        zoneBLabel: 'Zona B (Cyan):', zoneBDesc: 'Terlihat dengan mata telanjang hanya dalam kondisi sempurna',
        zoneCLabel: 'Zona C (Magenta):', zoneCDesc: 'Perlu alat bantu optik untuk menemukan, lalu terlihat mata telanjang',
        zoneDLabel: 'Zona D (Merah):', zoneDDesc: 'Hanya terlihat dengan alat bantu optik (teropong/teleskop)',
        khgtTitle: 'Kriteria Turki 2016 / KHGT',
        khgtDesc: 'Garis kuning mewakili kriteria Turki 2016 (juga dikenal sebagai KHGT), yang mensyaratkan elongasi ≥ 8° DAN altitude bulan ≥ 5°.',
        obsDateTitle: 'Tanggal Pengamatan',
        obsDateDesc: 'Setiap peta menunjukkan visibilitas untuk malam <em>sebelum</em> bulan Hijriah baru dimulai. Ini adalah saat komunitas Muslim secara tradisional mencari hilal untuk menentukan awal bulan.',
        notesTitle: 'Catatan Penting',
        note1: 'Ini adalah prediksi teoretis berdasarkan perhitungan astronomi',
        note2: 'Pengamatan aktual tergantung cuaca lokal, kondisi atmosfer, dan pengalaman pengamat',
        note3: 'Selalu rujuk ke otoritas keagamaan lokal untuk pengumuman resmi rukyatul hilal',
        note4: 'Peta menggunakan resolusi grid 2° untuk efisiensi komputasi',
        footerCredits: 'Peta dibuat menggunakan perhitungan visibilitas berdasarkan <a href="http://moonsighting.com" target="_blank" rel="noopener">Kriteria Shaukat</a> yang dikembangkan oleh Khalid Shaukat di moonsighting.com.',
        footerMade: 'Dibuat dengan ❤️ untuk umat Muslim • Data mencakup tahun Hijriah 1447-1452 (≈2025-2031 M)',
        eveningOf: 'Malam,',
        monthStarts: '🌙 Awal bulan kemungkinan:',
        monthStartsBased: '(berdasarkan visibilitas Malam',
        notVisible: '❌ Hilal tidak terlihat di lokasi ini pada ketiga malam',
        detecting: '⏳ Mendeteksi...',
        geoUnsupported: 'Geolokasi tidak didukung browser Anda',
        geoDenied: 'Akses lokasi ditolak. Masukkan koordinat secara manual.',
        enterCoords: 'Masukkan lat, lon (contoh: -6.2, 106.8 untuk Jakarta)',
        invalidFormat: 'Format tidak valid. Gunakan: latitude, longitude',
        outOfRange: 'Koordinat di luar jangkauan',
        selectMonthFirst: 'Pilih bulan terlebih dahulu',
        calculating: 'Menghitung...',
        mapNotAvailable: 'Peta belum tersedia'
    },
    en: {
        subtitle: 'Crescent Moon Sighting Predictions',
        methodology: 'Based on Shaukat Criterion & Turkey 2016/KHGT Parameters',
        hijriYear: 'Hijri Year:',
        selectYear: 'Select Year',
        welcomeTitle: 'Welcome to Kawal Hilal',
        welcomeDesc: 'Select a Hijri year above to view crescent moon visibility predictions for each month. These maps show where and when the new crescent moon (hilal) can be sighted after conjunction.',
        threeNightsTitle: '3-Night Visibility Story',
        threeNightsDesc: 'Each month shows <strong>three consecutive nights</strong> to illustrate how crescent moon visibility progresses:',
        night1Label: 'Night 1:', night1Desc: 'Traditional observation evening (often challenging)',
        night2Label: 'Night 2:', night2Desc: 'One day later (usually easier to spot)',
        night3Label: 'Night 3:', night3Desc: 'Two days later (clearly visible in most areas)',
        threeNightsConclusion: 'This progression shows the dramatic improvement in visibility that occurs with each passing day.',
        legendTitle: 'Map Legend',
        zoneA: 'Zone A: Easily visible (naked eye)',
        zoneB: 'Zone B: Visible (perfect conditions)',
        zoneC: 'Zone C: Optical aid needed to find',
        zoneD: 'Zone D: Visible with optical aid only',
        khgtLine: 'Turkey 2016 / KHGT criterion',
        hijriMonthLabel: 'Hijri Month:',
        hijriYearLabel: 'Hijri Year:',
        obsDateLabel: 'Observation Date:',
        visAtLocation: 'Visibility at your location:',
        detectBtn: 'Detect',
        checkBtn: 'Check',
        locationPlaceholder: 'e.g. 21.4, 39.8 (Makkah)',
        night1Header: 'Night 1', night2Header: 'Night 2', night3Header: 'Night 3',
        legendNote: 'The yellow line shows the Turkey 2016/KHGT criterion boundary (elongation ≥ 8° AND moon altitude ≥ 5°).',
        aboutTitle: 'About These Maps',
        methodologyTitle: 'Methodology',
        methodologyDesc: 'These maps use the <strong>Shaukat Criterion</strong> developed by Khalid Shaukat, based on extensive analysis of historical crescent sighting data. The criterion considers moon altitude, crescent width, and observing conditions to predict visibility zones.',
        zoneClassTitle: 'Zone Classification',
        zoneALabel: 'Zone A (Blue):', zoneADesc: 'Crescent easily visible to naked eye under good conditions',
        zoneBLabel: 'Zone B (Cyan):', zoneBDesc: 'Visible to naked eye only under perfect conditions',
        zoneCLabel: 'Zone C (Magenta):', zoneCDesc: 'Optical aid needed to locate, then visible to naked eye',
        zoneDLabel: 'Zone D (Red):', zoneDDesc: 'Visible only with optical aid (binoculars/telescope)',
        khgtTitle: 'Turkey 2016 / KHGT Criterion',
        khgtDesc: 'The yellow line represents the Turkey 2016 criterion (also known as KHGT), which requires both elongation ≥ 8° AND moon altitude ≥ 5°.',
        obsDateTitle: 'Observation Dates',
        obsDateDesc: 'Each map shows visibility for the evening <em>before</em> the new Hijri month begins. This is when Muslim communities traditionally look for the new crescent moon to determine the start of lunar months.',
        notesTitle: 'Important Notes',
        note1: 'These are theoretical predictions based on astronomical calculations',
        note2: 'Actual sighting depends on local weather, atmospheric conditions, and observer experience',
        note3: 'Always consult local religious authorities for official moon sighting announcements',
        note4: 'Maps use a 2° grid resolution for computational efficiency',
        footerCredits: 'Maps generated using visibility calculations based on the <a href="http://moonsighting.com" target="_blank" rel="noopener">Shaukat Criterion</a> developed by Khalid Shaukat at moonsighting.com.',
        footerMade: 'Created with ❤️ for the Muslim community • Data covers Hijri years 1447-1452 (≈2025-2031 CE)',
        eveningOf: 'Evening,',
        monthStarts: '🌙 Month likely starts:',
        monthStartsBased: '(based on Night',
        notVisible: '❌ Crescent not visible at this location in any of the 3 nights',
        detecting: '⏳ Detecting...',
        geoUnsupported: 'Geolocation not supported by your browser',
        geoDenied: 'Location access denied. Enter coordinates manually.',
        enterCoords: 'Enter lat, lon (e.g. 21.4, 39.8 for Makkah)',
        invalidFormat: 'Invalid format. Use: latitude, longitude',
        outOfRange: 'Coordinates out of range',
        selectMonthFirst: 'Select a month first',
        calculating: 'Calculating...',
        mapNotAvailable: 'Map not available'
    }
};

class HilalApp {
    constructor() {
        this.mapsData = null;
        this.currentYear = null;
        this.currentMonth = null;
        this.lang = localStorage.getItem('kawalhilal_lang') || 'id';

        this.monthNames = {
            1: { en: 'Muharram', id: 'Muharam', ar: 'محرم' },
            2: { en: 'Safar', id: 'Safar', ar: 'صفر' },
            3: { en: "Rabi' al-Awwal", id: 'Rabiulawal', ar: 'ربيع الأول' },
            4: { en: "Rabi' al-Thani", id: 'Rabiulakhir', ar: 'ربيع الثاني' },
            5: { en: 'Jumada al-Awwal', id: 'Jumadilawal', ar: 'جمادى الأولى' },
            6: { en: 'Jumada al-Thani', id: 'Jumadilakhir', ar: 'جمادى الثانية' },
            7: { en: 'Rajab', id: 'Rajab', ar: 'رجب' },
            8: { en: "Sha'ban", id: 'Syakban', ar: 'شعبان' },
            9: { en: 'Ramadan', id: 'Ramadan', ar: 'رمضان' },
            10: { en: 'Shawwal', id: 'Syawal', ar: 'شوال' },
            11: { en: "Dhu al-Qi'dah", id: 'Zulkaidah', ar: 'ذو القعدة' },
            12: { en: 'Dhu al-Hijjah', id: 'Zulhijjah', ar: 'ذو الحجة' }
        };

        this.init();
    }

    t(key) { return I18N[this.lang]?.[key] || I18N['en'][key] || key; }

    setLang(lang) {
        this.lang = lang;
        localStorage.setItem('kawalhilal_lang', lang);
        document.documentElement.lang = lang;
        document.getElementById('lang-id').classList.toggle('active', lang === 'id');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        this.applyI18n();
        // Re-render month grid if a year is selected
        if (this.currentYear) this.populateMonthGrid(this.currentYear);
        // Re-render info panel if a month is selected
        if (this.currentYear && this.currentMonth) {
            const mapData = this.getMapForMonth(this.currentYear, this.currentMonth);
            if (mapData) this.updateInfoPanel(mapData);
        }
    }

    applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key);
            if (text.includes('<')) el.innerHTML = text;
            else el.textContent = text;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
        });
        // Update the select's first option
        const sel = document.getElementById('year-select');
        if (sel && sel.options[0]) sel.options[0].textContent = this.t('selectYear');
    }

    async init() {
        try {
            await this.loadMapsData();
            this.setupEventListeners();
            this.populateYearSelector();
            this.showWelcomeMessage();
            this.setLang(this.lang);
            window.hilalApp = this;
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    async loadMapsData() {
        const response = await fetch('./maps/maps_metadata.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.mapsData = await response.json();
    }

    setupEventListeners() {
        const yearSelect = document.getElementById('year-select');
        if (yearSelect) yearSelect.addEventListener('change', e => this.selectYear(parseInt(e.target.value)));
    }

    populateYearSelector() {
        const yearSelect = document.getElementById('year-select');
        if (!yearSelect || !this.mapsData) return;
        yearSelect.innerHTML = `<option value="">${this.t('selectYear')}</option>`;
        this.mapsData.hijri_years.forEach(year => {
            const opt = document.createElement('option');
            opt.value = year;
            opt.textContent = `${year} H`;
            yearSelect.appendChild(opt);
        });
    }

    selectYear(year) {
        if (!year) { this.showWelcomeMessage(); return; }
        this.currentYear = year;
        this.currentMonth = null;
        this.populateMonthGrid(year);
        this.hideWelcomeMessage();
    }

    populateMonthGrid(year) {
        const grid = document.getElementById('month-grid');
        if (!grid) return;
        grid.innerHTML = '';
        for (let month = 1; month <= 12; month++) {
            const btn = document.createElement('button');
            btn.className = 'month-btn';
            btn.textContent = this.monthNames[month][this.lang] || this.monthNames[month].en;
            btn.dataset.year = year;
            btn.dataset.month = month;
            if (this.currentMonth === month) btn.classList.add('active');
            const mapExists = this.getMapForMonth(year, month);
            if (!mapExists) { btn.disabled = true; btn.title = this.t('mapNotAvailable'); }
            btn.addEventListener('click', () => { if (!btn.disabled) this.selectMonth(year, month); });
            grid.appendChild(btn);
        }
    }

    selectMonth(year, month) {
        this.currentYear = year;
        this.currentMonth = month;
        document.querySelectorAll('.month-btn').forEach(b => b.classList.remove('active'));
        const active = document.querySelector(`[data-year="${year}"][data-month="${month}"]`);
        if (active) active.classList.add('active');
        this.displayMap(year, month);
    }

    displayMap(year, month) {
        const mapData = this.getMapForMonth(year, month);
        if (!mapData) { this.showMapPlaceholder(year, month); return; }
        this.updateInfoPanel(mapData);
        this.updateMapImage(mapData);
        this.showMapContainer();
    }

    getMapForMonth(year, month) {
        if (!this.mapsData?.maps) return null;
        return this.mapsData.maps.find(m => m.hijri_year === year && m.hijri_month === month);
    }

    updateInfoPanel(mapData) {
        const mn = this.monthNames[mapData.hijri_month];
        const monthDisplay = `${mn.ar} (${mn[this.lang] || mn.en})`;
        const els = {
            'map-title': mapData.title,
            'hijri-month': monthDisplay,
            'hijri-year': `${mapData.hijri_year} H`,
            'observation-date': this.formatDate(mapData.observation_date_night1)
        };
        Object.entries(els).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        });
        this.updateNightDates(mapData);
    }

    updateMapImage(mapData) {
        ['night1', 'night2', 'night3'].forEach(n => {
            this.updateSingleNightMap(n, mapData[`filename_${n}`], mapData.title);
        });
    }

    updateSingleNightMap(nightId, filename, title) {
        const img = document.getElementById(`map-image-${nightId}`);
        const ph = document.getElementById(`map-placeholder-${nightId}`);
        if (!img) return;
        if (!filename) { img.style.display = 'none'; if (ph) ph.style.display = 'block'; return; }
        if (ph) ph.style.display = 'none';
        img.src = `./maps/${filename}`;
        img.alt = `${title} ${nightId}`;
        img.style.display = 'block';
        img.onclick = () => this.openFullscreenMap(filename, title, nightId);
        img.onerror = () => { img.style.display = 'none'; if (ph) ph.style.display = 'block'; };
    }

    updateNightDates(mapData) {
        [1, 2, 3].forEach(i => {
            const el = document.getElementById(`night${i}-date`);
            const d = mapData[`observation_date_night${i}`];
            if (el && d) el.textContent = `${this.t('eveningOf')} ${this.formatDate(d)}`;
        });
    }

    showMapPlaceholder(year, month) {
        const mn = this.monthNames[month];
        document.getElementById('map-title').textContent = `${mn[this.lang] || mn.en} ${year}H`;
        document.getElementById('hijri-month').textContent = `${mn.ar} (${mn[this.lang] || mn.en})`;
        document.getElementById('hijri-year').textContent = `${year} H`;
        document.getElementById('observation-date').textContent = this.t('calculating');
        ['night1','night2','night3'].forEach(n => {
            const img = document.getElementById(`map-image-${n}`);
            const ph = document.getElementById(`map-placeholder-${n}`);
            if (img) img.style.display = 'none';
            if (ph) ph.style.display = 'block';
        });
        this.showMapContainer();
    }

    openFullscreenMap(filename, title, nightId) {
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
        overlay.innerHTML = `
            <div style="background:#1a1a1a;border-radius:12px;border:2px solid #ffd700;max-width:95%;max-height:95%;display:flex;flex-direction:column;overflow:hidden;">
                <div style="background:#333;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #444;">
                    <h3 style="color:#ffd700;margin:0;font-size:1.3rem;">${title} - ${nightId}</h3>
                    <button style="background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;" onclick="this.closest('.fullscreen-overlay').remove()">×</button>
                </div>
                <img src="./maps/${filename}" alt="${title}" style="max-width:100%;max-height:100%;object-fit:contain;flex:1;min-height:0;">
            </div>`;
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); } });
        document.body.appendChild(overlay);
    }

    showWelcomeMessage() {
        const w = document.getElementById('welcome-message');
        const m = document.getElementById('map-container');
        if (w) w.style.display = 'block';
        if (m) m.style.display = 'none';
    }
    hideWelcomeMessage() { const w = document.getElementById('welcome-message'); if (w) w.style.display = 'none'; }
    showMapContainer() { const m = document.getElementById('map-container'); if (m) m.style.display = 'grid'; }

    formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const d = new Date(dateString + 'T00:00:00');
            const locale = this.lang === 'id' ? 'id-ID' : 'en-US';
            return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch { return dateString; }
    }

    // --- Location visibility ---
    detectLocation() {
        const btn = document.getElementById('detect-location-btn');
        const input = document.getElementById('location-input');
        if (!navigator.geolocation) { this.showLocationResult(this.t('geoUnsupported')); return; }
        btn.innerHTML = `📍 ${this.t('detecting')}`;
        btn.disabled = true;
        navigator.geolocation.getCurrentPosition(
            pos => {
                input.value = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
                btn.innerHTML = `📍 <span data-i18n="detectBtn">${this.t('detectBtn')}</span>`;
                btn.disabled = false;
                this.checkLocationVisibility();
            },
            () => {
                btn.innerHTML = `📍 <span data-i18n="detectBtn">${this.t('detectBtn')}</span>`;
                btn.disabled = false;
                this.showLocationResult(this.t('geoDenied'));
            },
            { timeout: 10000 }
        );
    }

    checkLocationVisibility() {
        const val = document.getElementById('location-input').value.trim();
        if (!val) { this.showLocationResult(this.t('enterCoords')); return; }
        const parts = val.split(',').map(s => parseFloat(s.trim()));
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) { this.showLocationResult(this.t('invalidFormat')); return; }
        const [lat, lon] = parts;
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) { this.showLocationResult(this.t('outOfRange')); return; }
        const mapData = this.getMapForMonth(this.currentYear, this.currentMonth);
        if (!mapData) { this.showLocationResult(this.t('selectMonthFirst')); return; }

        const nights = [
            { id: 'night1', file: mapData.filename_night1, date: mapData.observation_date_night1 },
            { id: 'night2', file: mapData.filename_night2, date: mapData.observation_date_night2 },
            { id: 'night3', file: mapData.filename_night3, date: mapData.observation_date_night3 }
        ];
        const results = [];
        let loaded = 0;
        nights.forEach((night, idx) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => { results[idx] = { ...night, zone: this.sampleZone(img, lat, lon) }; if (++loaded === 3) this.renderLocationResult(results, lat, lon); };
            img.onerror = () => { results[idx] = { ...night, zone: null }; if (++loaded === 3) this.renderLocationResult(results, lat, lon); };
            img.src = `./maps/${night.file}`;
        });
    }

    sampleZone(img, lat, lon) {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const mL = 0.095 * c.width, mR = 0.03 * c.width, mT = 0.11 * c.height, mB = 0.13 * c.height;
        const pW = c.width - mL - mR, pH = c.height - mT - mB;
        const px = mL + ((lon + 180) / 360) * pW;
        const py = mT + ((90 - lat) / 180) * pH;
        const zones = [];
        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
            const sx = Math.round(px + dx), sy = Math.round(py + dy);
            if (sx >= 0 && sx < c.width && sy >= 0 && sy < c.height) {
                const p = ctx.getImageData(sx, sy, 1, 1).data;
                const z = this.pxZone(p[0], p[1], p[2], p[3]);
                if (z) zones.push(z);
            }
        }
        if (!zones.length) return null;
        const cnt = {}; zones.forEach(z => cnt[z] = (cnt[z]||0)+1);
        return Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0];
    }

    pxZone(r, g, b, a) {
        if (a < 100) return null;
        // New colors: Red=D(outer/hardest), Magenta=C, Cyan=B, Blue=A(inner/easiest)
        if (r > 150 && g < 80 && b < 80) return 'D';
        if (r > 150 && g < 80 && b > 150) return 'C';
        if (r < 80 && g > 150 && b > 150) return 'B';
        if (r < 80 && g < 80 && b > 150) return 'A';
        if (r > 180 && g > 180 && b < 80) return 'KHGT';
        return null;
    }

    renderLocationResult(results, lat, lon) {
        const dots = { A:'zone-a', B:'zone-b', C:'zone-c', D:'zone-d', KHGT:'zone-a', null:'zone-none' };
        let first = null;
        for (let i = 0; i < results.length; i++) if (results[i].zone && results[i].zone !== 'KHGT') { first = i; break; }

        const locale = this.lang === 'id' ? 'id-ID' : 'en-US';
        let html = `<div style="color:#aaa;margin-bottom:4px;">📍 ${lat.toFixed(1)}°, ${lon.toFixed(1)}°</div><div class="night-visibility">`;
        results.forEach((r, i) => {
            const dateStr = r.date ? new Date(r.date+'T00:00:00').toLocaleDateString(locale,{month:'short',day:'numeric'}) : '?';
            const dot = r.zone ? dots[r.zone] : 'zone-none';
            html += `<span class="night-vis-item"><span class="vis-dot ${dot}"></span> ${this.lang==='id'?'M':'N'}${i+1} (${dateStr}): ${r.zone||'-'}</span>`;
        });
        html += '</div>';

        if (first !== null) {
            const r = results[first];
            const sd = new Date(r.date+'T00:00:00');
            sd.setDate(sd.getDate()+1);
            const startStr = sd.toLocaleDateString(locale,{year:'numeric',month:'long',day:'numeric'});
            html += `<div class="month-start-text">${this.t('monthStarts')} ${startStr} ${this.t('monthStartsBased')} ${first+1})</div>`;
        } else {
            html += `<div class="month-start-text" style="color:#ff6666;">${this.t('notVisible')}</div>`;
        }
        const div = document.getElementById('location-result');
        div.innerHTML = html;
        div.classList.add('has-result');
    }

    showLocationResult(text) {
        const div = document.getElementById('location-result');
        if (div) { div.textContent = text; div.classList.add('has-result'); }
    }
}

document.addEventListener('DOMContentLoaded', () => new HilalApp());
