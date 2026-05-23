// ═══════════════════════════════════════════
// js/tips.js — генерація порад кур'єру
// ═══════════════════════════════════════════

function generateTips(result) {
  const container = q('tips-container');
  const tips = [];

  // Tip 1: Speed reduction
  if (state.speed > 30) {
    const newSpeed = 25;
    const v_ms_new = newSpeed / 3.6;
    const windEff = state.windDir === 'headwind' ? state.windSpeed/3.6 : (state.windDir === 'cross' ? state.windSpeed/3.6*0.5 : -state.windSpeed/3.6);
    const P_aero_new = 0.5 * CD * AREA * RHO * Math.pow(v_ms_new + windEff, 3);
    const P_roll_new = SURFACE_CRR[state.surface] * getTireCoeff(state.pressure) * result.totalMass * G * v_ms_new;
    const P_grav_new = result.totalMass * G * v_ms_new * Math.sin(TERRAIN[CITIES[state.city].terrain].slope * Math.PI/180);
    const accel_new = { eco:0.05, normal:0.12, sport:0.25 }[state.style] * result.totalMass * v_ms_new;
    let P_new = (P_roll_new + P_aero_new + P_grav_new + accel_new) * RIDING_STYLE[state.style] * state.weather * result.massFactor * CITIES[state.city].road;
    P_new *= (1 - TERRAIN[CITIES[state.city].terrain].regen);
    P_new /= MOTOR_EFF;
    const whkm_new = P_new / newSpeed;
    const range_new = result.effectiveEnergy / whkm_new;
    const delta = Math.round(range_new - result.rangeKm);
    if (delta > 1) {
      tips.push({
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        text: 'Знизь швидкість з ' + state.speed + ' до 25 км/год',
        delta: '+' + delta + ' км'
      });
    }
  }

  // Tip 2: Reduce cargo
  if (state.cargo > 5) {
    const massLess = result.totalMass - 5;
    const massFactorLess = 1 + ((massLess - BASE_MASS) / 10) * 0.04;
    const v_ms = state.speed / 3.6;
    const windEff = state.windDir === 'headwind' ? state.windSpeed/3.6 : (state.windDir === 'cross' ? state.windSpeed/3.6*0.5 : -state.windSpeed/3.6);
    const P_roll_less = SURFACE_CRR[state.surface] * getTireCoeff(state.pressure) * massLess * G * v_ms;
    const P_grav_less = massLess * G * v_ms * Math.sin(TERRAIN[CITIES[state.city].terrain].slope * Math.PI/180);
    const accel_less = { eco:0.05, normal:0.12, sport:0.25 }[state.style] * massLess * v_ms;
    let P_less = (P_roll_less + 0.5*CD*AREA*RHO*Math.pow(v_ms + windEff, 3) + P_grav_less + accel_less) * RIDING_STYLE[state.style] * state.weather * massFactorLess * CITIES[state.city].road;
    P_less *= (1 - TERRAIN[CITIES[state.city].terrain].regen);
    P_less /= MOTOR_EFF;
    const whkm_less = P_less / state.speed;
    const range_less = result.effectiveEnergy / whkm_less;
    const delta = Math.round(range_less - result.rangeKm);
    if (delta > 1) {
      tips.push({
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
        text: 'Зменш вантаж на 5 кг. Розглянь легшу сумку-термос',
        delta: '+' + delta + ' км'
      });
    }
  }

  // Tip 3: Riding style
  if (state.style === 'sport') {
    const v_ms = state.speed / 3.6;
    const windEff = state.windDir === 'headwind' ? state.windSpeed/3.6 : (state.windDir === 'cross' ? state.windSpeed/3.6*0.5 : -state.windSpeed/3.6);
    const accel_eco = 0.05 * result.totalMass * v_ms;
    let P_eco = (SURFACE_CRR[state.surface]*getTireCoeff(state.pressure)*result.totalMass*G*v_ms + 0.5*CD*AREA*RHO*Math.pow(v_ms + windEff, 3) + result.totalMass*G*v_ms*Math.sin(TERRAIN[CITIES[state.city].terrain].slope*Math.PI/180) + accel_eco) * RIDING_STYLE['eco'] * state.weather * result.massFactor * CITIES[state.city].road;
    P_eco *= (1 - TERRAIN[CITIES[state.city].terrain].regen);
    P_eco /= MOTOR_EFF;
    const whkm_eco = P_eco / state.speed;
    const range_eco = result.effectiveEnergy / whkm_eco;
    const delta = Math.round(range_eco - result.rangeKm);
    if (delta > 1) {
      tips.push({
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
        text: 'Перейди на плавну манеру. Уникай різких стартів',
        delta: '+' + delta + ' км'
      });
    }
  }

  // Tip 4: Tire pressure
  if (state.pressure < 2.5) {
    const crr_opt = SURFACE_CRR[state.surface] * getTireCoeff(3.0);
    const crr_curr = SURFACE_CRR[state.surface] * getTireCoeff(state.pressure);
    const v_ms = state.speed / 3.6;
    const P_diff = (crr_curr - crr_opt) * result.totalMass * G * v_ms;
    const P_new = result.P_motor - P_diff;
    const whkm_new = P_new / state.speed;
    const range_new = result.effectiveEnergy / whkm_new;
    const delta = Math.round(range_new - result.rangeKm);
    if (delta > 1) {
      tips.push({
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
        text: 'Підкачай шини до 3.0 бар. Це безкоштовно!',
        delta: '+' + delta + ' км'
      });
    }
  }

  // Tip 5: Temperature
  if (state.temp < 5) {
    const baseTempCoeff = getTempCoeff(state.chem, 20);
    const currTempCoeff = getTempCoeff(state.chem, state.temp);
    const lossPct = Math.round((1 - currTempCoeff/baseTempCoeff) * 100);
    if (lossPct > 5) {
      tips.push({
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>',
        text: 'Холод знижує ємність батареї на ' + lossPct + '%. Тримай скутер у теплі до поїздки',
        delta: ''
      });
    }
  }

  // Render
  if (tips.length === 0) {
    container.innerHTML = '<div class="tip-card"><div class="tip-content"><div class="tip-text">Усе оптимально! Твій запас ходу максимальний за цих умов.</div></div></div>';
  } else {
    container.innerHTML = tips.map(t =>
      '<div class="tip-card fade-in">' +
        '<div class="tip-icon">' + t.icon + '</div>' +
        '<div class="tip-content">' +
          '<div class="tip-text">' + t.text + '</div>' +
          (t.delta ? '<div class="tip-delta">' + t.delta + '</div>' : '') +
        '</div>' +
      '</div>'
    ).join('');
  }
}