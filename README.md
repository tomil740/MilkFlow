# MilkFlow - B2B Demand and Supply Management App

## 🚀 Project Overview
**MilkFlow** is a B2B relation management web app designed to automate and streamline the demand and supply process for milk products. The app connects customers and distributors, enabling efficient management and communication throughout the demand lifecycle.

This MVP provides a robust solution to handle core business needs with automated workflows, real-time demand tracking, and scalable features to ensure a smooth and reliable process.

### **Supported Platforms**  
📱 **Mobile** | 💻 **Desktop** | 🖥️ **Web**  

---

## 📱 Native Mobile App (KMP Version)

To improve mobile user experience, we developed a **native mobile version** using **Kotlin Multiplatform (KMP)**. This version runs on both **Android and iOS**, offering:

- A **smoother and more reliable UX**
- Support for **offline access** and **push notifications**
- Better performance in low-connectivity environments
- A presentable, mobile-first interface built for daily field use

👉 **Check it out:** [MilkFlow Native App Repository](https://github.com/tomil740/MilkFlowNative)

> Both apps share the same backend and core features, with the mobile version focused on enhanced usability in real-world delivery workflows.

---

## 🔗 [Live Demo (Test Data)](https://themilkflow.netlify.app/)  
> **Note:** explore all features using  
Email: `shvprslshly@mail.com`  
Password: `1234567`

---

## 📸 Project Preview
<img width="657" alt="Screenshot 2025-06-10 at 16 02 31" src="https://github.com/user-attachments/assets/5f6051c5-5b53-4b2b-a2a0-49704476261e" />



## 🔑 Features List

### 🛍️ **Product Marketplace**
- CRUD-style product management for customers and distributors.  
- Custom product presentation based on user type.

### 🔑 **Authentication & Authorization**
- Role-based access control (Customer/Distributor).  
- Custom feature access and data presentation per user type.

### 🛒 **Cart Management**
- Save and track selected products before demand submission.  
- Summarized cart view for demand review.

### 📊 **Demand Management**
- **Customers:**
  - Submit, view, and observe demand status in real-time.
- **Distributors:**
  - Manage and track all customer demands.
  - Filter and sort demands by status and other criteria.
  - Summarized product demand views for better decision-making.

### 📁 **Data Handling & Synchronization**
- Local caching for static product data to optimize app performance.
- Remote demand collection syncing in real time to reflect status updates.

### 📱 **Optimized UI/UX**
- Mobile-first design, scaling seamlessly to tablets and desktop devices.  
- Clear, user-friendly interfaces for effortless interaction across roles.

### ⚙️ **Process Automation Compatibility**
- Structured to integrate smoothly with existing factory operations, enabling streamlined and automated demand and supply processes.

### 🔍 **Edge Case & Process Handling**
- Thoughtfully crafted UX for every transaction and state, ensuring reliable and predictable user experiences.
- Comprehensive error handling and state management to address edge cases and maintain process reliability.

---

## 🔧 Technical Summary
- **Tech Stack:** React, TypeScript, Firebase, Recoil, React Router, MUI (Material 3).
- **Architecture:** MVVM with clean code principles adapted for React.
- **State Management:** Single source of truth using Recoil for reliable, scalable state handling.
- **Modular Structure:** Single responsibility-driven components for easy feature updates and backend migration.
- **Mobile-First Design:** Optimized for scalability across different devices, including tablets and desktops.
- **Integration Compatibility:** Designed to fit with existing factory workflows for full process automation.
