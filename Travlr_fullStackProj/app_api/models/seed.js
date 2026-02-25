const path = require('path');
const mongoose = require('../app_api/models/db'); // will connect & require model
const Trip = require('../app_api/models/travlr');
const fs = require('fs');

const tripsPath = path.join(__dirname, '../data/trips.json');
if (!fs.existsSync(tripsPath)) {
  console.error('trips.json not found at:', tripsPath);
  process.exit(1);
}

let tripsData;
try {
  tripsData = JSON.parse(fs.readFileSync(tripsPath, 'utf8'));
} catch (err) {
  console.error('Failed to parse trips.json:', err.message);
  process.exit(1);
}

const getVal = (obj, ...keys) => {
  if (!obj) return undefined;
  for (const k of keys) if (obj[k] !== undefined) return obj[k];
  if (obj.fields) for (const k of keys) if (obj.fields[k] !== undefined) return obj.fields[k];
  return undefined;
};

const parseStart = raw => {
  if (!raw) return new Date();
  const d = new Date(raw);
  return (d instanceof Date && !isNaN(d.getTime())) ? d : new Date();
};

const parsePrice = raw => {
  const s = String(raw ?? '').trim();
  const n = parseFloat(s.replace(/[^0-9.\-]+/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const normalizeImage = img => {
  const s = String(img ?? '');
  return s.startsWith('/images/') ? s : `/images/${s.replace(/^\/+/, '')}`;
};

const codeMap = {
  '1': 'GALR210214',
  '2': 'DAWR210315',
  '3': 'CLRR210328'
};

const cleanedTrips = tripsData.map((t, i) => {
  const rawCode = getVal(t, 'code', 'Code', 'id', 'ID') ?? t.id ?? (i + 1);
  const code = String(codeMap[String(rawCode)] ?? rawCode);
  const name = getVal(t, 'name', 'Name', 'title', 'Title') ?? `Trip ${i + 1}`;
  const length = getVal(t, 'length', 'Length', 'duration') ?? '4 nights / 5 days';
  const startRaw = getVal(t, 'start', 'Start', 'date', 'Date') ?? getVal(t, 'startDate');
  const start = parseStart(startRaw);
  const resort = getVal(t, 'resort', 'Resort', 'location') ?? 'Unknown Resort';
  const perPerson = parsePrice(getVal(t, 'perPerson', 'price', 'Price', 'cost', 'Cost')) ?? 0;
  const image = normalizeImage(getVal(t, 'image', 'Image', 'img', 'photo') ?? getVal(t, 'link') ?? getVal(t, 'image'));
  const d1 = getVal(t, 'description', 'Description', 'desc', 'details', 'description1') ?? '';
  const d2 = getVal(t, 'description2', 'details2') ?? '';
  const description = d1 && d2 ? `${d1}\n\n${d2}` : (d1 || d2 || 'No description provided');
  return { code, name, length, start, resort, perPerson, image, description };
});

mongoose.connection.once('open', async () => {
  try {
    console.log(`MongoDB connected. Number of trips to insert: ${cleanedTrips.length}`);
    await Trip.deleteMany({});
    console.log('Existing trips removed');
    await Trip.insertMany(cleanedTrips);
    console.log('Trips inserted successfully');
    await mongoose.connection.close();
    console.log('Mongoose disconnected');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(1);
  }
});

// const path = require('path');
// const mongoose = require('./db'); 
// const Trip = require('./travlr');
// const fs = require('fs');

// const tripsPath = path.join(__dirname, '../../data/trips.json');
// if (!fs.existsSync(tripsPath)) {
//   console.error('trips.json not found at:', tripsPath);
//   process.exit(1);
// }

// let tripsData;
// try {
//   tripsData = JSON.parse(fs.readFileSync(tripsPath, 'utf8'));
// } catch (err) {
//   console.error('Failed to parse trips.json:', err.message);
//   process.exit(1);
// }

// const getVal = (obj, ...keys) => {
//   if (!obj) return undefined;
//   for (const k of keys) if (obj[k] !== undefined) return obj[k];
//   if (obj.fields) for (const k of keys) if (obj.fields[k] !== undefined) return obj.fields[k];
//   return undefined;
// };

// const parseStart = raw => {
//   if (!raw) return null;
//   const d = new Date(raw);
//   return (d instanceof Date && !isNaN(d.getTime())) ? d : null;
// };

// const parsePrice = raw => {
//   const s = String(raw ?? '').trim();
//   const n = parseFloat(s.replace(/[^0-9.\-]+/g, ''));
//   return Number.isFinite(n) ? n : null;
// };

// const normalizeImage = img => {
//   const s = String(img ?? '');
//   return s.startsWith('/images/') ? s : `/images/${s.replace(/^\/+/, '')}`;
// };

// const codeMap = {
//   '1': 'GALR210214',
//   '2': 'DAWR210315',
//   '3': 'CLRR210328'
// };

// const cleanedTrips = tripsData.map((t, i) => {
//   const rawCode = getVal(t, 'code', 'Code', 'id', 'ID') ?? t.id ?? (i + 1);
//   const code = String(codeMap[String(rawCode)] ?? rawCode);
//   const name = getVal(t, 'name', 'Name', 'title', 'Title') ?? `Trip ${i + 1}`;
//   const length = getVal(t, 'length', 'Length', 'duration') ?? '4 nights / 5 days';

//   const startRaw = getVal(t, 'start', 'Start', 'date', 'Date') ?? getVal(t, 'startDate');
//   const start = parseStart(startRaw) ?? new Date('2021-02-14T08:00:00Z');

//   const resort = getVal(t, 'resort', 'Resort', 'location') ?? 'Unknown Resort';

//   const perPerson = parsePrice(getVal(t, 'perPerson', 'price', 'Price', 'cost', 'Cost')) ?? 999.00;

//   const image = normalizeImage(getVal(t, 'image', 'Image', 'img', 'photo') ?? getVal(t, 'link') ?? getVal(t, 'image'));

//   const d1 = getVal(t, 'description', 'Description', 'desc', 'details', 'description1') ?? '';
//   const d2 = getVal(t, 'description2', 'details2') ?? '';
//   const description = d1 && d2 ? `${d1}\n\n${d2}` : (d1 || d2 || 'No description provided');

//   return { code, name, length, start, resort, perPerson, image, description };
// });

// mongoose.connection.once('open', async () => {
//   try {
//     console.log(`MongoDB connected. Number of trips to insert: ${cleanedTrips.length}`);
    
//     console.log('Mongoose connected to mongodb://127.0.0.1:27017/travlr');

//     await Trip.deleteMany({});
//     console.log('Existing trips removed');

//     await Trip.insertMany(cleanedTrips);
//     console.log('Trips inserted successfully');

//     await mongoose.connection.close();
//     console.log('Mongoose disconnected');
//     process.exit(0);
//   } catch (err) {
//     console.error('Error seeding database:', err);
//     try { await mongoose.connection.close(); } catch (e) {}
//     process.exit(1);
//   }
// });

