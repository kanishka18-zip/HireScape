const cityCoords = {
  "Mumbai": [72.87, 19.07], "Delhi": [77.10, 28.61], "Bangalore": [77.59, 12.97],
  "Bengaluru": [77.59, 12.97], "Hyderabad": [78.47, 17.38], "Chennai": [80.27, 13.08],
  "Pune": [73.85, 18.52], "Kolkata": [88.36, 22.57], "Ahmedabad": [72.57, 23.02],
  "Jaipur": [75.78, 26.91], "Lucknow": [80.94, 26.85], "Chandigarh": [76.78, 30.73],
  "Kochi": [76.26, 9.93], "Indore": [75.86, 22.72], "Surat": [72.83, 21.17],
  "Noida": [77.33, 28.57], "Gurgaon": [77.03, 28.46], "Gurugram": [77.03, 28.46],
  "Work From Home": [78.9, 22.5], "Remote": [78.9, 22.5]
};

function getCityFromLocation(location) {
  if (!location) return "Work From Home";
  for (const city in cityCoords) {
    if (location.toLowerCase().includes(city.toLowerCase())) return city;
  }
  return "Work From Home";
}

function categorize(job) {
  const text = (job.title + ' ' + (Array.isArray(job.skills) ? job.skills.join(' ') : '')).toLowerCase();
  if (/ai|ml|machine learning|data scien|nlp|python/.test(text)) return 'ai';
  if (/web|frontend|react|html|css|developer/.test(text)) return 'web';
  if (/data|analyst|analytics/.test(text)) return 'data';
  if (/design|ui|ux/.test(text)) return 'design';
  if (/sales|marketing|business development/.test(text)) return 'sales';
  if (/hr|human resources|operations|admin/.test(text)) return 'hr';
  return 'other';
}

const enrichedJobs = jobsData.map(function(job) {
  const city = getCityFromLocation(job.location);
  const coords = cityCoords[city];
  return Object.assign({}, job, {
    city: city,
    lat: coords[1] + (Math.random() - 0.5) * 0.6,
    lng: coords[0] + (Math.random() - 0.5) * 0.6,
    category: categorize(job)
  });
});

const cityGroups = {};
enrichedJobs.forEach(function(job) {
  if (!cityGroups[job.city]) {
    cityGroups[job.city] = { city: job.city, coords: cityCoords[job.city], jobs: [] };
  }
  cityGroups[job.city].jobs.push(job);
});

const cityBubbles = Object.values(cityGroups).map(function(g) {
  return {
    city: g.city,
    lat: g.coords[1],
    lng: g.coords[0],
    jobs: g.jobs,
    count: g.jobs.length
  };
});

document.getElementById('opportunityCount').textContent = enrichedJobs.length + ' opportunities discovered';
document.getElementById('statOpps').textContent = enrichedJobs.length;
document.getElementById('statCompanies').textContent = new Set(enrichedJobs.map(function(j) { return j.company; })).size;
document.getElementById('statCities').textContent = new Set(enrichedJobs.map(function(j) { return j.city; })).size;

const globe = Globe()(document.getElementById('globeContainer'))
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
  .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundColor('rgba(0,0,0,0)')
  .showAtmosphere(true)
  .atmosphereColor('#d4af37')
  .atmosphereAltitude(0.18)
  .pointsData(cityBubbles)
  .pointLat('lat')
  .pointLng('lng')
  .pointColor(function() { return 'rgba(212,175,55,0.9)'; })
  .pointAltitude(function(d) { return Math.min(0.015 + d.count * 0.0015, 0.1); })
  .pointRadius(function(d) { return Math.min(0.22 + d.count * 0.015, 0.75); })
  .pointLabel(function(d) {
    return '<div style="background:rgba(10,8,6,0.95);color:#f5e6c8;padding:10px 14px;border-radius:8px;border:1px solid rgba(212,175,55,0.5);font-family:Space Grotesk,sans-serif;font-size:13px;"><b>' + d.city + ', India</b><br>' + d.count + ' opportunities</div>';
  })
  .onPointClick(handleBubbleClick)
  .htmlElementsData(cityBubbles)
  .htmlLat('lat')
  .htmlLng('lng')
  .htmlAltitude(0.02)
  .htmlElement(function(d) {
    const el = document.createElement('div');
    el.innerHTML = '<div class="city-label">' + d.city + '</div>';
    el.style.pointerEvents = 'none';
    return el;
  })
  .ringsData(cityBubbles)
  .ringLat('lat')
  .ringLng('lng')
  .ringColor(function() { return function(t) { return 'rgba(212,175,55,' + (1 - t) + ')'; }; })
  .ringMaxRadius(function(d) { return 1.2 + d.count * 0.05; })
  .ringPropagationSpeed(1.5)
  .ringRepeatPeriod(2200);

globe.controls().autoRotate = true;
globe.controls().autoRotateSpeed = 0.4;
globe.controls().enableZoom = true;
globe.controls().zoomSpeed = 1.2;
globe.controls().minDistance = 101;
globe.controls().maxDistance = 500;

globe.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 1.3 });

let hasInteracted = false;
document.getElementById('globeContainer').addEventListener('pointerdown', function() {
  if (!hasInteracted) {
    hasInteracted = true;
    globe.controls().autoRotate = false;
  }
});

function handleBubbleClick(bubbleData) {
  globe.pointOfView({ lat: bubbleData.lat, lng: bubbleData.lng, altitude: 0.5 }, 1200);
  setTimeout(function() { showOverlay(bubbleData); }, 500);
}

const overlay = document.getElementById('overlay');
const overlayCard = document.getElementById('overlayCard');

function showOverlay(bubbleData) {
  const job = bubbleData.jobs[0];
  let skillsHtml = '<span class="skill-tag">Not specified</span>';
  if (Array.isArray(job.skills) && job.skills.length > 0) {
    skillsHtml = job.skills.map(function(s) { return '<span class="skill-tag">' + s + '</span>'; }).join('');
  }

  overlayCard.innerHTML =
    '<button class="close-btn" onclick="closeOverlay()">✕</button>' +
    '<h3>' + job.title + '</h3>' +
    '<div class="company">' + job.company + '</div>' +
    '<div class="location">📍 ' + bubbleData.city + ' · ' + bubbleData.count + ' opportunities here</div>' +
    '<div class="stipend">💰 ' + job.stipend + '</div>' +
    '<div class="skills">' + skillsHtml + '</div>' +
    '<a href="#" target="_blank">Apply →</a>';

  overlay.classList.add('active');
}

function closeOverlay() {
  overlay.classList.remove('active');
}

document.querySelectorAll('.cat-chip').forEach(function(chip) {
  chip.addEventListener('click', function() {
    document.querySelectorAll('.cat-chip').forEach(function(c) { c.classList.remove('active'); });
    chip.classList.add('active');
    const cat = chip.dataset.cat;
    const filteredJobs = cat === 'all' ? enrichedJobs : enrichedJobs.filter(function(j) { return j.category === cat; });

    const grouped = {};
    filteredJobs.forEach(function(job) {
      if (!grouped[job.city]) {
        grouped[job.city] = { city: job.city, lat: cityCoords[job.city][1], lng: cityCoords[job.city][0], jobs: [] };
      }
      grouped[job.city].jobs.push(job);
    });
    const bubbles = Object.values(grouped).map(function(g) {
      return Object.assign({}, g, { count: g.jobs.length });
    });

    globe.pointsData(bubbles).ringsData(bubbles).htmlElementsData(bubbles);
    document.getElementById('opportunityCount').textContent = filteredJobs.length + ' opportunities in view';
  });
});

const universeBtn = document.getElementById('universeBtn');
const universePanel = document.getElementById('universePanel');
const closeUniverse = document.getElementById('closeUniverse');
const generateBtn = document.getElementById('generateBtn');
const matchToast = document.getElementById('matchToast');
let selectedPrefs = [];

universeBtn.addEventListener('click', function() { universePanel.classList.add('active'); });
closeUniverse.addEventListener('click', function() { universePanel.classList.remove('active'); });

document.querySelectorAll('.pref-chip').forEach(function(chip) {
  chip.addEventListener('click', function() {
    chip.classList.toggle('selected');
    const pref = chip.dataset.pref;
    if (selectedPrefs.includes(pref)) {
      selectedPrefs = selectedPrefs.filter(function(p) { return p !== pref; });
    } else {
      selectedPrefs.push(pref);
    }
  });
});

generateBtn.addEventListener('click', function() {
  if (selectedPrefs.length === 0) {
    alert('Pick at least one preference!');
    return;
  }

  const matched = enrichedJobs.filter(function(job) {
    const text = (job.title + ' ' + job.category + ' ' + (Array.isArray(job.skills) ? job.skills.join(' ') : '') + ' ' + job.location).toLowerCase();
    return selectedPrefs.some(function(pref) { return text.includes(pref) || job.category === pref; });
  });

  const finalJobs = matched.length > 0 ? matched : enrichedJobs;
  const grouped = {};
  finalJobs.forEach(function(job) {
    if (!grouped[job.city]) {
      grouped[job.city] = { city: job.city, lat: cityCoords[job.city][1], lng: cityCoords[job.city][0], jobs: [] };
    }
    grouped[job.city].jobs.push(job);
  });
  const bubbles = Object.values(grouped).map(function(g) {
    return Object.assign({}, g, { count: g.jobs.length });
  });

  globe.pointsData(bubbles).ringsData(bubbles).htmlElementsData(bubbles);
  document.getElementById('opportunityCount').textContent = matched.length + ' opportunities matched to you';

  universePanel.classList.remove('active');
  matchToast.textContent = '✦ ' + matched.length + ' opportunities matched to you';
  matchToast.classList.add('show');
  setTimeout(function() { matchToast.classList.remove('show'); }, 3500);
});

window.addEventListener('load', function() {
  const travelSelect = document.getElementById('travelSelect');
  if (travelSelect) {
    travelSelect.addEventListener('change', function() {
      if (this.value === 'india') {
        globe.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 0.9 }, 2000);
      } else {
        globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 2000);
      }
    });
  }
});