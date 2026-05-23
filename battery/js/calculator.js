// ═══════════════════════════════════════════
// js/calculator.js — головна логіка розрахунку
// ═══════════════════════════════════════════

let state = {
  voltage: 48, capacity: 20, soc: 100, batteryAge: 1.00, chem: 'liion',
  courier: 75, gear: 3, cargo: 5, scooter: 65, extra: 2,
  speed: 30, style: 'normal', temp: 20, weather: 1.00,
  windDir: 'cross', windSpeed: 10, surface: 'normal',
  city: 'kyiv', pressure: 2.8
};

function calculate() {
  // Sync state from DOM
  state.batteryAge = parseFloat(q('battery-age').value);
  state.chem = q('battery-chem').value;
  state.style = q('riding-style').value;
  state.weather = parseFloat(q('weather').value);
  state.windDir = q('wind-dir').value;
  state.surface = q('surface').value;

  const result = computePower(state);

  // Color class
  let colorClass = 'success';
  if (result.rangeKm < 15) colorClass = 'danger';
  else if (result.rangeKm < 30) colorClass = 'warning';

  // Main result
  const kmText = '≈ ' + Math.round(result.rangeKm) + ' км';
  q('result-km').className = 'dashboard-main ' + colorClass;
  q('result-km').textContent = kmText;
  q('sticky-km').className = 'sticky-km ' + colorClass;
  q('sticky-km').textContent = kmText;

  // Progress bar
  const progressPct = Math.min((result.rangeKm / 80) * 100, 100);
  const progress = q('progress-bar');
  progress.className = 'progress-fill ' + colorClass;
  progress.style.width = progressPct + '%';

  // Markers
  q('marker-20').textContent = Math.round(result.rangeKm * 0.2) + ' км';
  q('marker-50').textContent = Math.round(result.rangeKm * 0.5) + ' км';
  q('marker-80').textContent = Math.round(result.rangeKm * 0.8) + ' км';

  // Metrics
  q('metric-whkm').textContent = result.whPerKm.toFixed(1);
  q('metric-energy').textContent = Math.round(result.effectiveEnergy);
  q('metric-time').textContent = result.timeStr;
  q('metric-power').textContent = Math.round(result.P_motor);
  q('metric-buffer').textContent = result.bufferKm.toFixed(1);
  q('metric-recommended').textContent = Math.round(result.recommendedKm);

  // Tips
  generateTips(result);
}