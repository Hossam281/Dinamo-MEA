# React Posts Management Application (Dinamo MEA Task)

A modern React application that demonstrates CRUD operations using JSONPlaceholder API. The application allows users to view, create, update, and delete posts with a clean and responsive user interface.

## Features

- 📝 Create, Read, Update, and Delete posts
- 🔍 Search functionality to filter posts
- 📱 Responsive design
- ⚡ Real-time feedback with toast notifications
- 📄 Pagination for better data handling
- ✨ Clean and intuitive user interface
- 🎨 Styled with Tailwind CSS and Flowbite React components

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Flowbite React
- React Toastify
- JSONPlaceholder API

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd Dinamo-MEA
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Build for Production

To create a production build:

```bash
npm run build
```

The built files will be available in the `dist` directory.

## Project Structure

```
src/
  ├── App.tsx        # Main application component
  ├── main.tsx       # Application entry point
  ├── index.css      # Global styles
  └── vite-env.d.ts  # TypeScript declarations
```

## Assumptions and Design Decisions

1. **API Integration**
   - Used JSONPlaceholder API for demonstration purposes
   - Implemented mock POST/PUT/DELETE operations (JSONPlaceholder doesn't actually modify data)
   - Added loading states and error handling for API operations

2. **UI/UX Decisions**
   - Implemented pagination with 10 items per page for better performance
   - Added search functionality across both title and body fields
   - Used modals for create and edit operations
   - Included form validation for required fields
   - Added toast notifications for operation feedback

3. **State Management**
   - Used React's built-in useState and useEffect hooks for state management
   - Implemented useRef to prevent duplicate API calls

## Challenges Faced

1. **API Limitations**
   - JSONPlaceholder is a read-only API, so mutations are simulated
   - Implemented optimistic updates for better user experience
   - Edit will not work for newlyy added data 

2. **Form Validation**
   - Created custom validation logic for form inputs
   - Implemented error handling and display

3. **Responsive Design**
   - Ensured the table layout works well on different screen sizes
   - Implemented horizontal scrolling for table on mobile devices
   
4. **Responsive Design**
   - Ensured the table layout works well on different screen sizes
   - Implemented horizontal scrolling for table on mobile devices

## Time Spent

The project took approximately 6 hours

