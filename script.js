// ===== SCROLL PROGRESS =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrolled / total) * 100;
  document.getElementById('progress').style.width = pct + '%';
});

// Subtle parallax on hero mountains
const heroMountains = document.querySelector('.hero-mountains');
if (heroMountains) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.4;
    if (window.scrollY < window.innerHeight) {
      heroMountains.style.transform = `translateY(${offset}px)`;
    }
  });
}

// ===== MAP SETUP =====
const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

// Custom marker icon factory
function stopIcon(label, color) {
  return L.divIcon({
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
    html: `<div style="
      width:30px;height:30px;border-radius:50%;
      background:${color || '#6e2a22'};
      border:3px solid #f4ede0;
      box-shadow:0 2px 8px rgba(31,26,20,0.35);
      display:flex;align-items:center;justify-content:center;
      font-family:'Cormorant Garamond',serif;
      font-size:13px;font-weight:600;color:#f4ede0;
      line-height:1;
    ">${label}</div>`
  });
}

function smallIcon(color) {
  return L.divIcon({
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
    html: `<div style="
      width:12px;height:12px;border-radius:50%;
      background:${color || '#b88940'};
      border:2px solid #f4ede0;
      box-shadow:0 1px 4px rgba(31,26,20,0.3);
    "></div>`
  });
}

// Route stop data — full 20-chapter route
var stops = [
  // I. Southern Coast
  { lat: 6.9271, lng: 79.8612, name: 'Colombo', sub: 'Sri Lanka · arrival', ch: '', target: 'ch1' },
  { lat: 6.0329, lng: 80.2168, name: 'Galle', sub: 'Dutch fort · southern coast', ch: '', target: 'ch1' },
  { lat: 6.0174, lng: 80.2497, name: 'Unawatuna', sub: 'PADI Open Water', ch: '', target: 'ch1' },
  { lat: 5.9485, lng: 80.4543, name: 'Mirissa', sub: 'Blue whale season', ch: 'I', target: 'ch1' },
  // II. Hill Country
  { lat: 6.8667, lng: 81.0466, name: 'Ella', sub: 'Hill country · 1,041 m', ch: '', target: 'ch2' },
  { lat: 7.2906, lng: 80.6337, name: 'Kandy', sub: 'Temple of the Tooth', ch: '', target: 'ch2' },
  { lat: 7.9570, lng: 80.7603, name: 'Sigiriya', sub: 'Lion Rock fortress', ch: 'II', target: 'ch2' },
  // III. Spice Coast
  { lat: 9.9312, lng: 76.2673, name: 'Kochi', sub: 'Kerala · Spice Coast', ch: 'III', target: 'ch3' },
  { lat: 10.0889, lng: 77.0595, name: 'Munnar', sub: 'Tea estates · 1,532 m', ch: '', target: 'ch3' },
  // IV. Ashram
  { lat: 8.5300, lng: 77.1500, name: 'Neyyar Dam', sub: 'Sivananda Ashram · 90 m', ch: 'IV', target: 'ch4' },
  // V. Backwaters
  { lat: 8.7379, lng: 76.7163, name: 'Varkala', sub: 'Red cliffs · Kerala', ch: '', target: 'ch5' },
  { lat: 9.4981, lng: 76.3388, name: 'Alleppey', sub: 'Backwater houseboats', ch: 'V', target: 'ch5' },
  // VI. Hampi
  { lat: 15.3350, lng: 76.4600, name: 'Hampi', sub: 'Vijayanagara ruins · boulders', ch: 'VI', target: 'ch6' },
  // VII. Goa
  { lat: 15.0100, lng: 74.0239, name: 'Palolem', sub: 'South Goa · quiet shore', ch: 'VII', target: 'ch7' },
  // VIII. Holy Cities
  { lat: 25.3176, lng: 83.0068, name: 'Varanasi', sub: 'Ganges · oldest city', ch: '', target: 'ch8' },
  { lat: 30.0869, lng: 78.2676, name: 'Rishikesh', sub: 'Yoga capital · Ganges', ch: '', target: 'ch8' },
  { lat: 31.6200, lng: 74.8765, name: 'Amritsar', sub: 'Golden Temple', ch: 'VIII', target: 'ch8' },
  // IX. Diverging Paths
  { lat: 30.1262, lng: 78.3230, name: 'Tapovan', sub: 'Breathwork · Rishikesh', ch: '', target: 'ch9' },
  { lat: 28.2300, lng: 84.3800, name: 'Besisahar', sub: 'Annapurna Circuit start', ch: '', target: 'ch9' },
  { lat: 28.6650, lng: 84.0150, name: 'Manang', sub: 'Annapurna Circuit · 3,540 m', ch: '', target: 'ch9' },
  { lat: 28.7994, lng: 83.8722, name: 'Thorong La', sub: 'Pass · 5,416 m', ch: 'IX', target: 'ch9' },
  // X. Kathmandu
  { lat: 27.7172, lng: 85.3240, name: 'Kathmandu', sub: 'Threshold · Nepal · 1,400 m', ch: 'X', target: 'ch10' },
  // XI. Lhasa and Everest
  { lat: 30.5728, lng: 104.0668, name: 'Chengdu', sub: 'Tibet permit pick-up · flight from Kathmandu', ch: '', target: 'ch11' },
  { lat: 29.6500, lng: 91.1000, name: 'Lhasa', sub: 'The holy city · 3,656 m', ch: 'XI', target: 'ch11' },
  { lat: 29.0000, lng: 90.6000, name: 'Yamdrok Lake', sub: 'Sacred lake · Karo La', ch: '', target: 'ch11' },
  { lat: 28.9108, lng: 89.6000, name: 'Gyantse', sub: 'Kumbum Stupa', ch: '', target: 'ch11' },
  { lat: 29.2644, lng: 88.8877, name: 'Shigatse', sub: 'Tashilhunpo Monastery', ch: '', target: 'ch11' },
  { lat: 28.1600, lng: 86.8300, name: 'Rongbuk', sub: "Everest's north face · ~5,000 m", ch: '', target: 'ch11' },
  { lat: 29.6500, lng: 91.1000, name: 'Lhasa', sub: 'Back to Lhasa', ch: '', target: 'ch11', noMarker: true },
  // XII. Sky Train
  { lat: 33.0000, lng: 91.7300, name: 'Tanggula Pass', sub: 'Highest railway · 5,072 m', ch: 'XII', target: 'ch12' },
  { lat: 35.6147, lng: 94.9162, name: 'Hoh Xil', sub: 'High cold desert', ch: '', target: 'ch12' },
  // XIII. Hexi Corridor
  { lat: 36.6200, lng: 101.7770, name: 'Xining', sub: 'Gateway to the Silk Road', ch: '', target: 'ch13' },
  { lat: 38.9260, lng: 100.4500, name: 'Zhangye', sub: 'Rainbow Danxia', ch: 'XIII', target: 'ch13' },
  { lat: 39.7700, lng: 98.2900, name: 'Jiayuguan', sub: 'End of the Great Wall', ch: '', target: 'ch13' },
  // XIV. Dunhuang
  { lat: 40.1420, lng: 94.6620, name: 'Dunhuang', sub: 'Mogao Caves · Crescent Lake', ch: 'XIV', target: 'ch14' },
  // XV. Turpan & Urumqi
  { lat: 42.9476, lng: 89.1896, name: 'Turpan', sub: 'Oasis of fire · −154 m', ch: 'XV', target: 'ch15' },
  // XVI. Kashgar
  { lat: 39.4697, lng: 75.9899, name: 'Kashgar', sub: 'Last city of China · 1,289 m', ch: 'XVI', target: 'ch16' },
  // XVII. Irkeshtam
  { lat: 39.7200, lng: 73.8500, name: 'Irkeshtam Pass', sub: 'China–Kyrgyzstan border', ch: '', target: 'ch17' },
  { lat: 39.7252, lng: 73.2428, name: 'Sary-Tash', sub: 'Alay Valley · 3,170 m', ch: 'XVII', target: 'ch17' },
  { lat: 40.5283, lng: 72.7985, name: 'Osh', sub: 'Sulaiman-Too · Jayma bazaar', ch: '', target: 'ch17' },
  // XVIII. Kyrgyzstan
  { lat: 42.8746, lng: 74.5698, name: 'Bishkek', sub: 'Kyrgyzstan capital', ch: '', target: 'ch18' },
  { lat: 42.4907, lng: 78.3958, name: 'Karakol', sub: 'Altyn Arashan · mountains', ch: '', target: 'ch18' },
  { lat: 41.8400, lng: 75.1400, name: 'Song Kol', sub: 'Alpine lake · 3,016 m', ch: 'XVIII', target: 'ch18' },
  // XIX. Silk Road Cities
  { lat: 41.2995, lng: 69.2401, name: 'Tashkent', sub: 'Uzbekistan capital', ch: '', target: 'ch19' },
  { lat: 39.6542, lng: 66.9597, name: 'Samarkand', sub: 'Registan · Timur legacy', ch: '', target: 'ch19' },
  { lat: 39.7681, lng: 64.4556, name: 'Bukhara', sub: 'Living Silk Road city', ch: 'XIX', target: 'ch19' },
  // XX. Georgia
  { lat: 41.6934, lng: 44.8015, name: 'Tbilisi', sub: 'Georgia · sulfur baths', ch: '', target: 'ch20' },
  { lat: 42.6593, lng: 44.6388, name: 'Kazbegi', sub: 'Gergeti Trinity · 2,170 m', ch: '', target: 'ch20' },
  { lat: 41.6168, lng: 45.9285, name: 'Sighnaghi', sub: 'Kakheti wine region', ch: 'XX', target: 'ch20' }
];

// Route polyline coordinates
var routeCoords = stops.map(function(s) { return [s.lat, s.lng]; });

// ---------- OVERVIEW MAP ----------
var overviewMap = L.map('overview-map', {
  scrollWheelZoom: false,
  zoomControl: true,
  attributionControl: true
});
L.tileLayer(tileUrl, { attribution: tileAttr, maxZoom: 12 }).addTo(overviewMap);

// Route polyline
L.polyline(routeCoords, {
  color: '#6e2a22',
  weight: 2.5,
  opacity: 0.7,
  dashArray: '8, 6',
  lineCap: 'round'
}).addTo(overviewMap);

// Major stop markers (chapter-start cities)
var majorIndices = [];
stops.forEach(function(s, i) {
  if (s.ch) majorIndices.push(i);
});

stops.forEach(function(s, i) {
  if (s.noMarker) return;
  var isMajor = majorIndices.indexOf(i) > -1;
  var icon = isMajor ? stopIcon(s.ch || '●', '#6e2a22') : smallIcon('#b88940');
  var marker = L.marker([s.lat, s.lng], { icon: icon })
    .bindPopup('<strong>' + s.name + '</strong><em>' + s.sub + '</em><br><a href="#' + s.target + '" class="map-popup-link" onclick="event.preventDefault(); document.getElementById(\'' + s.target + '\').scrollIntoView({behavior:\'smooth\', block:\'start\'});">Read chapter →</a>')
    .addTo(overviewMap);
});

// Add cursor pointer to all map markers
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('#overview-map .leaflet-marker-icon').forEach(function(el) {
    el.style.cursor = 'pointer';
  });
});

overviewMap.fitBounds(routeCoords, { padding: [40, 40] });

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  var revealConfig = [
    { selector: '.chapter-header', cls: 'reveal' },
    { selector: '.chapter-hero', cls: 'reveal reveal--scale reveal--slow' },
    { selector: '.chapter-body > div:first-child', cls: 'reveal reveal--left' },
    { selector: '.chapter-body > div:last-child', cls: 'reveal reveal--right' },
    { selector: '.highlight', cls: 'reveal', stagger: true },
    { selector: '.why-worth-it', cls: 'reveal' },
    { selector: '.practical', cls: 'reveal' },
    { selector: '.magic-moment-label', cls: 'reveal' },
    { selector: '.route-overview .section-title', cls: 'reveal' },
    { selector: '.route-overview .section-eyebrow', cls: 'reveal' },
    { selector: '.route-map-wrapper', cls: 'reveal reveal--scale' },
    { selector: '.route-list li', cls: 'reveal', stagger: true },
    { selector: '.epilogue .section-title', cls: 'reveal' },
    { selector: '.epilogue .section-eyebrow', cls: 'reveal' },
    { selector: '.ref-card', cls: 'reveal', stagger: true },
    { selector: '.closing-text', cls: 'reveal reveal--fade' },
    { selector: '.closing-sig', cls: 'reveal reveal--fade' },
  ];

  var allRevealEls = [];
  revealConfig.forEach(function(cfg) {
    var els = document.querySelectorAll(cfg.selector);
    els.forEach(function(el, i) {
      if (el.closest('.hero')) return;
      cfg.cls.split(' ').forEach(function(c) { if (c) el.classList.add(c); });
      if (cfg.stagger) {
        var parent = el.parentElement;
        var tagSelector = cfg.selector.split(' ').pop();
        var siblings = Array.from(parent.children).filter(function(child) {
          return child.matches(tagSelector);
        });
        var sibIndex = siblings.indexOf(el);
        if (sibIndex < 0) sibIndex = i;
        if (sibIndex < 9) {
          el.classList.add('reveal--d' + (sibIndex + 1));
        }
      }
      allRevealEls.push(el);
    });
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  allRevealEls.forEach(function(el) {
    observer.observe(el);
  });
}
document.addEventListener("DOMContentLoaded", initScrollReveal);

// ===== PARALLAX CHAPTER HEROES =====
function updateParallax() {
  var heroImages = document.querySelectorAll('.chapter-hero .scene');
  var windowH = window.innerHeight;
  heroImages.forEach(function(img) {
    var rect = img.parentElement.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > windowH + 100) return;
    var progress = (windowH - rect.top) / (windowH + rect.height);
    var offset = (progress - 0.5) * 50;
    img.style.transform = 'translateY(' + offset + 'px)';
  });
}
document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax, { passive: true });
  updateParallax();
});

// ===== MAGIC MOMENT WORD-BY-WORD REVEAL =====
function initMagicReveal() {
  var magicTexts = document.querySelectorAll('.magic-moment-text');
  if (!magicTexts.length) return;

  magicTexts.forEach(function(textEl) {
    var text = textEl.textContent.trim();
    var words = text.split(/\s+/);
    textEl.innerHTML = words.map(function(word, i) {
      var delay = (i * 0.035).toFixed(3);
      return '<span class="magic-word" style="transition-delay:' + delay + 's">' + word + '</span>';
    }).join(' ');
  });

  var magicObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var moment = entry.target.closest('.magic-moment');
        setTimeout(function() {
          moment.classList.add('words-visible');
        }, 150);
        magicObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '0px 0px -30px 0px'
  });

  magicTexts.forEach(function(el) {
    magicObserver.observe(el);
  });
}
document.addEventListener("DOMContentLoaded", initMagicReveal);

// ===== ELEVATION PROFILE =====
function initElevation() {
  var svg = document.getElementById('elevation-svg');
  var tooltip = document.getElementById('elev-tooltip');
  var vline = document.getElementById('elev-line');
  if (!svg) return;

  // Full route elevation data — Colombo to Tbilisi
  var elevData = [
    { name: 'Colombo', alt: 10, km: 0, day: 1 },
    { name: 'Galle', alt: 12, km: 110, day: 4 },
    { name: 'Unawatuna', alt: 5, km: 110, day: 6 },
    { name: 'Mirissa', alt: 8, km: 130, day: 10 },
    { name: 'Ella', alt: 1041, km: 260, day: 11 },
    { name: 'Kandy', alt: 465, km: 320, day: 15 },
    { name: 'Sigiriya', alt: 349, km: 400, day: 18 },
    { name: 'Kochi', alt: 10, km: 940, day: 20 },
    { name: 'Munnar', alt: 1532, km: 1030, day: 23 },
    { name: 'Neyyar Dam', alt: 90, km: 1200, day: 27 },
    { name: 'Varkala', alt: 15, km: 1250, day: 58 },
    { name: 'Alleppey', alt: 5, km: 1350, day: 62 },
    { name: 'Hampi', alt: 467, km: 2000, day: 65 },
    { name: 'Palolem', alt: 10, km: 2260, day: 73 },
    { name: 'Varanasi', alt: 80, km: 3740, day: 87 },
    { name: 'Rishikesh', alt: 340, km: 4450, day: 94 },
    { name: 'Amritsar', alt: 234, km: 4810, day: 100 },
    { name: 'Besisahar', alt: 760, km: 5800, day: 107 },
    { name: 'Manang', alt: 3540, km: 5860, day: 112 },
    { name: 'Thorong La', alt: 5416, km: 5880, day: 117 },
    { name: 'Kathmandu', alt: 1400, km: 6070, day: 126 },
    { name: 'Chengdu', alt: 500, km: 7920, day: 133 },
    { name: 'Lhasa', alt: 3656, km: 9170, day: 134 },
    { name: 'Yamdrok Lake', alt: 4441, km: 9250, day: 139 },
    { name: 'Gyantse', alt: 4040, km: 9350, day: 140 },
    { name: 'Shigatse', alt: 3840, km: 9430, day: 141 },
    { name: 'Rongbuk', alt: 5000, km: 9670, day: 143 },
    { name: 'Tanggula Pass', alt: 5072, km: 10490, day: 149 },
    { name: 'Hoh Xil', alt: 4600, km: 10900, day: 149 },
    { name: 'Xining', alt: 2275, km: 11530, day: 150 },
    { name: 'Zhangye', alt: 1474, km: 11810, day: 155 },
    { name: 'Jiayuguan', alt: 1735, km: 12020, day: 160 },
    { name: 'Dunhuang', alt: 1139, km: 12330, day: 163 },
    { name: 'Turpan', alt: -154, km: 12880, day: 168 },
    { name: 'Kashgar', alt: 1289, km: 14050, day: 177 },
    { name: 'Irkeshtam Pass', alt: 3005, km: 14240, day: 184 },
    { name: 'Sary-Tash', alt: 3170, km: 14290, day: 185 },
    { name: 'Osh', alt: 960, km: 14390, day: 186 },
    { name: 'Bishkek', alt: 800, km: 14690, day: 187 },
    { name: 'Karakol', alt: 1770, km: 15000, day: 191 },
    { name: 'Song Kol', alt: 3016, km: 15280, day: 198 },
    { name: 'Tashkent', alt: 455, km: 15770, day: 205 },
    { name: 'Samarkand', alt: 702, km: 16040, day: 210 },
    { name: 'Bukhara', alt: 225, km: 16250, day: 215 },
    { name: 'Tbilisi', alt: 380, km: 17920, day: 220 },
    { name: 'Kazbegi', alt: 1740, km: 18030, day: 228 },
    { name: 'Sighnaghi', alt: 790, km: 18190, day: 236 }
  ];

  var maxKm = 18190;
  var minAlt = -300;
  var maxAlt = 5600;
  var padTop = 20;
  var padBot = 10;

  function render() {
    var rect = svg.getBoundingClientRect();
    if(rect.width === 0) return;
    var w = rect.width;
    var h = rect.height;
    var drawH = h - padTop - padBot;

    function x(km) { return (km / maxKm) * w; }
    function y(alt) { return padTop + drawH - ((alt - minAlt) / (maxAlt - minAlt)) * drawH; }

    var points = elevData.map(function(d) { return x(d.km) + ',' + y(d.alt); });
    var pathD = 'M' + points.join(' L');
    var areaD = pathD + ' L' + x(maxKm) + ',' + (h - padBot) + ' L0,' + (h - padBot) + ' Z';

    var gridAlts = [0, 1000, 2000, 3000, 4000, 5000];
    var gridLines = gridAlts.map(function(a) {
      var yy = y(a);
      return '<line x1="0" y1="' + yy + '" x2="' + w + '" y2="' + yy + '" stroke="rgba(31,26,20,0.08)" stroke-width="1" stroke-dasharray="4,4"/>'
        + '<text x="4" y="' + (yy - 4) + '" fill="rgba(31,26,20,0.3)" font-family="Cormorant Unicase, serif" font-size="9" letter-spacing="0.1em">' + (a > 0 ? a/1000 + 'k' : a) + 'm</text>';
    }).join('');

    var dots = elevData.map(function(d, i) {
      var majorNames = ['Colombo','Mirissa','Sigiriya','Kochi','Neyyar Dam','Alleppey','Hampi','Palolem','Amritsar','Thorong La','Kathmandu','Lhasa','Rongbuk','Tanggula Pass','Zhangye','Dunhuang','Turpan','Kashgar','Sary-Tash','Song Kol','Bukhara','Sighnaghi'];
      var isMajor = majorNames.indexOf(d.name) > -1;
      var r = isMajor ? 4 : 2.5;
      var fill = isMajor ? '#6e2a22' : '#b88940';
      return '<circle cx="' + x(d.km) + '" cy="' + y(d.alt) + '" r="' + r + '" fill="' + fill + '" stroke="#f4ede0" stroke-width="1.5"/>';
    }).join('');

    svg.innerHTML = gridLines
      + '<path d="' + areaD + '" fill="url(#elevGrad)" />'
      + '<path d="' + pathD + '" fill="none" stroke="#6e2a22" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'
      + '<defs><linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#b88940" stop-opacity="0.25"/><stop offset="100%" stop-color="#b88940" stop-opacity="0.02"/></linearGradient></defs>'
      + dots;
  }

  render();
  window.addEventListener('resize', render);

  // Hover interaction
  svg.addEventListener('mousemove', function(e) {
    var rect = svg.getBoundingClientRect();
    if(rect.width === 0) return;
    var mx = e.clientX - rect.left;
    var w = rect.width;
    var h = rect.height;
    var drawH = h - padTop - padBot;
    var hoverKm = (mx / w) * maxKm;

    var nearest = elevData.reduce(function(best, d) {
      var dist = Math.abs(d.km - hoverKm);
      return dist < best.dist ? { d: d, dist: dist } : best;
    }, { d: elevData[0], dist: Infinity });

    var d = nearest.d;
    var px = (d.km / maxKm) * w;
    var py = padTop + drawH - ((d.alt - minAlt) / (maxAlt - minAlt)) * drawH;

    tooltip.innerHTML = '<strong>' + d.name + '</strong>' + d.alt.toLocaleString() + ' m · km ' + d.km.toLocaleString() + ' · Day ' + d.day;
    tooltip.classList.add('show');
    tooltip.style.left = px + 'px';
    tooltip.style.bottom = (h - py + 12) + 'px';

    vline.classList.add('show');
    vline.style.left = px + 'px';
    vline.style.top = py + 'px';
    vline.style.height = (h - padBot - py) + 'px';
  });

  svg.addEventListener('mouseleave', function() {
    tooltip.classList.remove('show');
    vline.classList.remove('show');
  });
}
document.addEventListener("DOMContentLoaded", initElevation);

// ===== SCROLL TRACKER =====
function initScrollTracker() {
  var tracker = document.getElementById('scroll-tracker');
  var trackerChapter = document.getElementById('tracker-chapter');
  var trackerDetail = document.getElementById('tracker-detail');
  var trackerFill = document.getElementById('tracker-fill');
  var trackerPct = document.getElementById('tracker-pct');
  if (!tracker) return;

  // Chapter metadata for the tracker — all 20 chapters
  var chapters = [
    { id: 'ch1', title: 'The Southern Coast', day: '1–10', alt: 'Sea level', num: 'I' },
    { id: 'ch2', title: 'The Hill Country', day: '11–19', alt: '465–1,041 m', num: 'II' },
    { id: 'ch3', title: 'The Spice Coast', day: '20–26', alt: '10–1,532 m', num: 'III' },
    { id: 'ch4', title: 'The Ashram', day: '27–57', alt: '90 m', num: 'IV' },
    { id: 'ch5', title: 'The Backwaters', day: '58–64', alt: 'Sea level', num: 'V' },
    { id: 'ch6', title: 'Hampi', day: '65–72', alt: '467 m', num: 'VI' },
    { id: 'ch7', title: 'Goa', day: '73–86', alt: 'Sea level', num: 'VII' },
    { id: 'ch8', title: 'The Holy Cities', day: '87–104', alt: '80–340 m', num: 'VIII' },
    { id: 'ch9', title: 'Diverging Paths', day: '105–125', alt: '340–5,416 m', num: 'IX' },
    { id: 'ch10', title: 'Kathmandu', day: '126–132', alt: '1,400 m', num: 'X' },
    { id: 'ch11', title: 'Lhasa and Everest', day: '133–148', alt: '3,656–5,000 m', num: 'XI' },
    { id: 'ch12', title: 'The Sky Train', day: '149–150', alt: '5,072 m', num: 'XII' },
    { id: 'ch13', title: 'The Hexi Corridor', day: '151–162', alt: '1,474–2,275 m', num: 'XIII' },
    { id: 'ch14', title: 'Dunhuang', day: '163–167', alt: '1,139 m', num: 'XIV' },
    { id: 'ch15', title: 'Turpan', day: '168–176', alt: '−154 m', num: 'XV' },
    { id: 'ch16', title: 'Kashgar', day: '177–183', alt: '1,289–3,600 m', num: 'XVI' },
    { id: 'ch17', title: 'Across the Irkeshtam', day: '184–186', alt: '3,170 m', num: 'XVII' },
    { id: 'ch18', title: 'Kyrgyzstan', day: '187–204', alt: '800–3,016 m', num: 'XVIII' },
    { id: 'ch19', title: 'The Silk Road Cities', day: '205–219', alt: '225–702 m', num: 'XIX' },
    { id: 'ch20', title: 'Georgia', day: '220–240', alt: '380–2,170 m', num: 'XX' }
  ];

  var chapterEls = chapters.map(function(ch) {
    return { data: ch, el: document.getElementById(ch.id) };
  }).filter(function(c) { return c.el; });

  var heroSection = document.querySelector('.hero');
  var lastActive = null;

  // Region navigation
  var regionNav = document.getElementById('region-nav');
  var regionBtns = regionNav ? regionNav.querySelectorAll('.region-btn') : [];
  var lastActiveRegion = null;

  // Map chapter IDs to region keys
  var chapterToRegion = {
    ch1: 'sri-lanka', ch2: 'sri-lanka',
    ch3: 'south-india', ch4: 'south-india', ch5: 'south-india',
    ch6: 'central-india', ch7: 'central-india', ch8: 'north-india',
    ch9: 'nepal', ch10: 'nepal',
    ch11: 'tibet',
    ch12: 'china', ch13: 'china', ch14: 'china', ch15: 'china', ch16: 'china',
    ch17: 'kyrgyzstan', ch18: 'kyrgyzstan',
    ch19: 'uzbekistan',
    ch20: 'georgia'
  };

  // Click handlers for region buttons
  regionBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = btn.getAttribute('data-target');
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  function setActiveRegion(regionKey) {
    if (regionKey === lastActiveRegion) return;
    lastActiveRegion = regionKey;
    regionBtns.forEach(function(btn) {
      var isActive = btn.getAttribute('data-region') === regionKey;
      btn.classList.toggle('active', isActive);
      // Auto-scroll the active button into view
      if (isActive && regionNav) {
        var navRect = regionNav.getBoundingClientRect();
        var btnRect = btn.getBoundingClientRect();
        var btnCenter = btnRect.left + btnRect.width / 2;
        var navCenter = navRect.left + navRect.width / 2;
        var offset = btnCenter - navCenter;
        regionNav.scrollBy({ left: offset, behavior: 'smooth' });
      }
    });
  }

  function updateTracker() {
    var scrollY = window.scrollY;
    var total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var pct = Math.round((scrollY / total) * 100);

    trackerFill.style.width = pct + '%';

    if (heroSection) {
      var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (scrollY > heroBottom - 100) {
        tracker.classList.add('visible');
      } else {
        tracker.classList.remove('visible');
      }
    }

    var current = null;
    var currentIndex = -1;
    var windowMid = scrollY + window.innerHeight * 0.35;
    for (var i = chapterEls.length - 1; i >= 0; i--) {
      if (chapterEls[i].el.offsetTop <= windowMid) {
        current = chapterEls[i].data;
        currentIndex = i;
        break;
      }
    }

    if (current) {
      if (current.id !== lastActive) {
        lastActive = current.id;
        trackerChapter.textContent = current.num + '. ' + current.title;
        trackerDetail.textContent = 'Day ' + current.day + '  ·  ' + current.alt;

        // Update active region
        var region = chapterToRegion[current.id];
        if (region) {
          setActiveRegion(region);
        }
      }

      // Dynamic Day Tracker
      var dayMatch = current.day.match(/^(\d+)(?:–(\d+))?$/);
      if (dayMatch) {
         var startDay = parseInt(dayMatch[1], 10);
         var endDay = dayMatch[2] ? parseInt(dayMatch[2], 10) : startDay;
         
         var startScroll = chapterEls[currentIndex].el.offsetTop;
         var nextScroll = (currentIndex < chapterEls.length - 1) 
            ? chapterEls[currentIndex + 1].el.offsetTop 
            : document.documentElement.scrollHeight - window.innerHeight;
         
         var chapterHeight = Math.max(1, nextScroll - startScroll);
         var scrollPassed = windowMid - startScroll;
         var localPct = Math.max(0, Math.min(1, scrollPassed / chapterHeight));
         
         var currentDay = Math.round(startDay + (endDay - startDay) * localPct);
         trackerPct.textContent = 'Day ' + currentDay + ' / 240';
      } else {
         trackerPct.textContent = pct + '%';
      }
    } else {
      trackerPct.textContent = pct + '%';
    }
  }

  window.addEventListener('scroll', updateTracker, { passive: true });
  updateTracker();
}
document.addEventListener("DOMContentLoaded", initScrollTracker);

// ===== CLIMATE / GEAR WIDGET =====
function initClimateWidgets() {
  var climateData = {
    ch1: {
      temp: '26–31°C', weather: 'Tropical, warm', uv: 'High', gear: 'Swimwear, reef-safe SPF',
      icon_temp: '🌴', icon_weather: '☀️', icon_uv: '🕶', icon_gear: '🏊'
    },
    ch2: {
      temp: '15–25°C', weather: 'Cool, misty', uv: 'Moderate', gear: 'Light layers, rain jacket',
      icon_temp: '🌿', icon_weather: '🌧', icon_uv: '🕶', icon_gear: '🧥'
    },
    ch3: {
      temp: '24–32°C', weather: 'Humid, occasional rain', uv: 'High', gear: 'Light cotton, umbrella',
      icon_temp: '🌡', icon_weather: '🌤', icon_uv: '☀️', icon_gear: '👕'
    },
    ch4: {
      temp: '24–30°C', weather: 'Tropical, humid', uv: 'Moderate', gear: 'White clothing, shawl',
      icon_temp: '🧘', icon_weather: '🌤', icon_uv: '🕶', icon_gear: '🤍'
    },
    ch5: {
      temp: '25–32°C', weather: 'Warm, calm waters', uv: 'High', gear: 'Light clothes, sunhat',
      icon_temp: '🚣', icon_weather: '☀️', icon_uv: '☀️', icon_gear: '👒'
    },
    ch6: {
      temp: '28–38°C', weather: 'Hot, dry', uv: 'Very high', gear: 'Hat, water, sunscreen',
      icon_temp: '🔥', icon_weather: '☀️', icon_uv: '☀️', icon_gear: '🎒'
    },
    ch7: {
      temp: '26–32°C', weather: 'Warm, tropical', uv: 'High', gear: 'Beach wear, yoga clothes',
      icon_temp: '🏖', icon_weather: '☀️', icon_uv: '🕶', icon_gear: '🧘'
    },
    ch8: {
      temp: '20–38°C', weather: 'Variable', uv: 'High', gear: 'Layers, modest clothes',
      icon_temp: '🌡', icon_weather: '🌤', icon_uv: '☀️', icon_gear: '🧣'
    },
    ch9: {
      temp: '−5–25°C', weather: 'Variable alpine/tropical', uv: 'Extreme at altitude', gear: 'Full trekking gear / yoga clothes',
      icon_temp: '🏔', icon_weather: '🌤', icon_uv: '☀️', icon_gear: '🥾'
    },
    ch10: {
      temp: '15–28°C', weather: 'Warm, humid', uv: 'Moderate', gear: 'Light layers',
      icon_temp: '☀️', icon_weather: '🌤', icon_uv: '🕶', icon_gear: '👕'
    },
    ch11: {
      temp: '−5–18°C', weather: 'Cold, thin air', uv: 'Extreme', gear: 'Down jacket, thermals',
      icon_temp: '🏔', icon_weather: '❄️', icon_uv: '☀️', icon_gear: '🧥'
    },
    ch12: {
      temp: '−15–8°C', weather: 'Cold, pressurised', uv: 'N/A (train)', gear: 'Warm sleepwear',
      icon_temp: '🥶', icon_weather: '🌨', icon_uv: '—', icon_gear: '🛏'
    },
    ch13: {
      temp: '15–30°C', weather: 'Dry, clear', uv: 'High', gear: 'Mid layers, sunscreen',
      icon_temp: '🌡', icon_weather: '☀️', icon_uv: '☀️', icon_gear: '🧴'
    },
    ch14: {
      temp: '18–35°C', weather: 'Hot, desert dry', uv: 'Very high', gear: 'Hat, water, sunblock',
      icon_temp: '🔥', icon_weather: '☀️', icon_uv: '☀️', icon_gear: '🎒'
    },
    ch15: {
      temp: '22–42°C', weather: 'Extreme heat', uv: 'Extreme', gear: 'Light clothes, shade',
      icon_temp: '🌡', icon_weather: '🔥', icon_uv: '☀️', icon_gear: '👒'
    },
    ch16: {
      temp: '15–33°C', weather: 'Warm days, cold nights', uv: 'High', gear: 'Layers + down for Karakul',
      icon_temp: '🌤', icon_weather: '🌙', icon_uv: '☀️', icon_gear: '🧥'
    },
    ch17: {
      temp: '5–22°C', weather: 'Cold, windy', uv: 'High', gear: 'Full cold gear',
      icon_temp: '🏔', icon_weather: '💨', icon_uv: '☀️', icon_gear: '🧥'
    },
    ch18: {
      temp: '5–25°C', weather: 'Alpine, variable', uv: 'High at alt', gear: 'Heavy layers, sleeping bag',
      icon_temp: '🏔', icon_weather: '🌤', icon_uv: '☀️', icon_gear: '🧥'
    },
    ch19: {
      temp: '25–42°C', weather: 'Hot, dry', uv: 'Very high', gear: 'Light clothes, hat',
      icon_temp: '🔥', icon_weather: '☀️', icon_uv: '☀️', icon_gear: '👒'
    },
    ch20: {
      temp: '18–35°C', weather: 'Hot in Tbilisi, cool in Kazbegi', uv: 'Moderate', gear: 'Light layers, boots',
      icon_temp: '🍷', icon_weather: '🌤', icon_uv: '🕶', icon_gear: '🥾'
    }
  };

  Object.keys(climateData).forEach(function(chId) {
    var chapter = document.getElementById(chId);
    if (!chapter) return;
    var practical = chapter.querySelector('.practical');
    if (!practical) return;
    var grid = practical.querySelector('.practical-grid');
    if (!grid) return;

    var cd = climateData[chId];

    var linksHtml = '';
    if (cd.links && cd.links.length) {
      linksHtml = '<div class="climate-links">';
      cd.links.forEach(function(link) {
        linksHtml += '<a class="climate-link" href="' + link.url + '" target="_blank" rel="noopener">' + link.text + '</a>';
      });
      linksHtml += '</div>';
    }

    var tipsHtml = '';
    if (cd.tips) {
      tipsHtml = '<div class="backpacker-tips">'
        + '<div class="backpacker-tips-header"><span>🎒 Backpacker Tips · Women</span></div>'
        + '<p class="backpacker-tip-text">' + cd.tips + '</p>'
        + linksHtml
        + '</div>';
    }

    var row = document.createElement('div');
    row.className = 'climate-row';
    row.innerHTML = '<button class="climate-toggle" aria-expanded="false">Climate & Gear</button>'
      + '<div class="climate-panel">'
      + '<div class="climate-item"><div class="climate-icon">' + cd.icon_temp + '</div><div class="climate-val">' + cd.temp + '</div><div class="climate-label">Temperature</div></div>'
      + '<div class="climate-item"><div class="climate-icon">' + cd.icon_weather + '</div><div class="climate-val">' + cd.weather + '</div><div class="climate-label">Conditions</div></div>'
      + '<div class="climate-item"><div class="climate-icon">' + cd.icon_uv + '</div><div class="climate-val">' + cd.uv + '</div><div class="climate-label">UV Index</div></div>'
      + '<div class="climate-item"><div class="climate-icon">' + cd.icon_gear + '</div><div class="climate-val">' + cd.gear + '</div><div class="climate-label">Key Gear</div></div>'
      + tipsHtml
      + '</div>';

    grid.parentNode.insertBefore(row, grid.nextSibling);

    var btn = row.querySelector('.climate-toggle');
    var panel = row.querySelector('.climate-panel');
    btn.addEventListener('click', function() {
      var isOpen = panel.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}
document.addEventListener("DOMContentLoaded", initClimateWidgets);

// ===== FLY TO CHAPTER (LOCATE ON MAP) =====
window.flyToChapter = function(targetId) {
  var stop = stops.find(function(s) { return s.target === targetId; });
  if (stop && window.overviewMap) {
    // Scroll to the map container smoothly
    var mapContainer = document.getElementById('overview-map');
    if (mapContainer) {
      // Calculate top position with some padding
      var y = mapContainer.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Wait for scroll to somewhat finish, then fly map
      setTimeout(function() {
        overviewMap.flyTo([stop.lat, stop.lng], 7, {
          animate: true,
          duration: 1.5
        });
        
        // Open the corresponding popup
        overviewMap.eachLayer(function(layer) {
          if (layer instanceof L.Marker) {
            var latLng = layer.getLatLng();
            if (latLng.lat === stop.lat && latLng.lng === stop.lng) {
              layer.openPopup();
            }
          }
        });
      }, 500);
    }
  }
};
