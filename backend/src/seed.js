/**
 * Seeds the database with:
 *  - one Admin account (from ADMIN_EMAIL / ADMIN_PASSWORD in .env)
 *  - the Project and Service records that used to be hardcoded in the
 *    frontend's Work.tsx and Services.tsx, so the site looks identical
 *    on first run but is now reading from MongoDB.
 *
 * Safe to re-run: it skips creating records that already exist rather
 * than duplicating them.
 *
 * Usage: npm run seed
 */
require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Service = require('./models/Service');

const CDN = 'https://cdn.prod.website-files.com/6a71a3264c012e91819a93fc';

const PROJECTS = [
  {
    name: 'CTO Bees',
    order: 1,
    bg: '#ffcd71',
    textDark: true,
    href: 'https://ctobees.com/',
    description:
      'A boutique consulting firm uniting strategic foresight with technical depth — empowering businesses to transform, scale, and deliver exceptional customer experiences through the power of AI and a premium CTO-to-CMO partnership.',
    imageUrl: `${CDN}/6a8d5806c2d5cb1b0331c4ff_Frame%2051.png`,
  },
  {
    name: 'Manana Films',
    order: 2,
    bg: '#1f1f1f',
    textDark: false,
    href: 'https://www.mananafilms.fr/',
    description:
      'Since the inception of RealBiomes in 2020 our goal was always clear, to package beyond AAA visual fidelity together with intuitive technical solutions allowing anyone from students to seasoned developers to create anything from beautiful cinematic compositions to impressive game environments.',
    imageUrl: `${CDN}/6a71d329f090a25cd5c0f0ec_case-2.avif`,
  },
  {
    name: 'Lumino',
    order: 3,
    bg: '#fae7d5',
    textDark: true,
    href: 'https://lumino.io/',
    description:
      "The payments industry has been the same for decades. We're changing that — by building infrastructure that puts the merchant first, always. Lumino was founded on the belief that modern merchants deserve better — better tools, better pricing, better support.",
    imageUrl: `${CDN}/6a71d329f2a8cb74a99ef836_case-3.avif`,
  },
  {
    name: 'JACK3D',
    order: 4,
    bg: '#1049cc',
    textDark: false,
    href: 'https://www.jack3d.com/',
    description:
      "Took three scoops, went to the gym, cleaned my whole apartment, mowed two lawns, and proposed to my girlfriend's blender. Not necessarily in that order. Jack3d — pre-workout that hits different.",
    imageUrl: `${CDN}/6a71d3297c7b88707989f542_case-4.avif`,
  },
  {
    name: 'Almore Capital',
    order: 5,
    bg: '#7a6e5b',
    textDark: false,
    href: 'https://www.almorecapital.com/',
    description:
      'Almore is a commercial mortgage lender operating across major markets in the U.S. and Canada, delivering stable monthly income to investors through its professionally managed, investment-grade mortgage fund.',
    imageUrl: `${CDN}/6a71d32844bef491250fac62_case-5.avif`,
  },
];

const SERVICES = [
  {
    title: 'Webflow Development',
    order: 1,
    description:
      "I build every Webflow project from scratch using BEM class naming, custom GSAP animations, and a CMS architecture designed to scale. Whether it's a marketing site, a multi-page platform, or a complex corporate build — the code is clean, the interactions are smooth, and the site performs.",
    imageUrl: `${CDN}/6a7991559e4a4c85594f0b56_Webflow%20Development.avif`,
  },
  {
    title: 'UI/UX Design',
    order: 2,
    description:
      'Every interface is designed with clarity, usability, and conversion in mind. Our team creates intuitive user experiences, scalable design systems, and pixel-perfect interfaces that balance business goals with user needs.',
    imageUrl: `${CDN}/6a79915d29b87b6155b77dfa_UX%20Design.avif`,
  },
  {
    title: 'Motion & Animation',
    order: 3,
    description:
      'Meaningful motion brings products to life. From subtle micro-interactions to advanced product animations, every transition is crafted to improve usability, reinforce your brand, and create a memorable experience.',
    imageUrl: `${CDN}/6a79915587bc33859b8b8d72_Motion%20%26%20Animation.avif`,
  },
  {
    title: 'Marketing Strategy',
    order: 4,
    description:
      'Great design is only effective with the right strategy. We help define positioning, user journeys, messaging, and conversion paths that turn visitors into qualified leads and long-term customers.',
    imageUrl: `${CDN}/6a7991565a03d7f75b8c6a9d_Marketing%20Strategy.avif`,
  },
  {
    title: 'Copywriting',
    order: 5,
    description:
      "Every word has a purpose. Our copy is written to communicate clearly, build trust, and guide users toward action — whether it's landing pages, product messaging, or complete website content.",
    imageUrl: `${CDN}/6a799156d034a900949dcf4a_Copywriting.avif`,
  },
];

async function seed() {
  await connectDB();

  // --- Admin ---
  const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin creation.');
  } else {
    const existing = await Admin.findOne({ email: adminEmail });
    if (existing) {
      console.log(`Admin already exists: ${adminEmail}`);
    } else {
      const passwordHash = await Admin.hashPassword(adminPassword);
      await Admin.create({ email: adminEmail, passwordHash, name: 'NBNZIA' });
      console.log(`Admin created: ${adminEmail}`);
    }
  }

  // --- Projects ---
  const projectCount = await Project.countDocuments();
  if (projectCount > 0) {
    console.log(`Projects already seeded (${projectCount} found) — skipping.`);
  } else {
    await Project.insertMany(PROJECTS);
    console.log(`Seeded ${PROJECTS.length} projects.`);
  }

  // --- Services ---
  const serviceCount = await Service.countDocuments();
  if (serviceCount > 0) {
    console.log(`Services already seeded (${serviceCount} found) — skipping.`);
  } else {
    await Service.insertMany(SERVICES);
    console.log(`Seeded ${SERVICES.length} services.`);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
