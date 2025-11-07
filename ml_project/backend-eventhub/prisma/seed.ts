import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed database with demo data
 */
async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user 1 (US number)
  const user1 = await prisma.user.upsert({
    where: {
      countryCode_mobile: {
        countryCode: '+1',
        mobile: '1234567890',
      },
    },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@eventhub.com',
      countryCode: '+1',
      mobile: '1234567890',
      dob: new Date('1990-01-15'),
      gender: 'prefer_not_to_say',
      isMobileVerified: true,
    },
  });

  console.log(`✅ Created demo user 1: ${user1.name} (${user1.countryCode}${user1.mobile})`);

  // Create demo user 2 (Indian number)
  const user2 = await prisma.user.upsert({
    where: {
      countryCode_mobile: {
        countryCode: '+91',
        mobile: '9455028137',
      },
    },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@eventhub.com',
      countryCode: '+91',
      mobile: '9455028137',
      dob: new Date('1995-06-20'),
      gender: 'prefer_not_to_say',
      isMobileVerified: true,
    },
  });

  console.log(`✅ Created demo user 2: ${user2.name} (${user2.countryCode}${user2.mobile})`);

  // Create sample events
  const events = [
    {
      title: 'Campus TechFest 2025 🚀',
      description: 'The biggest tech festival of the year! Featuring hackathons, tech talks, AI workshops, robotics competitions, and startup showcases. Win exciting prizes and internship opportunities. Date: Nov 15-17, 2025 | Location: Main Auditorium, Campus Hub',
      linkUrl: 'https://campustechfest.example.com',
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      startsAt: new Date('2025-11-15T09:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Annual Leadership Conference 👔',
      description: 'Executive leadership summit bringing together industry leaders, CEOs, and innovators. Keynote speeches, panel discussions, and networking sessions on future of business and technology. Date: Nov 20, 2025 | Location: Conference Hall A, Campus Hub',
      linkUrl: 'https://leadershipconf.example.com',
      bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
      startsAt: new Date('2025-11-20T10:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Academic Research Symposium 📚',
      description: 'Present your research, attend paper presentations, and engage with scholars from various disciplines. Topics include AI, biotechnology, renewable energy, and social sciences. Date: Nov 25, 2025 | Location: Library Auditorium, Campus Hub',
      linkUrl: 'https://researchsymposium.example.com',
      bannerUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
      startsAt: new Date('2025-11-25T09:30:00Z'),
      isPublished: true,
    },
    {
      title: 'Cultural Fest - Euphoria 2025 🎭',
      description: 'Three-day celebration of music, dance, drama, and art! Live performances, fashion shows, battle of bands, dance competitions, and celebrity nights. Experience the vibrance of campus culture. Date: Dec 1-3, 2025 | Location: Open Air Theatre, Campus Hub',
      linkUrl: 'https://euphoria2025.example.com',
      bannerUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      startsAt: new Date('2025-12-01T16:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Tech Conference 2025',
      description: 'Annual technology conference featuring the latest in AI, cloud computing, and web development. Join industry leaders and innovators for two days of inspiring talks and networking.',
      linkUrl: 'https://techconf2025.example.com',
      startsAt: new Date('2025-03-15T09:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Summer Music Festival',
      description: 'Experience the best live music performances from around the world. Three-day festival featuring over 50 artists across multiple stages.',
      linkUrl: 'https://summerfest.example.com',
      startsAt: new Date('2025-07-20T14:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Startup Pitch Competition',
      description: 'Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and VCs from the tech ecosystem.',
      linkUrl: 'https://pitchnight.example.com',
      startsAt: new Date('2025-02-28T18:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Art Gallery Opening',
      description: 'Contemporary art exhibition showcasing emerging artists. Join us for wine, cheese, and thought-provoking art.',
      linkUrl: 'https://artgallery.example.com',
      startsAt: new Date('2025-04-10T19:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Marathon 2025',
      description: 'Annual city marathon with 5K, 10K, and full marathon options. Register now and challenge yourself!',
      linkUrl: 'https://citymarathon.example.com',
      startsAt: new Date('2025-05-01T06:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Food & Wine Festival',
      description: 'Culinary event featuring world-class chefs, wine tastings, and cooking demonstrations. A gastronomic adventure awaits!',
      linkUrl: 'https://foodwinefest.example.com',
      startsAt: new Date('2025-06-15T12:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Blockchain Summit',
      description: 'Deep dive into blockchain technology, cryptocurrency, and Web3. Learn from experts and discover new opportunities.',
      linkUrl: 'https://blockchainsummit.example.com',
      startsAt: new Date('2025-08-05T09:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Photography Workshop',
      description: 'Hands-on photography workshop for all skill levels. Learn composition, lighting, and editing techniques from professionals.',
      linkUrl: 'https://photoworkshop.example.com',
      startsAt: new Date('2025-03-25T10:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Yoga & Wellness Retreat',
      description: 'Weekend retreat focused on mindfulness, yoga, and healthy living. Reset and recharge in a peaceful environment.',
      linkUrl: 'https://wellnessretreat.example.com',
      startsAt: new Date('2025-09-10T08:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Gaming Convention',
      description: 'Biggest gaming event of the year! Try unreleased games, meet developers, and compete in tournaments.',
      linkUrl: 'https://gamecon.example.com',
      startsAt: new Date('2025-10-20T10:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Charity Gala Night',
      description: 'Elegant evening supporting local charities. Black-tie event with dinner, entertainment, and silent auction.',
      linkUrl: 'https://charitygala.example.com',
      startsAt: new Date('2025-11-15T19:00:00Z'),
      isPublished: true,
    },
    {
      title: 'New Year Eve Party 2026',
      description: 'Ring in the new year with style! Live DJ, champagne toast, and spectacular fireworks display.',
      linkUrl: 'https://nyeparty.example.com',
      startsAt: new Date('2025-12-31T20:00:00Z'),
      isPublished: true,
    },
  ];

  for (const eventData of events) {
    await prisma.event.create({
      data: {
        ...eventData,
        createdBy: user1.id,
      },
    });
  }

  console.log(`✅ Created ${events.length} sample events`);

  // Create sample contacts for user1
  const contacts = [
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567891', notes: 'Met at tech conference' },
    { name: 'Bob Smith', email: 'bob@example.com', phone: '+1234567892', notes: 'College friend' },
    { name: 'Carol Williams', email: 'carol@example.com', phone: '+1234567893', notes: 'Business partner' },
    { name: 'David Brown', email: 'david@example.com', phone: '+1234567894', notes: 'Gym buddy' },
    { name: 'Emma Davis', email: 'emma@example.com', phone: '+1234567895', notes: 'Yoga instructor' },
    { name: 'Frank Miller', email: 'frank@example.com', phone: '+1234567896', notes: 'Photographer' },
    { name: 'Grace Wilson', email: 'grace@example.com', phone: '+1234567897', notes: 'Art enthusiast' },
    { name: 'Henry Moore', email: 'henry@example.com', phone: '+1234567898', notes: 'Marathon trainer' },
    { name: 'Ivy Taylor', email: 'ivy@example.com', phone: '+1234567899', notes: 'Chef' },
    { name: 'Jack Anderson', email: 'jack@example.com', phone: '+1234567800', notes: 'Developer' },
  ];

  for (const contactData of contacts) {
    await prisma.contact.create({
      data: {
        ...contactData,
        userId: user1.id,
      },
    });
  }

  console.log(`✅ Created ${contacts.length} sample contacts`);

  // Create a demo OTP for user1 (US number)
  const otpCode1 = '123456';
  const otpHash1 = await bcrypt.hash(otpCode1, 10);
  
  await prisma.otp.create({
    data: {
      countryCode: '+1',
      mobile: '1234567890',
      codeHash: otpHash1,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
      consumed: false,
    },
  });

  console.log(`✅ Created demo OTP for user1: ${otpCode1} (expires in 5 minutes)`);

  // Create a demo OTP for user2 (Indian number)
  const otpCode2 = '123456';
  const otpHash2 = await bcrypt.hash(otpCode2, 10);
  
  await prisma.otp.create({
    data: {
      countryCode: '+91',
      mobile: '9455028137',
      codeHash: otpHash2,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
      consumed: false,
    },
  });

  console.log(`✅ Created demo OTP for user2: ${otpCode2} (expires in 5 minutes)`);
  
  console.log(`\n📱 Test Accounts:`);
  console.log(`   1. Mobile: ${user1.countryCode}${user1.mobile} | OTP: ${otpCode1}`);
  console.log(`   2. Mobile: ${user2.countryCode}${user2.mobile} | OTP: ${otpCode2}`);
  console.log(`\n🎉 Seeding completed successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
