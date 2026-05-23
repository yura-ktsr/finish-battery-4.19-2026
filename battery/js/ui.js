// ═══════════════════════════════════════════
// js/ui.js — оновлення DOM, слайдери, події
// ═══════════════════════════════════════════

function q(id) { return document.getElementById(id); }

function setVal(id, text) {
  const el = q('val-' + id);
  if (el) el.textContent = text;
}

function toggleSection(id) {
  document.getElementById(id).classList.toggle('open');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Voltage ───
function onVoltageSelect() {
  const sel = q('voltage-select');
  const inp = q('voltage-input');
  if (sel.value === 'custom') {
    inp.style.display = 'block'; inp.focus();
  } else {
    inp.style.display = 'none';
    state.voltage = parseFloat(sel.value);
    setVal('voltage', state.voltage + ' В');
    calculate();
  }
}
function onVoltageInput() {
  let v = parseFloat(q('voltage-input').value);
  if (!isNaN(v) && v >= 12 && v <= 120) {
    state.voltage = v; setVal('voltage', v + ' В'); calculate();
  }
}

// ─── Capacity ───
function onCapacitySlider() {
  state.capacity = parseFloat(q('capacity-slider').value);
  q('capacity-input').value = state.capacity;
  setVal('capacity', state.capacity + ' А·год');
  calculate();
}
function onCapacityInput() {
  let v = parseFloat(q('capacity-input').value);
  if (!isNaN(v) && v >= 1 && v <= 100) {
    state.capacity = v; q('capacity-slider').value = v;
    setVal('capacity', v + ' А·год'); calculate();
  }
}

// ─── SOC ───
function onSocSlider() {
  state.soc = parseInt(q('soc-slider').value);
  q('soc-num').textContent = state.soc + '%';
  setVal('soc', state.soc + '%');
  calculate();
}

// ─── Courier ───
function onCourierSlider() {
  state.courier = parseFloat(q('courier-slider').value);
  q('courier-input').value = state.courier;
  setVal('courier', state.courier + ' кг');
  calculate();
}
function onCourierInput() {
  let v = parseFloat(q('courier-input').value);
  if (!isNaN(v) && v >= 20 && v <= 200) {
    state.courier = v; q('courier-slider').value = v;
    setVal('courier', v + ' кг'); calculate();
  }
}

// ─── Gear ───
function onGearSlider() {
  state.gear = parseFloat(q('gear-slider').value);
  q('gear-input').value = state.gear;
  setVal('gear', state.gear + ' кг');
  calculate();
}
function onGearInput() {
  let v = parseFloat(q('gear-input').value);
  if (!isNaN(v) && v >= 0 && v <= 50) {
    state.gear = v; q('gear-slider').value = v;
    setVal('gear', v + ' кг'); calculate();
  }
}

// ─── Cargo ───
function onCargoSlider() {
  state.cargo = parseFloat(q('cargo-slider').value);
  q('cargo-input').value = state.cargo;
  setVal('cargo', state.cargo + ' кг');
  calculate();
}
function onCargoInput() {
  let v = parseFloat(q('cargo-input').value);
  if (!isNaN(v) && v >= 0 && v <= 100) {
    state.cargo = v; q('cargo-slider').value = v;
    setVal('cargo', v + ' кг'); calculate();
  }
}

// ─── Scooter ───
function onScooterSelect() {
  const sel = q('scooter-select');
  const inp = q('scooter-input');
  if (sel.value === 'custom') {
    inp.style.display = 'block'; inp.focus();
  } else {
    inp.style.display = 'none';
    state.scooter = parseFloat(sel.value);
    setVal('scooter', state.scooter + ' кг');
    calculate();
  }
}
function onScooterInput() {
  let v = parseFloat(q('scooter-input').value);
  if (!isNaN(v) && v >= 10 && v <= 200) {
    state.scooter = v; setVal('scooter', v + ' кг'); calculate();
  }
}

// ─── Extra ───
function onExtraSlider() {
  state.extra = parseFloat(q('extra-slider').value);
  q('extra-input').value = state.extra;
  setVal('extra', state.extra + ' кг');
  calculate();
}
function onExtraInput() {
  let v = parseFloat(q('extra-input').value);
  if (!isNaN(v) && v >= 0 && v <= 50) {
    state.extra = v; q('extra-slider').value = v;
    setVal('extra', v + ' кг'); calculate();
  }
}

// ─── Speed ───
function onSpeedSlider() {
  state.speed = parseFloat(q('speed-slider').value);
  q('speed-input').value = state.speed;
  setVal('speed', state.speed + ' км/год');
  calculate();
}
function onSpeedInput() {
  let v = parseFloat(q('speed-input').value);
  if (!isNaN(v) && v >= 5 && v <= 100) {
    state.speed = v; q('speed-slider').value = v;
    setVal('speed', v + ' км/год'); calculate();
  }
}

// ─── Temp ───
function onTempSlider() {
  state.temp = parseInt(q('temp-slider').value);
  const sign = state.temp > 0 ? '+' : '';
  q('temp-num').textContent = sign + state.temp + '°';
  setVal('temp', sign + state.temp + '°C');
  calculate();
}

// ─── Wind ───
function onWindSlider() {
  state.windSpeed = parseFloat(q('wind-slider').value);
  q('wind-input').value = state.windSpeed;
  setVal('wind', state.windSpeed + ' км/год');
  calculate();
}
function onWindInput() {
  let v = parseFloat(q('wind-input').value);
  if (!isNaN(v) && v >= 0 && v <= 100) {
    state.windSpeed = v; q('wind-slider').value = v;
    setVal('wind', v + ' км/год'); calculate();
  }
}

// ─── Pressure ───
function onPressureSlider() {
  state.pressure = parseFloat(q('pressure-slider').value);
  q('pressure-num').textContent = state.pressure.toFixed(1);
  setVal('pressure', state.pressure.toFixed(1) + ' бар');
  calculate();
}

// ─── Region / City ───
function onRegionChange() {
  const region = q('region').value;
  const citySel = q('city');
  for (let opt of citySel.options) {
    opt.style.display = opt.dataset.region === region ? 'block' : 'none';
  }
  for (let opt of citySel.options) {
    if (opt.style.display !== 'none') { citySel.value = opt.value; break; }
  }
  onCityChange();
}
function onCityChange() {
  const city = q('city').value;
  state.city = city;
  const data = CITIES[city];
  if (data) {
    q('region').value = data.region;
    const citySel = q('city');
    for (let opt of citySel.options) {
      opt.style.display = opt.dataset.region === data.region ? 'block' : 'none';
    }
  }
  calculate();
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════

function init() {
  onRegionChange();
  calculate();
}

init();