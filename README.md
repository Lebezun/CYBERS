# CYBERS
# 🛡️ Cybersecurity Practical Works (4th Year)

Welcome to the cybersecurity practical assignments repository. This project contains implementations, scripts, and demonstrations created as part of the 4th-year university cybersecurity curriculum.

---

## 📌 Project Overview

This repository hosts practical tasks focused on identity & access management, authentication protocols, secure coding, and system security analysis.

### Current Module: **OAuth 2.0 Identity Provider Integration**
A demonstration of implementing secure user authentication via **OAuth 2.0** using **Node.js**, **Express**, and the **GitHub API**.

#### Key Features:
* 🔐 **OAuth 2.0 Authorization Code Flow**: Redirecting users to GitHub and handling callback codes.
* 🛡️ **CSRF Protection**: Implementation of anti-CSRF measures using unique `state` parameter validation across sessions.
* 🔑 **Environment Variable Isolation**: Sensitive credentials (`CLIENT_ID`, `CLIENT_SECRET`) managed securely via `.env` files and excluded from version control.
* 👤 **User Profile Extraction**: Safe token exchange to fetch authenticated user metadata from GitHub's `/user` endpoint.

---

## 🚀 Getting Started

Follow these instructions to set up and run the OAuth 2.0 project locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (v16 or higher)
* [npm](https://www.npmjs.com/)
* A [GitHub Developer Account](https://github.com/settings/developers) to register an OAuth Application.

### 📥 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Lebezun/CYBERS.git](https://github.com/Lebezun/CYBERS.git)
   cd CYBERS/github-oauth-app
