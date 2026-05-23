// ═══════════════════════════════════════════
// js/constants.js — всі коефіцієнти, міста, хімії
// ═══════════════════════════════════════════

const CHEMISTRY = {
  liion:   { peukert: 1.15, dod: 0.90, tempCoeff: { '-20':0.55, '-10':0.70, '0':0.82, '10':0.93, '20':1.00, '30':0.98, '40':0.95 } },
  lifepo4: { peukert: 1.05, dod: 0.95, tempCoeff: { '-20':0.65, '-10':0.78, '0':0.88, '10':0.96, '20':1.00, '30':0.99, '40':0.97 } },
  nimh:    { peukert: 1.25, dod: 0.80, tempCoeff: { '-20':0.45, '-10':0.60, '0':0.75, '10':0.88, '20':1.00, '30':0.96, '40':0.90 } }
};

const RIDING_STYLE = { eco: 0.82, normal: 1.00, sport: 1.28 };
const SURFACE_CRR = { ideal: 0.008, normal: 0.012, cobble: 0.020, dirt: 0.035 };
const TERRAIN = {
  flat:    { slope: 0,   penalty: 0,    regen: 0    },
  rolling: { slope: 1.5, penalty: 0.08, regen: 0.05 },
  hilly:   { slope: 3.0, penalty: 0.18, regen: 0.10 }
};
const MOTOR_EFF = 0.85;
const G = 9.81;
const RHO = 1.225;
const CD = 1.0;
const AREA = 0.5;
const BASE_MASS = 100;

const CITIES = {
  kyiv:           { terrain:'rolling', road:1.05, region:'center' },
  kharkiv:        { terrain:'flat',    road:1.02, region:'east'   },
  odesa:          { terrain:'flat',    road:1.08, region:'south'  },
  dnipro:         { terrain:'rolling', road:1.04, region:'center' },
  lviv:           { terrain:'hilly',   road:1.06, region:'west'   },
  zaporizhzhia:   { terrain:'flat',    road:1.05, region:'south'  },
  kryvyi_rih:     { terrain:'rolling', road:1.10, region:'center' },
  mykolaiv:       { terrain:'flat',    road:1.06, region:'south'  },
  vinnytsia:      { terrain:'rolling', road:1.03, region:'west'   },
  poltava:        { terrain:'flat',    road:1.02, region:'east'   },
  chernivtsi:     { terrain:'hilly',   road:1.08, region:'west'   },
  uzhhorod:       { terrain:'hilly',   road:1.07, region:'west'   },
  kherson:        { terrain:'flat',    road:1.09, region:'south'  },
  sumy:           { terrain:'flat',    road:1.03, region:'east'   },
  chernihiv:      { terrain:'flat',    road:1.04, region:'north'  }
};

// Typical seasonal temperatures per region (for future features)
const SEASONAL_TEMPS = {
  center: { winter:-5, spring:12, summer:25, autumn:10 },
  north:  { winter:-8, spring:10, summer:23, autumn:8  },
  south:  { winter:2,  spring:15, summer:28, autumn:14 },
  east:   { winter:-7, spring:11, summer:24, autumn:9  },
  west:   { winter:-3, spring:13, summer:22, autumn:11 }
};