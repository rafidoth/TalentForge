<div align="center">
  <!-- You can replace this with your actual logo -->
  
  <h1 align="center">Talent Forge</h1>
  
  <p align="center">
    <strong>A next-generation platform for candidate profiling, dynamic CV generation, and recruitment management.</strong>
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#roles">Roles</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#deployment">Deployment</a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status" />
    <img src="https://img.shields.io/badge/docker-ready-blue.svg" alt="Docker" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  </p>
</div>

---

## 🌟 Overview

**Talent Forge** is a comprehensive recruitment and profiling platform designed to bridge the gap between candidates and recruiters. It features a robust attribute engine, dynamic CV generation tailored to specific positions, real-time collaboration, and an intuitive, table-driven user interface.

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 & React Router 8
- **UI Library:** Mantine & TailwindCSS
- **State Management:** Zustand & React Query
- **Editor:** TipTap (Markdown)
- **Language:** TypeScript
- **Build Tool:** Vite

### Backend
- **Framework:** ASP.NET Core (C#), EF Core, Redis 
- **Architecture:** Standard N-Tier (Controllers, Services, Repositories)

### Infrastructure
- **Containerization:** Docker & Docker Compose

## ✨ Key Features

### 🎨 Modern UI/UX
- **Table-First Design:** Clean and efficient table views for positions and CVs (intentionally avoiding clunky tile/gallery views).
- **Streamlined Actions:** Context menus, toolbars, and checkboxes replace repetitive per-row action buttons for a cleaner interface.
- **Global Search:** Full-text search accessible instantly from the top header on any page.
- **Theming & i18n:** Built-in Dark/Light mode support and bilingual UI (English + Secondary language). User preferences are automatically saved.

### 🛡️ Authentication & Authorization
- **Social Login:** Quick access via multiple OAuth providers (e.g., Google, Facebook).
- **Email/Password:** Classic form-based authentication with email confirmation.
- **Role-Based Access Control (RBAC):** Strict separation of concerns between non-authenticated users, Candidates, Recruiters, and Administrators.

### 🧩 Dynamic Attribute Engine (Library)
- **Customizable Attributes:** Recruiters manage a shared library of attributes (Strings, Markdown Text, Cloud Images, Dates, Booleans, Dropdowns).
- **Advanced Field Tuning:** Support for regex validators, numeric ranges, and text length limits.
- **Optimistic Locking:** Prevents data conflicts with built-in versioning and auto-save (every 5-10s) on profile pages.

### 📄 Smart CV Generation
- **Position-Tailored Resumes:** CVs are auto-generated combining candidate profiles, required position attributes, and relevant project tags.
- **In-Place Editing:** Candidates can edit missing attributes directly on the generated CV, automatically syncing with their master profile. Missing values are highlighted for easy completion.
- **Export Options:** Generate printable PDF documents featuring scannable QR codes linking back to the app, or export aggregated CVs to CSV/Excel for external analysis.

### 💬 Real-Time Collaboration
- **Live Discussions:** Real-time discussion tabs on every position.
- **Recruiter Feedback:** Recruiters can 'Like' standout CVs to easily track top candidates. Total like counts are visible in search results.

### 🏆 Gamification
- **Badges & Achievements:** Candidates earn downloadable SVG badges for milestones (e.g., "10 Projects", "25 Likes"), displayed directly on their profile.

## 👥 Roles & Permissions

| Role | Capabilities |
| :--- | :--- |
| **Guest** | Register, sign in, browse public positions and system statistics. |
| **Candidate** | Manage personal profile (Me, Info, Projects), generate/edit CVs for accessible positions, participate in discussions. |
| **Recruiter** | Create/manage positions, define access rules, manage the shared Attribute Library, view Candidate CVs (read-only), Like CVs, participate in discussions. |
| **Administrator** | Full system access. Can edit any profile/CV/position, manage users (block, unblock, change roles), and manage all data. |

## 📊 Dashboard & Analytics

The main dashboard provides a quick overview of the platform:
- **Latest Positions:** Recently created or updated roles.
- **Top Positions:** Top 5 positions by submitted CVs.
- **Tech Cloud:** Interactive tag cloud linking to relevant CVs or positions.
- **Live Statistics:** 24h metrics, total users, and CV counts.

## 🚀 Quick Start

Talent Forge is fully containerized using Docker, making local development and deployment a breeze.

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the App
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/TalentForge.git
cd TalentForge

# 2. Start the application using Docker Compose
docker compose up -d --build
```

The application will now be running and accessible via your local browser.

## 🔑 Example Credentials

Use these default credentials to test the different roles in the system:

| Role          | Email              | Password       |
|:--------------|:-------------------|:---------------|
| **Admin**     | `admin@tf.com`     | `root_1Admin`  |
| **Recruiter** | `rezia@gmail.com`  | `hello_1World` |
| **Candidate** | `rafiul@gmail.com` | `hello_1World` |


## 🏗️ Architecture & Deployment

The application is deployed using a robust, highly available cloud architecture:

### Frontend
- **Hosting:** [Vercel](https://vercel.com/)
- **Delivery:** Global Edge CDN provided by Vercel ensures fast, low-latency access to the React frontend application.

### Backend
- **API Management:** AWS API Gateway routing requests securely to the internal network.
- **Load Balancing:** AWS Network Load Balancer (NLB) for high-performance TCP routing.
- **Compute:** Amazon EC2 instances hosting the containerized .NET backend services.

---

