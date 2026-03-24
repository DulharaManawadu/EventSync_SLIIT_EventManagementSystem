const mongoose = require('mongoose');
const Event = require('./src/models/Event');
require('dotenv').config();

// Sample events data matching the new format
const sampleEvents = [
  {
    title: "Annual Tech Summit 2024",
    description: "Join us for the most comprehensive technology summit featuring AI, blockchain, and cloud computing innovations. This full-day event includes keynote speeches, technical workshops, and networking opportunities with industry leaders.",
    category: "Technical",
    eventType: "Physical",
    faculty: "Computing",
    department: "Software Engineering",
    venue: "Main Auditorium, SLIIT",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 7 days + 9 hours
    capacity: 500,
    organizerName: "Dr. Sarah Johnson",
    organizerEmail: "sarah.johnson@sliit.lk",
    phoneNumbers: ["+94 11 234 5678", "+94 77 123 4567"],
    societyName: "Computer Society",
    budget: 150000,
    tags: ["technology", "AI", "blockchain", "cloud", "networking"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 50000,
        benefits: "Premium seating, VIP networking session, complimentary lunch, certificate of attendance, exclusive workshop access"
      },
      {
        tierName: "Silver",
        price: 25000,
        benefits: "Standard seating, networking session access, certificate of attendance"
      },
      {
        tierName: "Bronze",
        price: 10000,
        benefits: "General admission, certificate of attendance"
      }
    ]
  },
  {
    title: "Business Innovation Workshop",
    description: "A hands-on workshop focusing on startup methodologies, business model canvas, and pitch deck creation. Perfect for aspiring entrepreneurs and business students looking to launch their ventures.",
    category: "Workshop",
    eventType: "Physical",
    faculty: "Business",
    department: "Management",
    venue: "Conference Hall B, SLIIT",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 12 days + 3 hours
    capacity: 100,
    organizerName: "Prof. Michael Chen",
    organizerEmail: "michael.chen@sliit.lk",
    phoneNumbers: ["+94 11 345 6789"],
    societyName: "Business Club",
    budget: 75000,
    tags: ["business", "innovation", "startup", "entrepreneurship"],
    sponsorshipEnabled: false
  },
  {
    title: "Virtual AI & Machine Learning Conference",
    description: "An international virtual conference bringing together AI researchers, practitioners, and enthusiasts. Features live demos, panel discussions, and hands-on tutorials covering the latest in ML and deep learning.",
    category: "Conference",
    eventType: "Virtual",
    faculty: "Computing",
    department: "Data Science",
    venue: "Online Platform - Zoom",
    date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
    endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 23 days + 6 hours
    capacity: 1000,
    organizerName: "Dr. Alex Kumar",
    organizerEmail: "alex.kumar@sliit.lk",
    phoneNumbers: ["+94 76 234 5678", "+94 11 890 1234"],
    societyName: "AI Research Society",
    budget: 200000,
    tags: ["AI", "machine learning", "virtual", "conference", "technology"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 75000,
        benefits: "Full conference access, workshop recordings, networking directory, certificate"
      },
      {
        tierName: "Silver",
        price: 35000,
        benefits: "Conference access, select workshop recordings, certificate"
      }
    ]
  },
  {
    title: "Cultural Fusion Night 2024",
    description: "A vibrant celebration of cultural diversity featuring traditional and contemporary performances, food festivals, and art exhibitions. Showcasing talents from various cultural backgrounds within SLIIT community.",
    category: "Cultural",
    eventType: "Physical",
    faculty: "Architecture",
    department: "Design",
    venue: "Open Air Theatre, SLIIT",
    date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
    endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 17 days + 4 hours
    capacity: 800,
    organizerName: "Ms. Priya Perera",
    organizerEmail: "priya.perera@sliit.lk",
    phoneNumbers: ["+94 11 456 7890"],
    societyName: "Cultural Society",
    budget: 120000,
    tags: ["culture", "performance", "diversity", "celebration", "art"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 30000,
        benefits: "VIP seating, backstage access, meet & greet with performers"
      },
      {
        tierName: "Silver",
        price: 15000,
        benefits: "Preferred seating, event merchandise"
      }
    ]
  },
  {
    title: "Hackathon 2024: Code for Change",
    description: "48-hour intensive coding competition challenging participants to develop innovative solutions for real-world problems. Includes mentorship, food, and amazing prizes for winning teams.",
    category: "Competition",
    eventType: "Physical",
    faculty: "Computing",
    department: "Software Engineering",
    venue: "Tech Lab Building, SLIIT",
    date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
    endDate: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000), // 34 days from now (48 hours later)
    capacity: 200,
    organizerName: "Mr. Nimal Fernando",
    organizerEmail: "nimal.fernando@sliit.lk",
    phoneNumbers: ["+94 77 234 5678"],
    societyName: "Coding Club",
    budget: 180000,
    tags: ["hackathon", "coding", "competition", "innovation", "48hours"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 100000,
        benefits: "Team sponsorship, branding opportunities, judge mentoring session"
      }
    ]
  },
  {
    title: "Career Development Seminar",
    description: "Professional development seminar featuring industry experts sharing insights on career growth, interview skills, and workplace success strategies. Includes resume review sessions and networking.",
    category: "Seminar",
    eventType: "Hybrid",
    faculty: "Business",
    department: "Management",
    venue: "Main Hall + Online Streaming",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 20 days + 3 hours
    capacity: 300,
    organizerName: "Dr. Lisa Wang",
    organizerEmail: "lisa.wang@sliit.lk",
    phoneNumbers: ["+94 11 567 8901"],
    societyName: "Career Guidance Unit",
    budget: 50000,
    tags: ["career", "professional", "development", "networking", "skills"],
    sponsorshipEnabled: false
  },
  {
    title: "Photography Exhibition: Campus Life",
    description: "Annual photography showcase capturing the essence of campus life through student lenses. Features portraits, landscapes, and documentary photography from the past academic year.",
    category: "Cultural",
    eventType: "Physical",
    faculty: "Architecture",
    department: "Visual Arts",
    venue: "Art Gallery, SLIIT",
    date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000), // 24 days from now
    endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000), // 27 days from now (3 days later)
    capacity: 150,
    organizerName: "Ms. Anjali Silva",
    organizerEmail: "anjali.silva@sliit.lk",
    phoneNumbers: ["+94 76 345 6789"],
    societyName: "Photography Club",
    budget: 80000,
    tags: ["photography", "exhibition", "art", "campus life", "visual"],
    sponsorshipEnabled: false
  },
  {
    title: "Sports Festival 2024",
    description: "Week-long sports festival featuring cricket, football, basketball, volleyball tournaments, and athletic competitions. Open to all students and faculty members.",
    category: "Sports",
    eventType: "Physical",
    faculty: "Hospitality",
    department: "Sports Management",
    venue: "Sports Complex, SLIIT",
    date: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000), // 37 days from now
    endDate: new Date(Date.now() + 43 * 24 * 60 * 60 * 1000), // 43 days from now (6 days later)
    capacity: 2000,
    organizerName: "Mr. Kumar Sangakkara",
    organizerEmail: "kumar.sangakkara@sliit.lk",
    phoneNumbers: ["+94 11 678 9012", "+94 77 234 5678"],
    societyName: "Sports Council",
    budget: 500000,
    tags: ["sports", "festival", "cricket", "football", "basketball", "tournament"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 150000,
        benefits: "Premium sponsorship branding, VIP seating, team sponsorship opportunities"
      },
      {
        tierName: "Silver",
        price: 75000,
        benefits: "Standard sponsorship branding, preferred seating"
      },
      {
        tierName: "Bronze",
        price: 25000,
        benefits: "Basic sponsorship branding, general admission"
      }
    ]
  },
  {
    title: "Web Development Bootcamp",
    description: "Intensive 5-day bootcamp covering modern web development technologies including React, Node.js, and cloud deployment. Participants will build real projects from scratch.",
    category: "Workshop",
    eventType: "Physical",
    faculty: "Computing",
    department: "Web Technologies",
    venue: "Computer Lab 3, SLIIT",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    endDate: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000), // 34 days from now (4 days later)
    capacity: 50,
    organizerName: "Ms. Rashmi Perera",
    organizerEmail: "rashmi.perera@sliit.lk",
    phoneNumbers: ["+94 11 789 0123"],
    societyName: "Web Dev Club",
    budget: 100000,
    tags: ["web development", "bootcamp", "React", "Node.js", "coding"],
    sponsorshipEnabled: false
  },
  {
    title: "Music & Arts Festival",
    description: "Three-day celebration of music and arts featuring student bands, solo artists, dance performances, and art installations. Food stalls and craft markets available.",
    category: "Cultural",
    eventType: "Physical",
    faculty: "Other",
    department: "Performing Arts",
    venue: "Amphitheatre, SLIIT",
    date: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000), // 47 days from now
    endDate: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000), // 49 days from now (2 days later)
    capacity: 1200,
    organizerName: "Mr. David Bandara",
    organizerEmail: "david.bandara@sliit.lk",
    phoneNumbers: ["+94 77 890 1234"],
    societyName: "Music Society",
    budget: 250000,
    tags: ["music", "arts", "festival", "performance", "cultural"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 80000,
        benefits: "Backstage passes, VIP seating, artist meet & greet"
      },
      {
        tierName: "Silver",
        price: 40000,
        benefits: "Preferred seating, festival merchandise"
      }
    ]
  },
  {
    title: "Data Science Symposium",
    description: "Academic symposium featuring research presentations on data science applications, big data analytics, and machine learning algorithms. Keynote by industry data scientists.",
    category: "Conference",
    eventType: "Hybrid",
    faculty: "Computing",
    department: "Data Science",
    venue: "Lecture Theatre A + Virtual",
    date: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000), // 52 days from now
    endDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 52 days + 8 hours
    capacity: 400,
    organizerName: "Dr. Sanjay Rajapaksha",
    organizerEmail: "sanjay.rajapaksha@sliit.lk",
    phoneNumbers: ["+94 11 234 5678"],
    societyName: "Data Science Society",
    budget: 300000,
    tags: ["data science", "symposium", "research", "analytics", "machine learning"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 120000,
        benefits: "Full symposium access, research proceedings, networking dinner"
      }
    ]
  },
  {
    title: "Entrepreneurship Pitch Competition",
    description: "Startup pitch competition where entrepreneurs present their business ideas to investors and judges. Includes mentoring sessions and prize money for winning pitches.",
    category: "Competition",
    eventType: "Physical",
    faculty: "Business",
    department: "Entrepreneurship",
    venue: "Business Incubator Center",
    date: new Date(Date.now() + 57 * 24 * 60 * 60 * 1000), // 57 days from now
    endDate: new Date(Date.now() + 57 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 57 days + 9 hours
    capacity: 250,
    organizerName: "Dr. Amanda Silva",
    organizerEmail: "amanda.silva@sliit.lk",
    phoneNumbers: ["+94 76 456 7890"],
    societyName: "Entrepreneurship Club",
    budget: 200000,
    tags: ["entrepreneurship", "pitch", "competition", "startup", "investment"],
    sponsorshipEnabled: false
  },
  {
    title: "Gaming Tournament 2024",
    description: "Annual gaming tournament featuring popular esports titles including Valorant, League of Legends, and FIFA. Open to all gaming enthusiasts with cash prizes.",
    category: "Competition",
    eventType: "Physical",
    faculty: "Computing",
    department: "Gaming",
    venue: "Gaming Arena, SLIIT",
    date: new Date(Date.now() + 64 * 24 * 60 * 60 * 1000), // 64 days from now
    endDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000), // 65 days from now (1 day later)
    capacity: 300,
    organizerName: "Mr. Tharindu Jayasinghe",
    organizerEmail: "tharindu.jayasinghe@sliit.lk",
    phoneNumbers: ["+94 77 123 4567"],
    societyName: "Gaming Society",
    budget: 150000,
    tags: ["gaming", "esports", "tournament", "Valorant", "FIFA"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 60000,
        benefits: "Team sponsorship, branding, VIP seating"
      },
      {
        tierName: "Silver",
        price: 30000,
        benefits: "Branding, preferred seating"
      }
    ]
  },
  {
    title: "Environmental Awareness Campaign",
    description: "Week-long environmental awareness campaign with tree planting, recycling drives, and sustainability workshops. Includes guest speakers from environmental organizations.",
    category: "Other",
    eventType: "Physical",
    faculty: "Science",
    department: "Environmental Science",
    venue: "Campus Grounds + Various Locations",
    date: new Date(Date.now() + 68 * 24 * 60 * 60 * 1000), // 68 days from now
    endDate: new Date(Date.now() + 74 * 24 * 60 * 60 * 1000), // 74 days from now (6 days later)
    capacity: 500,
    organizerName: "Ms. Nimali Perera",
    organizerEmail: "nimali.perera@sliit.lk",
    phoneNumbers: ["+94 11 345 6789"],
    societyName: "Environmental Club",
    budget: 100000,
    tags: ["environment", "sustainability", "green", "awareness", "campaign"],
    sponsorshipEnabled: false
  },
  {
    title: "Robotics Workshop",
    description: "Hands-on robotics workshop where participants learn to build and program autonomous robots. Includes all materials and take-home robot kit.",
    category: "Workshop",
    eventType: "Physical",
    faculty: "Engineering",
    department: "Robotics",
    venue: "Engineering Lab 2, SLIIT",
    date: new Date(Date.now() + 73 * 24 * 60 * 60 * 1000), // 73 days from now
    endDate: new Date(Date.now() + 73 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 73 days + 8 hours
    capacity: 40,
    organizerName: "Dr. Kamal Perera",
    organizerEmail: "kamal.perera@sliit.lk",
    phoneNumbers: ["+94 77 234 5678"],
    societyName: "Robotics Club",
    budget: 180000,
    tags: ["robotics", "workshop", "engineering", "automation", "programming"],
    sponsorshipEnabled: false
  },
  {
    title: "Film Festival 2024",
    description: "Annual film festival showcasing student short films, documentaries, and animations. Includes screenings, director Q&A sessions, and awards ceremony.",
    category: "Cultural",
    eventType: "Physical",
    faculty: "Other",
    department: "Media Studies",
    venue: "Cinema Hall, SLIIT",
    date: new Date(Date.now() + 78 * 24 * 60 * 60 * 1000), // 78 days from now
    endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000), // 80 days from now (2 days later)
    capacity: 300,
    organizerName: "Ms. Isuri Fernando",
    organizerEmail: "isuri.fernando@sliit.lk",
    phoneNumbers: ["+94 11 678 9012"],
    societyName: "Film Society",
    budget: 200000,
    tags: ["film", "festival", "cinema", "animation", "documentary"],
    sponsorshipEnabled: true,
    sponsorshipTiers: [
      {
        tierName: "Gold",
        price: 90000,
        benefits: "All-access pass, VIP screenings, director meet & greet"
      },
      {
        tierName: "Silver",
        price: 45000,
        benefits: "Festival pass, select screenings"
      }
    ]
  },
  {
    title: "Health & Wellness Fair",
    description: "Comprehensive health fair featuring medical check-ups, fitness demonstrations, nutrition counseling, mental health workshops, and wellness product exhibitions.",
    category: "Other",
    eventType: "Physical",
    faculty: "Other",
    department: "Public Health",
    venue: "Sports Complex Hall, SLIIT",
    date: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000), // 83 days from now
    endDate: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 83 days + 8 hours
    capacity: 600,
    organizerName: "Dr. Ruwan Perera",
    organizerEmail: "ruwan.perera@sliit.lk",
    phoneNumbers: ["+94 11 789 0123"],
    societyName: "Health Club",
    budget: 120000,
    tags: ["health", "wellness", "fitness", "medical", "nutrition"],
    sponsorshipEnabled: false
  }
];

async function seedSampleEvents() {
  try {
    // Connect to MongoDB using same URI as main app
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas...');

    // Clear existing events
    await Event.deleteMany({});
    console.log('✅ Cleared existing events from database');

    // Insert sample events
    const insertedEvents = await Event.insertMany(sampleEvents);
    
    console.log(`✅ Successfully inserted ${insertedEvents.length} sample events into database`);
    
    // Log event titles for verification
    console.log('\n📋 Inserted Events:');
    insertedEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.category} - ${event.eventType})`);
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedSampleEvents();
