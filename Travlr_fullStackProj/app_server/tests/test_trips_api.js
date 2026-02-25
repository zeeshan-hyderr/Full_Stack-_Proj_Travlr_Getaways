(async () => {
  const url = 'http://localhost:3000/api/trips';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Response is not an array');

    const required = ['code','name','length','start','resort','perPerson','image','description'];
    const errors = [];

    data.forEach((t, i) => {
      if (typeof t !== 'object' || t === null) { errors.push(`item ${i} not an object`); return; }
      for (const f of required) {
        if (!(f in t)) { errors.push(`item ${i} missing "${f}"`); continue; }
        const v = t[f];
        if (f === 'start') {
          const d = new Date(v);
          if (!(d instanceof Date) || isNaN(d.getTime())) errors.push(`item ${i} start invalid: ${v}`);
        } else if (f === 'perPerson') {
          if (typeof v !== 'number') errors.push(`item ${i} perPerson not number: ${v}`);
        } else {
          if (typeof v !== 'string' || v.trim() === '') errors.push(`item ${i} ${f} empty or not a string`);
        }
      }
    });

    if (errors.length) {
      console.error('Validation failed:', errors.join('; '));
      process.exit(1);
    }

    console.log(`API OK: returned ${data.length} trips with expected structure`);
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exit(2);
  }
})();