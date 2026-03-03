const mongoose = require('mongoose');
const Event = require('./src/models/Event');

// Sample event data
const sampleEvents = [
  {
    title: "AI Workshop: Machine Learning Fundamentals",
    description: "Learn the basics of machine learning and artificial intelligence in this hands-on workshop designed for beginners.",
    category: "Workshop",
    eventType: "Physical",
    faculty: "Computing",
    department: "Computer Science",
    venue: "Lab 301, Computing Building",
    date: new Date('2026-03-15T09:00:00'),
    endDate: new Date('2026-03-15T17:00:00'),
    capacity: 50,
    organizer: "Dr. Sarah Johnson",
    organizerEmail: "sarah.johnson@sliit.lk",
    sponsorshipEnabled: true,
    budget: 25000,
    tags: ["AI", "ML", "Workshop", "Technology"],
    isFeatured: true,
    status: "Approved",
    registrationCount: 35,
    attendanceCount: 28
  },
  {
    title: "Annual Cricket Tournament",
    description: "Inter-faculty cricket championship with exciting matches and prizes for winners.",
    category: "Sports",
    eventType: "Physical",
    faculty: "Business",
    department: "Sports Management",
    venue: "Main Ground, SLIIT Campus",
    date: new Date('2026-03-20T08:00:00'),
    endDate: new Date('2026-03-22T18:00:00'),
    capacity: 200,
    organizer: "Sports Club",
    organizerEmail: "sports@sliit.lk",
    sponsorshipEnabled: true,
    budget: 75000,
    tags: ["Cricket", "Sports", "Tournament", "Competition"],
    isFeatured: true,
    status: "Approved",
    registrationCount: 180,
    attendanceCount: 165
  },
  {
    title: "Web Development Bootcamp",
    description: "Intensive 3-day bootcamp covering HTML, CSS, JavaScript, and modern web frameworks.",
    category: "Workshop",
    eventType: "Hybrid",
    faculty: "Computing",
    department: "Software Engineering",
    venue: "Auditorium A + Online",
    date: new Date('2026-03-25T09:00:00'),
    endDate: new Date('2026-03-27T17:00:00'),
    capacity: 80,
    organizer: "Tech Club",
    organizerEmail: "techclub@sliit.lk",
    sponsorshipEnabled: false,
    budget: 15000,
    tags: ["Web", "JavaScript", "React", "Bootcamp"],
    isFeatured: false,
    status: "Pending",
    registrationCount: 65,
    attendanceCount: 0
  },
  {
    title: "Cultural Festival 2026",
    description: "Celebrate diversity with music, dance, food, and cultural performances from around the world.",
    category: "Cultural",
    eventType: "Physical",
    faculty: "Architecture",
    department: "Student Affairs",
    venue: "Main Auditorium",
    date: new Date('2026-04-01T10:00:00'),
    endDate: new Date('2026-04-01T22:00:00'),
    capacity: 500,
    organizer: "Cultural Club",
    organizerEmail: "cultural@sliit.lk",
    sponsorshipEnabled: true,
    budget: 100000,
    tags: ["Culture", "Music", "Dance", "Festival"],
    isFeatured: true,
    status: "Approved",
    registrationCount: 420,
    attendanceCount: 380
  },
  {
    title: "Career Fair 2026",
    description: "Meet top employers and explore career opportunities in various industries.",
    category: "Seminar",
    eventType: "Physical",
    faculty: "Business",
    department: "Career Guidance",
    venue: "Exhibition Hall",
    date: new Date('2026-04-05T09:00:00'),
    endDate: new Date('2026-04-05T17:00:00'),
    capacity: 300,
    organizer: "Career Services",
    organizerEmail: "careers@sliit.lk",
    sponsorshipEnabled: true,
    budget: 50000,
    tags: ["Career", "Jobs", "Networking", "Recruitment"],
    isFeatured: true,
    status: "Approved",
    registrationCount: 280,
    attendanceCount: 245
  },
  {
    title: "Hackathon 2026",
    description: "24-hour coding competition to solve real-world problems and win exciting prizes.",
    category: "Competition",
    eventType: "Physical",
    faculty: "Computing",
    department: "Innovation Lab",
    venue: "Innovation Center",
    date: new Date('2026-04-10T09:00:00'),
    endDate: new Date('2026-04-11T09:00:00'),
    capacity: 100,
    organizer: "Innovation Club",
    organizerEmail: "innovation@sliit.lk",
    sponsorshipEnabled: true,
    budget: 60000,
    tags: ["Hackathon", "Coding", "Competition", "Innovation"],
    isFeatured: true,
    status: "Approved",
    registrationCount: 95,
    attendanceCount: 88
  },
  {
    title: "Guest Lecture: Blockchain Technology",
    description: "Industry expert shares insights on blockchain applications in modern business.",
    category: "Seminar",
    eventType: "Virtual",
    faculty: "Computing",
    department: "Research",
    venue: "Online via Zoom",
    date: new Date('2026-04-15T14:00:00'),
    endDate: new Date('2026-04-15T16:00:00'),
    capacity: 150,
    organizer: "Research Department",
    organizerEmail: "research@sliit.lk",
    sponsorshipEnabled: false,
    budget: 5000,
    tags: ["Blockchain", "Technology", "Seminar", "Virtual"],
    isFeatured: false,
    status: "Pending",
    registrationCount: 85,
    attendanceCount: 0
  },
  {
    title: "Photography Exhibition",
    description: "Student photography showcase featuring themes of nature, urban life, and abstract art.",
    category: "Cultural",
    eventType: "Physical",
    faculty: "Architecture",
    department: "Design",
    venue: "Art Gallery",
    date: new Date('2026-04-18T10:00:00'),
    endDate: new Date('2026-04-20T18:00:00'),
    capacity: 100,
    organizer: "Photography Club",
    organizerEmail: "photo@sliit.lk",
    sponsorshipEnabled: false,
    budget: 8000,
    tags: ["Photography", "Art", "Exhibition", "Culture"],
    isFeatured: false,
    status: "Approved",
    registrationCount: 75,
    attendanceCount: 68
  },
  {
    title: "Robotics Workshop",
    description: "Build and program your first robot in this hands-on workshop for engineering students.",
    category: "Workshop",
    eventType: "Physical",
    faculty: "Engineering",
    department: "Electronics",
    venue: "Robotics Lab",
    date: new Date('2026-04-22T09:00:00'),
    endDate: new Date('2026-04-22T17:00:00'),
    capacity: 30,
    organizer: "Robotics Club",
    organizerEmail: "robotics@sliit.lk",
    sponsorshipEnabled: true,
    budget: 20000,
    tags: ["Robotics", "Engineering", "Workshop", "Technology"],
    isFeatured: false,
    status: "Approved",
    registrationCount: 28,
    attendanceCount: 25
  },
  {
    title: "Business Plan Competition",
    description: "Present your innovative business ideas to win seed funding and mentorship.",
    category: "Competition",
    eventType: "Hybrid",
    faculty: "Business",
    department: "Entrepreneurship",
    venue: "Conference Hall + Online",
    date: new Date('2026-04-25T09:00:00'),
    endDate: new Date('2026-04-25T18:00:00'),
    capacity: 60,
    organizer: "Entrepreneurship Club",
    organizerEmail: "entrepreneur@sliit.lk",
    sponsorshipEnabled: true,
    budget: 40000,
    tags: ["Business", "Competition", "Startup", "Innovation"],
    isFeatured: true,
    status: "Approved",
    registrationCount: 55,
    attendanceCount: 48
  },
  {
    title: "Environmental Awareness Campaign",
    description: "Learn about sustainability and participate in campus green initiatives.",
    category: "Seminar",
    eventType: "Physical",
    faculty: "Science",
    department: "Environmental Science",
    venue: "Science Building Hall",
    date: new Date('2026-04-28T13:00:00'),
    endDate: new Date('2026-04-28T17:00:00'),
    capacity: 120,
    organizer: "Green Club",
    organizerEmail: "green@sliit.lk",
    sponsorshipEnabled: false,
    budget: 3000,
    tags: ["Environment", "Sustainability", "Green", "Campaign"],
    isFeatured: false,
    status: "Pending",
    registrationCount: 45,
    attendanceCount: 0
  },
  {
    title: "Music Concert 2026",
    description: "Annual music concert featuring student bands and special guest performers.",
    category: "Cultural",
    eventType: "Physical",
    faculty: "Architecture",
    department: "Student Affairs",
    venue: "Open Air Theater",
    date: new Date('2026-05-01T18:00:00'),
    endDate: new Date('2026-05-01T23:00:00'),
    capacity: 800,
    organizer: "Music Club",
    organizerEmail: "music@sliit.lk",
    sponsorshipEnabled: true,
    budget: 120000,
    tags: ["Music", "Concert", "Cultural", "Entertainment"],
    isFeatured: true,
    status: "Approved",
    registrationCount: 750,
    attendanceCount: 680
  },
  {
    title: "Data Science Conference",
    description: "Explore latest trends in data science, analytics, and big data technologies.",
    category: "Conference",
    eventType: "Hybrid",
    faculty: "Computing",
    department: "Data Science",
    venue: "Main Auditorium + Online",
    date: new Date('2026-05-05T09:00:00'),
    endDate: new Date('2026-05-06T17:00:00'),
    capacity: 200,
    organizer: "Data Science Club",
    organizerEmail: "datascience@sliit.lk",
    sponsorshipEnabled: true,
    budget: 80000,
    tags: ["Data Science", "Analytics", "Conference", "Technology"],
    isFeatured: true,
    status: "Approved",
    registrationCount: 180,
    attendanceCount: 165
  },
  {
    title: "Debate Championship",
    description: "Inter-university debate competition on contemporary social and political issues.",
    category: "Competition",
    eventType: "Physical",
    faculty: "Business",
    department: "Communication",
    venue: "Debate Hall",
    date: new Date('2026-05-08T09:00:00'),
    endDate: new Date('2026-05-09T18:00:00'),
    capacity: 80,
    organizer: "Debate Club",
    organizerEmail: "debate@sliit.lk",
    sponsorshipEnabled: false,
    budget: 10000,
    tags: ["Debate", "Competition", "Communication", "Academic"],
    isFeatured: false,
    status: "Approved",
    registrationCount: 72,
    attendanceCount: 68
  },
  {
    title: "Startup Pitch Day",
    description: "Student startups pitch their ideas to investors and industry mentors.",
    category: "Seminar",
    eventType: "Hybrid",
    faculty: "Business",
    department: "Entrepreneurship",
    venue: "Innovation Hub + Online",
    date: new Date('2026-05-12T10:00:00'),
    endDate: new Date('2026-05-12T16:00:00'),
    capacity: 100,
    organizer: "Startup Accelerator",
    organizerEmail: "startup@sliit.lk",
    sponsorshipEnabled: true,
    budget: 35000,
    tags: ["Startup", "Pitch", "Investment", "Entrepreneurship"],
    isFeatured: true,
    status: "Pending",
    registrationCount: 88,
    attendanceCount: 0
  }
];

async function seedEvents() {
  try {
    // Load environment variables
    require('dotenv').config();
    
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not configured');
    }
    
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');
    
    // Clear existing events (optional - remove if you want to keep existing data)
    await Event.deleteMany({});
    console.log('✓ Cleared existing events');
    
    // Insert sample events
    const insertedEvents = await Event.insertMany(sampleEvents);
    console.log(`✓ Successfully inserted ${insertedEvents.length} events`);
    
    // Display inserted events
    console.log('\n📋 Inserted Events:');
    insertedEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${event.status}`);
    });
    
    // Close connection
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
    console.log('🎉 Event seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedEvents();
}

module.exports = seedEvents;
