
import { ClubEvent, Task, TaskStatus, User, UserRole, TeamMember, Photo, ClubReport } from "./types";

export const MOCK_USERS: User[] = [
  { 
    id: 'admin_vyas', 
    name: 'Vyas Admin', 
    email: 'vyas.sk17@gmail.com', 
    role: UserRole.ADMIN, 
    avatar: 'https://placehold.co/150/000000/FFFFFF/png?text=Admin' 
  },
];

export const MOCK_EVENTS: ClubEvent[] = [];

export const MOCK_TASKS: Task[] = [];

export const MOCK_MENTORS: TeamMember[] = [
  {
    id: 'ment1',
    name: 'Dr. L. Sherly Annabel',
    role: 'Head Of the Department',
    bio: 'PhD in Machine Learning with over 10 years of experience in AI research. Leading the department with a vision for innovation and academic excellence.',
    imageUrl: 'https://image2url.com/images/1764601251827-e397793a-15f6-4604-b670-5575bc8d390a.jpg',
    year: 'Department Head',
    skills: ['Machine Learning', 'AI Research', 'Academic Leadership', 'Deep Learning']
  },
  {
    id: 'ment2',
    name: 'Mrs. Arunmozhi B',
    role: 'Faculty Advisor',
    bio: 'Specialist in Machine Learning and AI research. Dedicated to mentoring students and bridging the gap between theory and application.',
    imageUrl: 'https://placehold.co/150/000000/FFFFFF/png?text=Faculty',
    year: 'Faculty Advisor',
    skills: ['Machine Learning', 'Research', 'Student Mentoring', 'AI Development']
  },
  {
    id: 'ment3',
    name: 'Mr. Eneeyan Nanmaran',
    role: 'Industrial Expert',
    bio: 'Corporate Trainer & Expert in BI/Data Analytics. Skilled in SQL, Python, ML, & Power BI. Successfully cracked 23+ offers in the analytics domain.',
    imageUrl: './Eneyaan.png', 
    year: 'Corporate Trainer',
    skills: ['SQL', 'Python', 'Power BI', 'Machine Learning', 'Career Coaching']
  }
];

export const MOCK_TEAM: TeamMember[] = [
  { 
    id: 'm1', 
    name: 'Syed Aejaz Ahmed A', 
    role: 'President', 
    bio: 'An aspiring Data Scientist with expertise in Machine Learning, Data Analytics, Deep Learning, and Generative Transformers. Passionate about solving complex challenges through data-driven solutions, I specialize in Explainable AI with Deep Learning, Generative AI, and building intelligent systems that bridge the gap between cutting-edge technology and real-world applications.', 
    imageUrl: './WhatsApp Image 2025-11-30 at 18.55.16_79a39fa1.jpg',
    year: 'Pre final year, ADS',
    skills: ['Leadership', 'Python', 'Machine Learning', 'Public Speaking', 'Retrieval-Augmented Generation (RAG)', 'AI Agents & LLM Evaluation', 'ETL & Data Pipelines', 'Machine Learning Interpretability', 'Explainable AI with CAM and CRP']
  },

  { 
    id: 'm7', 
    name: 'Kiruthik kumar J', 
    role: 'Founder', 
    bio: 'A motivated learner who enjoys exploring technology, teamwork, and innovative ideas. With a strong interest in data analytics, AI-driven solutions, and team management, I’m passionate about turning insights into impactful outcomes. Driven by curiosity and continuous learning, I strive to grow, collaborate, and contribute meaningfully through every project I take on.', 
    imageUrl: 'https://image2url.com/images/1764601375256-ffedabce-e9bd-4ce4-b585-c90aa194f09a.jpg',
    year: 'final year, ADS',
    skills: ['Data Analytics', 'Team Management', 'Problem-Solving', 'Programming', 'Communication', 'Leadership', 'Creativity', 'Critical Thinking']
  },
  { 
    id: 'm8', 
    name: 'NOWRIN BEGUM', 
    role: 'Technical Lead', 
    bio: 'an enthusiastic learner in Data Science and AI. I work on exploring datasets to uncover patterns, trends, and meaningful insights. My learning domain includes data analytics, machine learning, AI applications, and real-world problem solving.I am building strong skills in Python, R, SQL, Excel, KNIME, Power BI, Tableau, Gen AI, and data visualization.I look forward to collaborating, contributing, and growing within our Data Analytics Club.', 
    imageUrl: 'https://image2url.com/images/1764602216823-6172b215-5c1d-4a35-90ab-9a4a08f0c8f6.jpg',
    year: 'pre final year, ADS',
    skills: ['Python', 'R', 'SQL', 'Excel', 'KNIME', 'Power BI', 'Tableau', 'Gen AI', 'data visualization']
  },
  { 
    id: 'm9', 
    name: 'Dinesh kalangiyam p', 
    role: 'social media', 
    bio: 'passionate explorer who thrives on uncovering new tech, sparking creativity, and diving into ideas that matter. I’m driven to turn visions into tangible solutions through innovation and relentless learning. With curiosity and grit, I aim to evolve, create, and leave a mark through my journey', 
    imageUrl: './WhatsApp Image 2025-11-30 at 20.33.27_ca809943.jpg',
    year: 'second year, ADS',
    skills: ['Tech Exploration', 'Creative Problem-Solving', 'Collaborative Communication', 'Rapid Learning', 'Critical Thinking', 'Idea Prototyping']
  },
  { 
    id: 'm10', 
    name: 'Gavin N Benedict', 
    role: 'social media', 
    bio: 'I am an AI and Data Science student driven by a passion for data‑driven storytelling. Within the Data Science Club’s Social Media Department, I manage content creation, videography, photography, and editing. I enjoy blending creativity with analytics to craft narratives that inspire and engage our community. From documenting events to designing digital campaigns, I aim to make complex ideas accessible and visually appealing.', 
    imageUrl: 'https://image2url.com/images/1764602022945-94e2d729-d4d6-41d4-a6c7-9819f1743957.jpg',
    year: 'second year, ADS',
    skills: ['Data‑Driven Storytelling', 'Content Creation', 'Videography', 'Photography', 'Video Editing', 'Photo Editing', 'Social Media Management', 'Creative Branding', 'Analytics Integration', 'Community Engagement']
  },
  { 
    id: 'm11', 
    name: 'Bhavadarshini R G', 
    role: 'outreach coordinator', 
    bio: 'A confident learner who takes chances, leads when needed, and tackles challenges with clarity. I balance multiple priorities ,from technical work to teamwork — while staying focused on what’s right.With focus and determination, I balance technical thinking with people-first leadership,I strive to grow constantly, contribute meaningfully, and bring honesty and effort into everything I do.', 
    imageUrl: 'https://image2url.com/images/1764602188058-4094ea2b-4bbc-4055-82c1-63154b310543.jpg',
    year: 'pre final year, ADS',
    skills: ['Leadership', 'Communication', 'Problem-Solving', 'Adaptability', 'Creativity', 'Critical Thinking']
  },
  { 
    id: 'm12', 
    name: 'Srivardhni Palaniappan', 
    role: 'Script Writer', 
    bio: 'An AI & Data Science student who is passionate in Python, cybersecurity, and 3D modelling. Active campus host and podcast interviewer, engaged in tech communities, CTFs, and FOSS meetups. Driven by curiosity across gaming, literature, and creative digital design. With drive and adaptability, I continue to grow, contribute, and make an impact across every space I step into.', 
    imageUrl: 'https://image2url.com/images/1764601968880-9d30bd27-d73c-43de-974a-919f3229a976.jpg',
    year: 'second year, ADS',
    skills: ['Python Programming', 'Cybersecurity Fundamentals', '3D Modelling (Blender)', 'Creative Design (Logos, Visuals)', 'Communication & Hosting']
  },
  { 
    id: 'm13', 
    name: 'Krissal K V', 
    role: 'Dataset Manager', 
    bio: 'I’m deeply passionate about data science and analytics, driven by a strong desire to learn, innovate, and create solutions that deliver real value. I thrive on exploring new ideas, transforming insights into meaningful outcomes, and continuously elevating my skills to achieve excellence in everything I pursue.', 
    imageUrl: 'https://image2url.com/images/1764601668519-7bb72c21-1bc3-4cc4-b7f0-1328fc2c87bd.jpg',
    year: 'second year, ADS',
    skills: ['Programming', 'Problem-Solving', 'Communication', 'Creativity', 'Leadership', 'Critical Thinking']
  },
  { 
    id: 'm14', 
    name: 'Angel Sini S A', 
    role: 'Design Lead', 
    imageUrl: 'https://image2url.com/images/1764601208784-d228336e-fe41-4f20-aa35-e10a17ddb90b.jpg',
    bio: 'Dynamic and motivated learner who enjoys exploring technology, creativity, and meaningful ideas. Recognized for excellent communication skills, quick learning ability, and adaptability in fast-changing environments. Seeking opportunities in applying technical knowledge to impactful projects and gain hands-on experience in a collaborative and growth-oriented environment', 
    year: 'pre final year, ADS',
    skills: ['Programming', 'Problem-Solving', 'Communication', 'Team work', 'Creativity', 'Leadership']
  },
  { 
    id: 'm15', 
    name: 'Sri Sudharsanan K', 
    role: 'Dataset Manager', 
    bio: 'I’m a grounded, curious learner who enjoys exploring creative tech ideas and meaningful conversations while staying calm and sharp in how I think. I love taking on challenges in AI and data, balancing structured technical work with open-ended exploration to build practical, scalable solutions that matter. As a quick learner and collaborative teammate, I focus on understanding things deeply and creating projects with real purpose.', 
    imageUrl: 'https://image2url.com/images/1764601555812-fad66720-46b0-4a6e-ac2d-f0cfa8fbdce0.jpg',
    year: 'second year, ADS',
    skills: ['AI & NLP', 'Data Analysis', 'Python', 'Problem Solving', 'Creativity & Ideation', 'Team Collaboration', 'Fast Learning']
  },
  { 
    id: 'm16', 
    name: 'SHYLESH S', 
    role: 'Script Writer', 
    bio: 'An AI & Data Science enthusiast with a strong drive to explore emerging technology, creativity, and impactful innovation. Dedicated to transforming ideas into real solutions through continuous learning, hands-on building, and purposeful exploration. With curiosity, discipline, and determination, I aim to grow, innovate, and contribute meaningfully to the world through my work.', 
    imageUrl: 'https://image2url.com/images/1764600769057-f5f0ded2-e469-43eb-a9c2-8310783902d2.jpg',
    year: 'second year, ADS',
    skills: ['Artificial Intelligence & Machine Learning', 'Programming (Python, Java, etc.)', 'Data Science & Automation', 'UI/UX Fundamentals', 'Problem-Solving & Critical Thinking', 'Leadership', 'Communication', 'Creativity']
  },
  { 
    id: 'm17', 
    name: 'Vyas S', 
    role: 'Event Coordinator', 
    bio: 'an AI/ML student, React Developer, Backend Developer, and SLM Model Developer with a strong passion for building intelligent, scalable solutions. My hands‑on experience includes developing innovative AI projects such projects as Nova AI and Aerorover, while also architecting full‑stack applications that combine dynamic front‑end experiences with robust backend systems. Beyond technical development, I thrive as a community leader in CodeHackPirates, where I engage peers, organize campus activities, and promote AI adoption. My work spans building interactive AI assistants with Hugging Face, Gradio, and Python, designing responsive interfaces with React, and implementing backend services that ensure reliability and performance. Driven by curiosity and collaboration, I aim to bridge creativity with engineering—developing language models, applications, and community initiatives that inspire innovation and make a lasting impact.', 
    imageUrl: 'https://image2url.com/images/1764602138898-55d117ef-deb9-486c-96fa-6c377d90d5df.jpg',
    year: 'second year ADS',
    skills: ['AI/ML Development', 'SLM (Small Language Model) Development', 'React Development', 'Backend Development', 'Full‑Stack Application Design', 'Interactive AI Assistants (Hugging Face, Gradio, Python)', 'Community Leadership']
  },
  { 
    id: 'm18', 
    name: 'Marcben James Samuel S', 
    role: 'Vice President', 
    bio: 'A driven learner who enjoys exploring technology, building ideas, and creating meaningful projects.\nI’m passionate about turning concepts into practical solutions through curiosity and consistent growth.\nWith focus and creativity, I aim to improve, innovate, and make a positive impact through my work.', 
    imageUrl: 'https://image2url.com/images/1764600491711-3ee3148f-9816-401b-9a86-bcb0c5c373a1.jpg',
    year: 'second year',
    skills: ['AI & Programming', 'Problem-Solving', 'Creativity', 'Quick Learning', 'Communication', 'Leadership']
  },
  { 
    id: 'm19', 
    name: 'Naveen Kumar A', 
    role: 'Co-Design Lead', 
    bio: 'Passionate about AI, Machine Learning, IoT, and Full Stack Development, I enjoy building practical and impactful tech solutions. I love exploring new technologies, solving real-world problems, and creating intelligent systems through hands-on projects.\nskills Full Stack Development • Design Thinking • Programming • Creativity • Data Science', 
    imageUrl: 'https://image2url.com/images/1764601150429-5afc9289-cbcb-469c-90e3-9381fe32884c.jpg',
    year: 'second year',
    skills: ['Full Stack Development', 'Design Thinking', 'Programming', 'Creativity', 'Data Science']
  },
];

export const MOCK_PHOTOS: Photo[] = [
  { id: 'p1', url: 'https://picsum.photos/id/1/600/400', caption: 'Coding late into the night', eventId: 'e3' },
  { id: 'p2', url: 'https://picsum.photos/id/201/600/800', caption: 'Winner presentation', eventId: 'e3' },
  { id: 'p3', url: 'https://picsum.photos/id/101/800/600', caption: 'Networking session', eventId: 'e4' },
  { id: 'p4', url: 'https://picsum.photos/id/2/600/400', caption: 'Workshop brainstorming', eventId: 'e2' },
  { id: 'p5', url: 'https://picsum.photos/id/3/600/800', caption: 'Keynote Speaker', eventId: 'e1' },
  { id: 'p6', url: 'https://picsum.photos/id/4/800/600', caption: 'Team lunch', eventId: 'e1' },
];

export const MOCK_REPORTS: ClubReport[] = [
  {
    id: 'r1',
    title: 'Annual Activity Report 2024',
    date: '2024-12-20',
    description: 'A comprehensive summary of all workshops, hackathons, and guest lectures conducted in 2024.',
    thumbnailUrl: 'https://picsum.photos/id/5/400/300',
    fileUrl: '#'
  },
  {
    id: 'r2',
    title: 'Hackathon Impact Assessment',
    date: '2023-11-25',
    description: 'Detailed metrics on participant engagement and project outcomes from the Visualization Hackathon.',
    thumbnailUrl: 'https://picsum.photos/id/6/400/300',
    fileUrl: '#'
  }
];

export const LOGO_URL = './Data analytics Club.png';
export const MASCOT_URL = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Owl.png';
    