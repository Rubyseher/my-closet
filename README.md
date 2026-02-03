# 👗 Attiro — Personalized Color Recommendation Engine

**Solving the _“What should I wear?”_ bug with React, Redux, and TypeScript.**

Most people see a color mismatch; I saw a **state management challenge**.  
**Attiro** is a web application that bridges aesthetic design with technical logic by generating **personalized outfit color palettes** from user-uploaded images and linking them directly to shoppable products.

---

## 🚀 Live Demo

🔗 **[Check out the Live App](https://attiro-frontend.onrender.com)**  

---

## ✨ Key Features

### 🎨 Real-time Color Analysis
Upload an image and receive a dynamically generated color palette tailored to the user’s profile.

### 🛍️ “Look to Shop” Flow
Recommended color palettes are mapped to **real-time Myntra product links**, enabling a seamless transition from inspiration to purchase.

### 🧾 Outfit History
A persistent log of previously generated recommendations and user preferences for easy revisit.

### 📱 Responsive UI
Mobile-first, responsive design optimized for the morning rush.

---

## 🛠️ Technical Highlights

### 🛡️ Type Safety with TypeScript
The entire codebase is written in **TypeScript** to ensure scalability and predictability.

- Strict interfaces for user preferences and color data
- Reduced runtime errors
- Improved developer experience and maintainability

---

### 🔌 State Management with Redux
Handling outfit history and global user preferences required a robust state solution. **Redux / Redux Toolkit** is used to:

- Maintain a **single source of truth** for the user’s *Color Profile*
- Manage asynchronous API states during image processing
- Ensure consistency across multiple views of the application

---

### 🎨 Dynamic UI & API Integration
- Custom logic to map extracted **HEX color codes** to outfit categories
- Integrated external shopping links to convert static recommendations into actionable results

---

## 🧱 Tech Stack

| Category            | Technologies                          |
|---------------------|---------------------------------------|
| Frontend            | React                                 |
| State Management    | Redux, Redux Toolkit                  |
| Language            | TypeScript                            |
| Styling             | CSS3, Tailwind CSS                   |

---

## 🏗️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/attiro.git
