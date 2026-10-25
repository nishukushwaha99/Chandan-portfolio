# 🌐 Chandan Kushwaha - Official Portfolio & Bio-Data

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?style=for-the-badge&logo=github)](https://nishukushwaha99.github.io/Chandan-portfolio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Status: Active](https://img.shields.io/badge/Status-Active%20%26%20Maintained-cyan?style=for-the-badge)]()

> A modern, futuristic personal portfolio and interactive bio-data web application designed for **Chandan Kushwaha**, BCA Scholar at **Shri Ram Group of College, Muzaffarnagar (Delhi NCR)** with an academic score of **8.36 CGPA**.

---

## 🚀 Live Website

🔗 **Visit the Live Portfolio:** **[https://nishukushwaha99.github.io/Chandan-portfolio/](https://nishukushwaha99.github.io/Chandan-portfolio/)**

---

## 🌟 Key Features & Highlights

- **🌌 Interactive Particle Canvas:** Real-time physics-based interactive background canvas rendered via HTML5 Canvas API that reacts to user cursor movements.
- **🎨 Dynamic Ambient Accent Switcher:** Real-time customizable accent glow themes (Cyan, Purple, Emerald, Amber) with instant CSS variable updates.
- **🔊 Web Audio API Sound Effects:** Realistic interactive synthesizer sounds and micro-feedback clicks for interactive navigation, togglable with mute control.
- **💻 Integrated Terminal Emulator:** Interactive developer terminal supporting custom commands (`help`, `about`, `education`, `skills`, `projects`, `contact`, `clear`, `theme`).
- **📄 Official Bio-Data & CV Modal:** Full biodata viewer including family background, academic qualifications, and technical competencies with **1-Click Print & Save PDF** support.
- **💼 Interactive Project Showcase:** Filterable project catalog with modal popups showcasing architecture, tech stack, and key deliverables.
- **⚡ High Performance & Responsive:** Built purely with Vanilla Web Technologies (0 heavyweight runtime frameworks), ensuring fast loading speeds, accessibility, and responsiveness across mobile, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Core Structure** | Semantic HTML5, ARIA Accessibility attributes |
| **Styling & Design** | Vanilla CSS3, Glassmorphism, CSS Custom Properties (Variables), Responsive Grid & Flexbox |
| **Interactivity** | Vanilla JavaScript (ES6+), Canvas API, Web Audio API, Intersection Observer API |
| **Typography** | Google Fonts (*JetBrains Mono*, *Plus Jakarta Sans*) |
| **Hosting & CI/CD** | GitHub Pages & GitHub Actions (`deploy.yml`) |

---

## 📂 Project Structure

```text
Chandan-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD pipeline for GitHub Pages
├── assets/
│   └── images/                 # Optimized images (portraits, gallery, project thumbnails)
│       ├── chandan.jpg
│       ├── chandan-portrait.jpg
│       ├── chandan-bridge.jpg
│       ├── project-ai.jpg
│       ├── project-cloud.jpg
│       └── project-fintech.jpg
├── .gitignore                  # Git ignore rules for node_modules, env, vscode, logs
├── .nojekyll                   # Bypasses Jekyll processing on GitHub Pages
├── index.html                  # Main portfolio website entry point
├── script.js                   # Interactive logic (Terminal, Audio, Canvas, Modals)
├── style.css                   # Complete design system & responsive styling
└── README.md                   # Project documentation
```

---

## 💻 Local Setup & Development

No complex build steps or dependencies required. You can run the project locally with any static web server:

### Option 1: VS Code Live Server
1. Clone the repository:
   ```bash
   git clone https://github.com/nishukushwaha99/Chandan-portfolio.git
   cd Chandan-portfolio
   ```
2. Open with VS Code:
   ```bash
   code .
   ```
3. Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Python HTTP Server
```bash
python -m http.server 5500
```
Then navigate to `http://localhost:5500` in your browser.

---

## ⚙️ GitHub Pages Deployment

This repository uses automated deployment via **GitHub Actions**:
1. Every push to the `main` branch triggers `.github/workflows/deploy.yml`.
2. The workflow builds and deploys the static files directly to GitHub Pages.
3. To enable GitHub Pages in your repository settings:
   - Go to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, choose **GitHub Actions** (or select **Deploy from a branch** -> `main` / root `/`).

---

## 👤 About the Author

- **Name:** Chandan Kushwaha
- **Degree:** Bachelor of Computer Applications (BCA)
- **Institution:** Shri Ram Group of College, Muzaffarnagar (Delhi NCR)
- **Hometown:** Dinara, Rohtas, Bihar, India
- **Contact:** `ckchandankumar272@gmail.com` | `+91 7061350981`
- **GitHub:** [@nishukushwaha99](https://github.com/nishukushwaha99)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
