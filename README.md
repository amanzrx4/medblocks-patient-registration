# Medblocks Patient Registration System


### Loom video explaining the app: 
https://www.loom.com/share/3b0444e025c446d78de4585556a728b2?sid=f98d12a2-ddca-4189-86d0-769120f4fc38

### production link: 
https://medblocks-patient-registration.netlify.app

A modern web application for managing patient registrations and records

## 🛠️ Built With

- **Frontend Framework**: React + TypeScript
- **Build Tool**: Vite
- **Database**: Electric SQL (PGlite) - SQLite in the browser
- **UI Components**: Shadcn and Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight routing
- **Data Export**: xlsx for Excel exports
- **Query Editor**: monaco editor for sql query playground
- **Data Table**: tanstack table for rendering table results
- **Icons**: lucide-react
- **Image Capture**: react-webcam

## ✨ Features

- 📝 Patient registration with comprehensive form
- 📸 Photo capture/upload capability
- 🔍 Advanced patient search with SQL and simple query modes
- 📊 Detailed patient records view
- 📱 Responsive design for mobile and desktop
- 📤 Export patient data to Excel
- 🔒 Browser-based data storage
- 🎨 Modern, clean UI with dark mode support

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/amanzrx4/medblocks-patient-registration.git
cd medblocks-patient-registration
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 💻 Usage

### Patient Registration

1. Navigate to "Patient Registration" from the menu
2. Fill in the patient details including:
   - Basic information (name, sex, DOB)
   - Contact details (phone, email)
   - Address information
   - Medical history and reason for registration
3. Optionally add a patient/receipt photo
4. Submit the form to register the patient

### Patient Records

1. Go to "Patient Records" from the menu
2. Choose between:
   - **Simple Search**: Quick search by specific fields
   - **SQL Mode**: Advanced search using SQL queries
3. View patient details by clicking on any record
4. Export records to Excel using the export button

## 🔧 Development

### Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── utils/         # Utility functions
└── providers/     # react context providers

└── utils/         # all utils like     types, helper fn, constants

└── db/           # Database queries and setup
└── my-pglite-worker.js     # pglite worker

└── image-test     # a project i created to test image upload functionality with pglite, this dir is not included in the build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run clean-install` - Clean install deps

## 📝 Notes

- Data is stored locally in the browser using PGlite
- Photos are stored as binary data
- The application works offline after initial load
- All form validations are performed client-side
