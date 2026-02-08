
# Data Analytics Club (DAC) Website

Welcome to the official repository for the Data Analytics Club website. This platform serves as the central hub for showcasing club activities, managing events, sharing resources, and connecting with members.

![DAC Website Preview](public/preview.png)

## 🌟 Features

### 1. **Dynamic Event Management**
*   **Create & Manage Events:** Admins can create, edit, and delete events directly from the dashboard.
*   **Registration Links:** Seamlessly integrate Google Forms or other registration links.
*   **Past & Upcoming:** Automatically categorizes events based on dates.
*   **Smart Fallbacks:** Uses robust fallback mechanisms to ensure data integrity even with database schema limitations.

### 2. **Resource & Report Hub**
*   **PDF Reports:** Upload and manage event reports and educational resources.
*   **Secure Storage:** Reports are stored securely and can be downloaded by members.
*   **Admin Controls:** Easy interface to remove outdated or incorrect files.

### 3. **Member Directory**
*   **Team Profiles:** Showcase core team members with detailed profiles, skills, and social links.
*   **Role-Based Access:** Differentiate between Admins, Core Members, and General Members.

### 4. **AI-Powered Insights (Gemini Integration)**
*   **Smart Analysis:** Utilizes Google's Gemini AI to analyze club activity and suggest improvements.
*   **Automated Summaries:** Generates insights based on event participation and task completion.

### 5. **Interactive Gallery**
*   **Event Photos:** A beautiful, responsive gallery to showcase memories.
*   **Lightbox View:** High-quality image viewing experience.

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), TypeScript
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **Backend / Database:** Supabase (PostgreSQL)
*   **AI Integration:** Google Gemini API
*   **Deployment:** Vercel / Netlify (Recommended)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn
*   A Supabase project
*   Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/dac-website.git
    cd dac-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Navigate to `http://localhost:3000` (or the port shown in your terminal).

## 🗄️ Database Schema (Supabase)

Ensure your Supabase project has the following tables:

*   **`events`**: Stores event details (`title`, `date`, `description`, `location`, `imageUrl`).
    *   *Note:* Registration links are automatically appended to the `description` field for compatibility.
*   **`reports`**: Stores uploaded PDF reports (`title`, `fileUrl`, `thumbnailUrl`).
*   **`members`**: Stores user profiles and roles.
*   **`gallery`**: Stores photo URLs and captions.

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Data Analytics Club Team**
