// ═══════════════════════════════════════════
// js/physics.js — формули фізичної моделі
// ═══════════════════════════════════════════

function getTempCoeff(chemKey, temp) {
  const coeffs = CHEMISTRY[chemKey].tempCoeff;
  const keys = Object.keys(coeffs).map(Number).sort((a,b)=>a-b);
  if (temp <= keys[0]) return coeffs[keys[0]];
  if (temp >= keys[keys.length-1]) return coeffs[keys[keys.length-1]];
  for (let i = 0; i < keys.length-1; i++) {
    if (temp >= keys[i] && temp <= keys[i+1]) {
      const t1 = keys[i], t2 = keys[i+1];
      const c1 = coeffs[t1], c2 = coeffs[t2];
      return c1 + (c2 - c1) * (temp - t1) / (t2 - t1);
    }
  }
  return 1.0;
}

function getTireCoeff(pressure) {
  if (pressure < 2.0) return 1.15;
  if (pressure > 3.5) return 1.03;
  if (pressure <= 2.8) return 1.15 - (pressure - 2.0) * (0.15 / 0.8);
  return 1.00 + (pressure - 2.8) * (0.03 / 0.7);
}

function computePower(state) {
  const chem = CHEMISTRY[state.chem];
  const cityData = CITIES[state.city];
  const terrain = TERRAIN[cityData.terrain];

  // Battery effective energy
  const tempCoeff = getTempCoeff(state.chem, state.temp);
  const energyWh = state.voltage * state.capacity * (state.soc / 100) * state.batteryAge * chem.dod * tempCoeff;

  // Total mass
  const totalMass = state.courier + state.gear + state.cargo + state.scooter + state.extra;
  const massFactor = 1 + ((totalMass - BASE_MASS) / 10) * 0.04;

  // Speed
  const v_ms = state.speed / 3.6;
  const v_kmh = state.speed;

  // Rolling resistance
  const crr_base = SURFACE_CRR[state.surface];
  const tireCoeff = getTireCoeff(state.pressure);
  const crr_eff = crr_base * tireCoeff;
  const P_roll = crr_eff * totalMass * G * v_ms;

  // Aerodynamics
  let v_wind_eff = 0;
  const v_wind_ms = state.windSpeed / 3.6;
  if (state.windDir === 'headwind') v_wind_eff = v_wind_ms;
  else if (state.windDir === 'tailwind') v_wind_eff = -v_wind_ms;
  else v_wind_eff = v_wind_ms * 0.5;
  const v_eff = v_ms + v_wind_eff;
  const P_aero = 0.5 * CD * AREA * RHO * Math.pow(v_eff, 3);

  // Gravity / slope
  const slopeRad = terrain.slope * Math.PI / 180;
  const P_grav = totalMass * G * v_ms * Math.sin(slopeRad);

  // Acceleration (average estimated)
  const accelPower = {
    eco: 0.05 * totalMass * v_ms,
    normal: 0.12 * totalMass * v_ms,
    sport: 0.25 * totalMass * v_ms
  }[state.style];

  // Total mechanical power
  let P_total = (P_roll + P_aero + P_grav + accelPower) * RIDING_STYLE[state.style] * state.weather * massFactor * cityData.road;
  P_total *= (1 - terrain.regen);

  // Motor efficiency
  const P_motor = P_total / MOTOR_EFF;

  // Current & Peukert
  const I_real = P_motor / state.voltage;
  const I_nominal = state.capacity;
  const peukertFactor = Math.pow(I_nominal / Math.max(I_real, 0.1), chem.peukert - 1);
  const effectiveCapacity = state.capacity * peukertFactor;
  const effectiveEnergy = state.voltage * effectiveCapacity * (state.soc / 100) * state.batteryAge * chem.dod * tempCoeff;

  // Consumption & Range
  const whPerKm = P_motor / v_kmh;
  const rangeKm = effectiveEnergy / whPerKm;

  // Buffer (15% SOC) & Recommended (90% of calculated)
  const bufferEnergy = state.voltage * effectiveCapacity * (15 / 100) * state.batteryAge * chem.dod * tempCoeff;
  const bufferKm = bufferEnergy / whPerKm;
  const recommendedKm = rangeKm * 0.90;

  // Trip time
  const hours = rangeKm / v_kmh;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const timeStr = h > 0 ? h + 'г ' + m + 'хв' : m + 'хв';

  return {
    energyWh, effectiveEnergy, totalMass, massFactor,
    P_roll, P_aero, P_grav, accelPower, P_total, P_motor,
    I_real, peukertFactor, effectiveCapacity,
    whPerKm, rangeKm, bufferKm, recommendedKm,
    timeStr, hours, tempCoeff, tireCoeff, crr_eff
  };
}