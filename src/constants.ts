
import { ClubEvent, Task, TaskStatus, User, UserRole, TeamMember, Photo, ClubReport } from "./types";
import arunmozhiImg from './assets/images/Arunmozhi.jpg';
import collegeLogoImg from './assets/images/images.png';
import mascotImg from './assets/images/3d_mascot.png';
import departmentLogoImg from './assets/images/Data analytics Club.png';

export const COLLEGE_LOGO_URL = collegeLogoImg;
export const NEW_MASCOT_URL = 'https://img.freepik.com/premium-photo/3d-cartoon-owl-wearing-glasses-hoodie-white-background_1029473-1960.jpg';
export const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/I8x1vrpqdnHFfym2ilUMg0';


export const MOCK_USERS: User[] = [
    {
        id: 'admin_vyas',
        name: 'Vyas Admin',
        email: 'vyas.sk17@gmail.com',
        role: UserRole.ADMIN,
        avatar: 'https://placehold.co/150/000000/FFFFFF/png?text=Admin'
    },
];

export const MOCK_EVENTS: ClubEvent[] = [
    {
        id: 'e4',
        title: 'Query Quest',
        date: '2026-02-02',
        description: 'An Interactive Workshop on DBMS & SQL - An exciting quiz and workshop event designed for 1st and 2nd year students! Test your knowledge, sharpen your skills, and compete with peers in this engaging learning experience.',
        location: 'AV Hall',
        imageUrl: '/query_quest_banner.png',
        reportUrl: '/query_quest_report.pdf'
    },
    {
        id: 'e5',
        title: 'Impact-AI-Thon',
        date: '2026-02-23',
        description: 'IMPACT-AI-THON \'26 is a 24-hour national-level hackathon hosted by the Data Analytics Club. Innovate, collaborate, and compete to create impactful AI-powered solutions!',
        location: 'Hackathon Center',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        registrationLink: 'https://docs.google.com/forms/d/e/1FAIpQLSck7l4BxrEqXGfZzRx8fxryPb5f3v-sPgyz5Xfm6AyYnapHPg/viewform'
    },
    {
        id: 'e1',
        title: 'DataVIZ 2025',
        date: '2025-02-15',
        description: 'Annual inter-college data visualization competition featuring real-world data challenges, workshops, and networking opportunities with industry experts.',
        location: 'AV Hall',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        reportUrl: '/report_event_2.pdf'
    },
    {
        id: 'e2',
        title: 'DAC Inauguration Ceremony',
        date: '2025-01-20',
        description: 'Official inauguration of the Data Analytics Club with keynote speakers, vision presentation, and team introduction.',
        location: 'AV Hall',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        reportUrl: '/DATA_ANALYTICS_CLUB.pdf'
    },
    {
        id: 'e3',
        title: 'From Idea → Innovation: A Student-Led Guide to Patent Filing',
        date: '2024-12-10',
        description: 'An informative session on the patent filing process, intellectual property rights, and how students can protect and commercialize their innovations.',
        location: 'Hazer Hall',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'
    }
];

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
        name: 'Mrs. B. Arunmozhikalanchiam',
        role: 'Faculty Advisor',
        bio: "Mrs. B. Arunmozhikalanchiam is an Assistant Professor in the Department of Artificial Intelligence and Data Science at St. Joseph's College of Engineering, holding a M.E degree. Her teaching interests include Image Processing and Machine Learning. She previously served as a lecturer before her current faculty role and as a Senior Software Engineer in a reputed company for more than 6 years.",
        imageUrl: arunmozhiImg,
        year: 'Faculty Advisor',
        skills: ['Machine Learning', 'Research', 'Student Mentoring', 'AI Development']
    },
    {
        id: 'ment3',
        name: 'Mr. Eneeyan Nanmaran',
        role: 'Industrial Expert',
        bio: 'Corporate Trainer & Expert in BI/Data Analytics. Skilled in SQL, Python, ML, & Power BI. Successfully cracked 23+ offers in the analytics domain.',
        imageUrl: 'https://image2url.com/images/1764602983572-2437f12d-59cd-4cb4-9793-130fe47e8168.png',
        year: 'Corporate Trainer',
        skills: ['SQL', 'Python', 'Power BI', 'Machine Learning', 'Career Coaching']
    }
];

export const MOCK_TEAM: TeamMember[] = [
    {
        id: 'm7',
        name: 'Kiruthik kumar J',
        role: 'Founder',
        bio: 'A motivated learner who enjoys exploring technology, teamwork, and innovative ideas. With a strong interest in data analytics, AI-driven solutions, and team management, I’m passionate about turning insights into impactful outcomes. Driven by curiosity and continuous learning, I strive to grow, collaborate, and contribute meaningfully through every project I take on.',
        imageUrl: 'https://image2url.com/images/1764601375256-ffedabce-e9bd-4ce4-b585-c90aa194f09a.jpg',
        year: 'Final Year, ADS',
        skills: ['Data Analytics', 'Team Management', 'Problem-Solving', 'Programming', 'Communication', 'Leadership', 'Creativity', 'Critical Thinking']
    },
    {
        id: 'm1',
        name: 'Syed Aejaz Ahmed A',
        role: 'President',
        bio: 'An aspiring Data Scientist with expertise in Machine Learning, Data Analytics, Deep Learning, and Generative Transformers. Passionate about solving complex challenges through data-driven solutions, I specialize in Explainable AI with Deep Learning, Generative AI, and building intelligent systems that bridge the gap between cutting-edge technology and real-world applications.',
        imageUrl: 'https://image2url.com/images/1764602252167-552a0c5e-f2d1-4844-90a5-1fe2df21461f.jpg',
        year: 'Pre Final Year, ADS',
        skills: ['Leadership', 'Python', 'Machine Learning', 'Public Speaking', 'Retrieval-Augmented Generation (RAG)', 'AI Agents & LLM Evaluation', 'ETL & Data Pipelines', 'Machine Learning Interpretability', 'Explainable AI with CAM and CRP']
    },
    {
        id: 'm18',
        name: 'Marcben James Samuel S',
        role: 'Vice President',
        bio: 'A driven learner who enjoys exploring technology, building ideas, and creating meaningful projects.\nI’m passionate about turning concepts into practical solutions through curiosity and consistent growth.\nWith focus and creativity, I aim to improve, innovate, and make a positive impact through my work.',
        imageUrl: 'https://image2url.com/r2/default/images/1770282404790-2e546545-33ae-479d-a952-daba7d6f31a0.jpeg',
        year: 'Second Year',
        skills: ['AI & Programming', 'Problem-Solving', 'Creativity', 'Quick Learning', 'Communication', 'Leadership']
    },
    {
        id: 'm8',
        name: 'NOWRIN BEGUM',
        role: 'Technical Lead',
        bio: 'an enthusiastic learner in Data Science and AI. I work on exploring datasets to uncover patterns, trends, and meaningful insights. My learning domain includes data analytics, machine learning, AI applications, and real-world problem solving.I am building strong skills in Python, R, SQL, Excel, KNIME, Power BI, Tableau, Gen AI, and data visualization.I look forward to collaborating, contributing, and growing within our Data Analytics Club.',
        imageUrl: 'https://image2url.com/images/1764602216823-6172b215-5c1d-4a35-90ab-9a4a08f0c8f6.jpg',
        year: 'Pre Final Year, ADS',
        skills: ['Python', 'R', 'SQL', 'Excel', 'KNIME', 'Power BI', 'Tableau', 'Gen AI', 'data visualization']
    },
    {
        id: 'm20',
        name: 'Manoharesh S',
        role: 'Technical Co-Lead',
        bio: 'AI & DS undergraduate skilled in Python, data handling, and foundational machine learning. Interested in AI agents, LLMs, reinforcement learning, and automation workflows. Focused on building impactful projects that bridge theory with real-world industry needs.',
        imageUrl: 'https://image2url.com/images/1764603119665-b581cb28-cc6a-4678-8eb6-08feaedc5eb3.jpg',
        year: 'Second Year, ADS',
        skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Looker Studio', 'Streamlit', 'Gradio', 'NumPy', 'OS', 'Requests', 'BeautifulSoup', 'Scikit-learn']
    },
    {
        id: 'm14',
        name: 'Angel Sini S A',
        role: 'Design Lead',
        imageUrl: 'https://image2url.com/r2/default/images/1770282377134-dc448888-0d87-4818-8377-26182d4fd5b4.jpeg',
        bio: 'Dynamic and motivated learner who enjoys exploring technology, creativity, and meaningful ideas. Recognized for excellent communication skills, quick learning ability, and adaptability in fast-changing environments. Seeking opportunities in applying technical knowledge to impactful projects and gain hands-on experience in a collaborative and growth-oriented environment',
        year: 'Pre Final Year, ADS',
        skills: ['Programming', 'Problem-Solving', 'Communication', 'Team work', 'Creativity', 'Leadership']
    },
    {
        id: 'm19',
        name: 'Naveen Kumar A',
        role: 'Co-Design Lead',
        bio: 'Passionate about AI, Machine Learning, IoT, and Full Stack Development, I enjoy building practical and impactful tech solutions. I love exploring new technologies, solving real-world problems, and creating intelligent systems through hands-on projects.\nskills Full Stack Development • Design Thinking • Programming • Creativity • Data Science',
        imageUrl: 'https://image2url.com/r2/default/images/1770282097309-b5ea3d21-10de-4b7e-9892-e8965775a439.jpeg',
        year: 'Second Year',
        skills: ['Full Stack Development', 'Design Thinking', 'Programming', 'Creativity', 'Data Science']
    },
    {
        id: 'm17',
        name: 'Vyas S',
        role: 'Event Coordinator',
        bio: 'an AI/ML student, React Developer, Backend Developer, and SLM Model Developer with a strong passion for building intelligent, scalable solutions. My hands‑on experience includes developing innovative AI projects such projects as Nova AI and Aerorover, while also architecting full‑stack applications that combine dynamic front‑end experiences with robust backend systems. Beyond technical development, I thrive as a community leader in CodeHackPirates, where I engage peers, organize campus activities, and promote AI adoption. My work spans building interactive AI assistants with Hugging Face, Gradio, and Python, designing responsive interfaces with React, and implementing backend services that ensure reliability and performance. Driven by curiosity and collaboration, I aim to bridge creativity with engineering—developing language models, applications, and community initiatives that inspire innovation and make a lasting impact.',
        imageUrl: 'https://image2url.com/images/1764602138898-55d117ef-deb9-486c-96fa-6c377d90d5df.jpg',
        year: 'Second Year ADS',
        skills: ['AI/ML Development', 'SLM (Small Language Model) Development', 'React Development', 'Backend Development', 'Full‑Stack Application Design', 'Interactive AI Assistants (Hugging Face, Gradio, Python)', 'Community Leadership']
    },
    {
        id: 'm11',
        name: 'Bhavadarshini R G',
        role: 'Outreach Coordinator',
        bio: 'A confident learner who takes chances, leads when needed, and tackles challenges with clarity. I balance multiple priorities ,from technical work to teamwork — while staying focused on what’s right.With focus and determination, I balance technical thinking with people-first leadership,I strive to grow constantly, contribute meaningfully, and bring honesty and effort into everything I do.',
        imageUrl: 'https://image2url.com/images/1764602188058-4094ea2b-4bbc-4055-82c1-63154b310543.jpg',
        year: 'Pre Final Year, ADS',
        skills: ['Leadership', 'Communication', 'Problem-Solving', 'Adaptability', 'Creativity', 'Critical Thinking']
    },
    {
        id: 'm13',
        name: 'Krissal K V',
        role: 'Dataset Manager',
        bio: 'I’m deeply passionate about data science and analytics, driven by a strong desire to learn, innovate, and create solutions that deliver real value. I thrive on exploring new ideas, transforming insights into meaningful outcomes, and continuously elevating my skills to achieve excellence in everything I pursue.',
        imageUrl: 'https://image2url.com/r2/default/images/1770282137973-d442a757-8de3-4c94-a41f-8b25024a2363.jpeg',
        year: 'Second Year, ADS',
        skills: ['Programming', 'Problem-Solving', 'Communication', 'Creativity', 'Leadership', 'Critical Thinking']
    },
    {
        id: 'm15',
        name: 'Sri Sudharsanan K',
        role: 'Dataset Manager',
        bio: 'I’m a grounded, curious learner who enjoys exploring creative tech ideas and meaningful conversations while staying calm and sharp in how I think. I love taking on challenges in AI and data, balancing structured technical work with open-ended exploration to build practical, scalable solutions that matter. As a quick learner and collaborative teammate, I focus on understanding things deeply and creating projects with real purpose.',
        imageUrl: 'https://image2url.com/images/1764601555812-fad66720-46b0-4a6e-ac2d-f0cfa8fbdce0.jpg',
        year: 'Second Year, ADS',
        skills: ['AI & NLP', 'Data Analysis', 'Python', 'Problem Solving', 'Creativity & Ideation', 'Team Collaboration', 'Fast Learning']
    },
    {
        id: 'm9',
        name: 'Dinesh kalangiyam p',
        role: 'Social Media Lead',
        bio: 'passionate explorer who thrives on uncovering new tech, sparking creativity, and diving into ideas that matter. I’m driven to turn visions into tangible solutions through innovation and relentless learning. With curiosity and grit, I aim to evolve, create, and leave a mark through my journey',
        imageUrl: 'https://image2url.com/images/1764601702833-886e6edb-7a40-4f77-8c6f-5126263ab780.jpg',
        year: 'Second Year, ADS',
        skills: ['Tech Exploration', 'Creative Problem-Solving', 'Collaborative Communication', 'Rapid Learning', 'Critical Thinking', 'Idea Prototyping']
    },
    {
        id: 'm10',
        name: 'Gavin N Benedict',
        role: 'Social Media Lead',
        bio: 'I am an AI and Data Science student driven by a passion for data‑driven storytelling. Within the Data Science Club’s Social Media Department, I manage content creation, videography, photography, and editing. I enjoy blending creativity with analytics to craft narratives that inspire and engage our community. From documenting events to designing digital campaigns, I aim to make complex ideas accessible and visually appealing.',
        imageUrl: 'https://image2url.com/r2/default/images/1770282352971-2c4b3432-01b2-4e37-9c26-aaf808233594.jpeg',
        year: 'Second Year, ADS',
        skills: ['Data‑Driven Storytelling', 'Content Creation', 'Videography', 'Photography', 'Video Editing', 'Photo Editing', 'Social Media Management', 'Creative Branding', 'Analytics Integration', 'Community Engagement']
    },
    {
        id: 'm12',
        name: 'Srivardhni Palaniappan',
        role: 'Script Writer',
        bio: 'An AI & Data Science student who is passionate in Python, cybersecurity, and 3D modelling. Active campus host and podcast interviewer, engaged in tech communities, CTFs, and FOSS meetups. Driven by curiosity across gaming, literature, and creative digital design. With drive and adaptability, I continue to grow, contribute, and make an impact across every space I step into.',
        imageUrl: 'https://image2url.com/r2/default/images/1770282025605-0fa218e9-2740-47e5-99d1-b739e6119405.jpeg',
        year: 'Second Year, ADS',
        skills: ['Python Programming', 'Cybersecurity Fundamentals', '3D Modelling (Blender)', 'Creative Design (Logos, Visuals)', 'Communication & Hosting']
    },
    {
        id: 'm16',
        name: 'SHYLESH S',
        role: 'Script Writer',
        bio: 'An AI & Data Science enthusiast with a strong drive to explore emerging technology, creativity, and impactful innovation. Dedicated to transforming ideas into real solutions through continuous learning, hands-on building, and purposeful exploration. With curiosity, discipline, and determination, I aim to grow, innovate, and contribute meaningfully to the world through my work.',
        imageUrl: 'https://image2url.com/images/1764600769057-f5f0ded2-e469-43eb-a9c2-8310783902d2.jpg',
        year: 'Second Year, ADS',
        skills: ['Artificial Intelligence & Machine Learning', 'Programming (Python, Java, etc.)', 'Data Science & Automation', 'UI/UX Fundamentals', 'Problem-Solving & Critical Thinking', 'Leadership', 'Communication', 'Creativity']
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
        id: 'rep_1',
        title: 'DAC Inauguration Ceremony Report',
        date: '2025-01-20',
        description: 'Official report of the Data Analytics Club inauguration event, detailing the keynote sessions and vision launch.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        fileUrl: '/DATA_ANALYTICS_CLUB.pdf'
    },
    {
        id: 'rep_2',
        title: 'DataVIZ 2025 Report',
        date: '2025-02-15',
        description: 'Comprehensive report on the DataVIZ 2025 competition, including participant metrics and winning project summaries.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        fileUrl: '/report_event_2.pdf'
    },
    {
        id: 'rep_3',
        title: 'Idea → Innovation Workshop Report',
        date: '2024-12-10',
        description: 'Summary of the patent filing guide workshop and intellectual property rights session.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
        fileUrl: '#'
    },
    {
        id: 'rep_4',
        title: 'DAC General Report',
        date: '2026-01-15',
        description: 'A comprehensive general report concerning the activities and impact of the Data Analytics Club.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        fileUrl: '/dac_report.pdf'
    },
    {
        id: 'rep_5',
        title: 'Impact-AI-thon Initial Document',
        date: '2026-01-16',
        description: 'Official documentation for the Impact-AI-thon event, including guidelines, themes, and submission details.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        fileUrl: '/impact_aithon.pdf'
    },
    {
        id: 'rep_6',
        title: 'Data Analytics Club Report',
        date: '2026-01-16',
        description: 'Detailed report on the Data Analytics Club activities, achievements, and future plans.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        fileUrl: '/dac_club_report.pdf'
    },
    {
        id: 'rep_7',
        title: 'Query Quest Event Report',
        date: '2026-02-02',
        description: 'Report for the Query Quest: DBMS & SQL Workshop and Quiz Competition.',
        thumbnailUrl: '/query_quest_banner.png',
        fileUrl: '/query_quest_report.pdf'
    }
];

export const LOGO_URL = departmentLogoImg;
export const DEPT_LOGO_URL = '/department_logo.jpeg';
export const MASCOT_URL = NEW_MASCOT_URL;
