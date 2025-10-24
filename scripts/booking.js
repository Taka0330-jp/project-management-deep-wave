(function () {
  //  Generic pills: click to select (single-select) & arrow scroll 
  document.querySelectorAll('.filter-row').forEach(row => {
    const list = row.querySelector('.pills');
    const next = row.querySelector('[data-next]');

    if (list) {
      list.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill');
        if (!btn || btn.disabled) return;
        list.querySelectorAll('.pill').forEach(p => p.classList.remove('pill--active'));
        btn.classList.add('pill--active');
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });

      // keyboard: ← →
      list.addEventListener('keydown', (e) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        e.preventDefault();
        const pills = [...list.querySelectorAll('.pill:not(.pill--disabled)')];
        const cur = list.querySelector('.pill--active') || pills[0];
        let i = pills.indexOf(cur);
        i = e.key === 'ArrowRight' ? Math.min(i + 1, pills.length - 1) : Math.max(i - 1, 0);
        pills[i].click();
      });

      function syncRowCentering(row) {
      const list = row.querySelector('.pills');
      if (!list) return;
      const arrows = [...row.querySelectorAll('.arrow')];

     // +2 để tránh sai số đo; nếu list rộng hơn khung -> overflow = true
     const overflow = list.scrollWidth > (list.clientWidth + 2);

     list.classList.toggle('is-centered', !overflow);
     arrows.forEach(a => a.classList.toggle('is-hidden', !overflow));
     }

     function setupAutoCentering() {
     document.querySelectorAll('.filter-row').forEach(row => {
     const list = row.querySelector('.pills');
     if (!list) return;
     syncRowCentering(row);
     const ro = new ResizeObserver(() => syncRowCentering(row));
     ro.observe(list);
     window.addEventListener('resize', () => syncRowCentering(row));
     });
    }
    setupAutoCentering();

    }

    // simple scroll with next button (no prev in design for these rows)
    next?.addEventListener('click', () => {
      list?.scrollBy({ left: 240, behavior: 'smooth' });
    });
  });

  // ----- Real Calendar for Days -----
  const DAY_COUNT = 5;      // number of visible pills (Today + 4 next)
  const STEP = 1;           // arrow step in days
  const LOCK_PAST = true;   // prevent selecting before today

  const daysRow  = document.querySelector('[data-row="days"]');
  const daysList = document.querySelector('[data-days]');
  const monthEl  = document.querySelector('[data-month]');
  const prevBtn  = daysRow?.querySelector('[data-prev]');
  const nextBtn  = daysRow?.querySelector('[data-next]');
  if (!daysRow || !daysList || !monthEl) return;

  const today = startOfDay(new Date());
  let anchor  = startOfDay(new Date()); // first day of window
  let active  = startOfDay(new Date()); // selected day

  function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function sameDate(a,b){ return a.getTime() === b.getTime(); }

  const fmtDay  = new Intl.DateTimeFormat('en', { weekday: 'short' }); // Sat
  const fmtNum  = new Intl.DateTimeFormat('en', { day: 'numeric' });   // 4
  const fmtMon  = new Intl.DateTimeFormat('en', { month: 'short' });   // Oct
  const fmtFull = new Intl.DateTimeFormat('en', { year:'numeric', month:'short', day:'numeric' });

  function renderDays(){
    daysList.innerHTML = '';
    for (let i = 0; i < DAY_COUNT; i++){
      const d = startOfDay(anchor); d.setDate(d.getDate() + i);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill';
      btn.textContent = sameDate(d, today) ? 'Today' : `${fmtDay.format(d)} ${fmtNum.format(d)}`;

      if (sameDate(d, active)) btn.classList.add('pill--active');
      if (LOCK_PAST && d < today){ btn.disabled = true; btn.classList.add('pill--disabled'); }

      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        active = d;
        renderDays();
        btn.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
        updateMonthTitle();
      });

      const li = document.createElement('li'); li.appendChild(btn);
      daysList.appendChild(li);
    }
    updateMonthTitle();
    updatePrevState();
  }

  function updateMonthTitle(){
    const first = new Date(anchor);
    const last  = new Date(anchor); last.setDate(last.getDate() + (DAY_COUNT-1));
    const m1 = fmtMon.format(first), m2 = fmtMon.format(last);
    monthEl.textContent = (m1 === m2) ? m1 : `${m1}–${m2}`;
  }

  function updatePrevState(){
    if (!LOCK_PAST) return;
    const prevAnchor = new Date(anchor); prevAnchor.setDate(prevAnchor.getDate() - STEP);
    prevBtn.disabled = prevAnchor < today;
  }

  prevBtn?.addEventListener('click', () => {
    const newAnchor = new Date(anchor); newAnchor.setDate(newAnchor.getDate() - STEP);
    if (LOCK_PAST && newAnchor < today) return;
    anchor = startOfDay(newAnchor);
    if (active < anchor) active = startOfDay(anchor);
    renderDays();
  });

  nextBtn?.addEventListener('click', () => {
    anchor.setDate(anchor.getDate() + STEP);
    const end = new Date(anchor); end.setDate(end.getDate() + (DAY_COUNT-1));
    if (active > end) active = end;
    renderDays();
  });

  // keyboard on days list
  daysList.addEventListener('keydown', (e) => {
    if (!['ArrowLeft','ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const next = new Date(active); next.setDate(next.getDate() + delta);
    if (LOCK_PAST && next < today) return;

    // shift window if necessary
    if (next < anchor){ anchor = startOfDay(next); }
    const end = new Date(anchor); end.setDate(end.getDate() + (DAY_COUNT-1));
    if (next > end){ anchor = startOfDay(next); anchor.setDate(anchor.getDate() - (DAY_COUNT-1)); }
    active = startOfDay(next);
    renderDays();
  });

  // initial render
  renderDays();
  // expose selected data for Book Now mock
  function getSelectedDay() {
    return sameDate(active, today) ? 'Today' : fmtFull.format(active);
  }

  document.querySelector('[data-cta="book"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    const sport = pickText('.filter-row[data-row="sports"] .pill--active');
    const loc   = pickText('.filter-row[data-row="location"] .pill--active');
    const serv  = pickText('.filter-row[data-row="service"] .pill--active');
    alert(`Booking (mock)
Sport: ${sport}
Location: ${loc}
Service: ${serv}
Day: ${getSelectedDay()}`);
  });

  function pickText(sel){
    const el = document.querySelector(sel);
    return el ? el.textContent.trim() : '';
  }
})();
