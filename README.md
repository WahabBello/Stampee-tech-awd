# Stampee Technical Assignement

## Overview

Welcome to the Contact Management System technical assessment! Your task is to build a full-stack contact management application with user authentication and support for both individual and professional contacts.

## Project Description

Build a contact management application where users can securely manage their personal and professional contacts. The system should handle two types of contacts: **Individual** (people) and **Professional** (companies), each with specific data requirements.

## Core Requirements

### 🔐 Authentication System

- **Login Page**: Email/password authentication
- **Registration Page**: Create new user accounts
- **Session Management**: Keep users logged in between sessions
- **Protected Routes**: Redirect unauthenticated users to login

### 📊 Dashboard

- **Contact Listing**: Display all user's contacts in a clean, organized view
- **Empty State**: Show prominent "Add Contact" button when no contacts exist
- **Contact Types**: Visually distinguish between Individual and Professional contacts
- **Search/Filter**: Allow users to search contacts by name or email

### 👥 Contact Management

#### Individual Contacts

- **First Name** (required)
- **Last Name** (required)
- **Email** (required, validated)
- **Contact Type**: "Individual"

#### Professional Contacts

- **Company Name** (required)
- **SIREN Number** (required, French business identifier - exactly 9 digits)
- **Email** (required, validated)
- **Contact Type**: "Professional"

### ⚙️ CRUD Operations

- **Create**: Add new contacts with comprehensive form validation
- **Read**: View and list contact details
- **Update**: Edit existing contact information
- **Delete**: Remove contacts

## Technical Requirements

### Frontend Stack

- **Framework**: Vue.js 3 with TypeScript
- **Routing**: Vue Router for navigation between pages
- **Form Validation**: Real-time client-side validation for all fields
- **UI/UX**: Clean, responsive design that works on desktop and mobile

### Backend Stack

- **Framework**: Node.js with any server of your choice
- **Authentication**: JWT tokens or session-based authentication
- **Validation**: Comprehensive server-side validation for all inputs (using Zod or Joi or anything else)
- **API Design**: RESTful endpoints with proper HTTP status codes

### Current setup

We have provided you with a quick start up for your project where you can execute `task dev` to launch the `frontend` and `backend` server. The current setup has `Vite` with `Vue3` and `typescript` for the `frontend` and `Nodejs` with `Fastify` in the `backend`. Feel free to edit as much as you'd like. Don't feel obliged to stick to this stack.

### Database

- **Options**: PostgreSQL, MongoDB, or SQLite or any other Database of your choice
- **Data Isolation**: Each user can only access their own contacts

### User Registration

- **Email**: Required, valid email format, globally unique
- **Password**: Required, minimum 6 characters

## User Interface Requirements

### 🔑 Login/Register Pages

- Clean, modern form design with proper validation messages
- Easy toggle between login and registration modes
- Loading states during authentication requests
- Error handling for invalid credentials

### 📝 Contact Forms

- Contact type selector (radio buttons or dropdown)
- Dynamic form fields that change based on selected contact type
- Real-time validation feedback with clear error messages
- Save and Cancel buttons with proper loading states

### 📑 Contact List

- Sortable columns (name, email, type, date added)
- Edit and Delete actions for each contact
- Search functionality across all contact fields
- Responsive design that works well on mobile devices
- Pagination for large contact lists

You can use any styling language that you are comfortable with or any library with pre-built components

## Security Requirements

### 🛡️ Authorization

- Users can only access their own contacts
- Proper middleware for route protection
- Secure logout functionality that invalidates sessions

## Bonus Features

_Implement these if you finish the core requirements and have extra time:_

- **Dockerize the application**: To run the app, we need to just launch `docker-compose up`
- **Tests**: Write unit and integration tests to make your app bulletproof
- **Import/Export**: CSV import/export functionality for contacts
- **Contact Groups**: Organize contacts into custom categories
- **Bulk Operations**: Select multiple contacts for bulk delete
- **Extended Contact Details**: Add phone numbers, addresses, notes

## 📋 Deliverables

Your submission should include:

### 1. Complete Source Code

- Frontend application with all required features
- Backend API with proper authentication and CRUD operations
- Database schema and any migration files

### 2. Documentation

- **Setup Instructions**: Clear steps to run the application locally
- **Design Decisions**: Document any assumptions or architectural choices you made
- **Technologies Used**: List all libraries and frameworks with brief justification

## ⏱️ Time Expectation

This assessment is designed to take approximately **5-8 hours** to complete. Focus on implementing all core functionality first, then add bonus features if time permits. The goal of this assignment is to analyze your architectural decision making and how much features can you achieve during this time.

## 🤝 Questions?

If you have any questions about the requirements or need clarification on any aspect of the assessment, please don't hesitate to reach out.

**Good luck, and we look forward to reviewing your solution!**
