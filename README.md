# smartDebugAI – AI-Powered Code & File Debugging Platform

## Overview

smartDebugAI is an intelligent debugging system that leverages **Google Gemini AI** to automatically analyze, detect, and correct errors in source code. Users can either paste code directly into an advanced editor or upload source files for automated debugging. The platform provides clear error explanations, best-practice suggestions, and optimized corrected code.

The system is built using **Next.js, MySQL, Prisma ORM, and Google Gemini**, following a scalable and modular architecture suitable for real-world applications.

---

## Key Features

- AI-based automatic code debugging using **Gemini LLM**
- Supports multiple programming languages
- Monaco-based advanced code editor
- File upload support for debugging source files
- Detailed error explanations and best practice suggestions
- Generates corrected and optimized code
- Stores debugging history in **MySQL**
- Scalable service-based backend architecture
- Clean and modern UI using **Next.js + Tailwind CSS**
- REST API-based communication

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js  |
| UI Styling | Tailwind CSS |
| Code Editor | Monaco Editor |
| Backend | Next.js API Routes |
| AI Model | Google Gemini (gemini-1.5-pro) |
| Database | MySQL |
| ORM | Prisma |

---

## System Architecture

smartDebugAI follows a layered architecture:

**Frontend (Client Layer)**
- Next.js UI
- Code editor component
- File upload module
- Debug results visualization

**Backend (Application Layer)**
- REST APIs in Next.js
- Validation service
- Debugging service
- AI integration service

**AI Layer**
- Google Gemini for code analysis

**Data Layer**
- MySQL database using Prisma ORM
- Stores debug jobs, results, and uploaded files

---


