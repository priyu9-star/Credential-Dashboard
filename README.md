# 📜 CredentiaLink - Credential Lifecycle Dashboard

CredentiaLink is a **Next.js** application designed to simplify **credential lifecycle management**. It provides an intuitive **admin dashboard** for managing user credentials and a **user interface** for tracking credential statuses.  

This project is fully built with **Next.js**, **Node.js**, and **MongoDB**, ensuring scalability, performance, and maintainability.

---

## 🚀 Features

- 🔐 **Admin Dashboard**: Manage user credentials, monitor activities, and maintain records.  
- 👤 **User Portal**: Users can view and track the status of their assigned credentials.  
- 🌐 **Modern Frontend**: Built with Next.js for SEO optimization and fast rendering.  
- 📦 **MongoDB Integration**: Reliable database support for secure data management.  
- 🧩 **Modular Project Structure**: Easy-to-read codebase for developers.  
- ⚙️ **Environment Configurations**: Secure environment variable management with `.env.local`.  
- 📊 **Database Seeding**: Preloaded sample data for testing and quick setup.  

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js** | Frontend framework |
| **MongoDB** | Database |
| **Node.js** | Backend runtime |
| **npm** | Package manager |
| **TypeScript** | Strong typing support for maintainable code |

---

## 📂 Project Structure

```plaintext
CredentiaLink/
├── src/
│   ├── components/      # UI components
│   ├── lib/             # Database connection, utility functions, and seed script
│   ├── pages/           # Next.js pages
│   ├── styles/          # Styling files
│   └── ...              
├── public/              # Static assets (images, icons)
├── .env.local           # Environment variables
├── package.json         # Dependencies & scripts
└── README.md            # Project documentation

📋 Prerequisites
Before you start, ensure you have installed:

Node.js (18.x or later)
npm (Node Package Manager)
MongoDB
 (Local setup or MongoDB Atlas
)

⚡ Getting Started
Follow these steps to run the project locally:

1️⃣ Clone the Repository
git clone https://github.com/<your-username>/CredentiaLink.git
cd CredentiaLink

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables
Create a .env.local file in the root directory with your MongoDB connection string:
MONGODB_URI="your_mongodb_connection_string"
Replace your_mongodb_connection_string with your actual MongoDB URI.

4️⃣ Seed the Database
Load sample data for quick testing:
npm run db:seed

5️⃣ Start the Development Server
npm run dev

Your app will now run at:
👉 http://localhost:3000

🔑 Admin Credentials
To log in as an admin, use the following credentials:
Email: admin@example.com
Password: admin123

ChatGPT Thread Export
During the development of this project, ChatGPT was used as a reference and guide for understanding workflow logic, UI design, tech stack selection, and implementation strategies. The complete interaction thread with ChatGPT, including suggestions and explanations, has been exported and can be accessed here
.
This export provides insights into design decisions, role-based feature planning, and troubleshooting approaches used while building the Credential Lifecycle Dashboard.

