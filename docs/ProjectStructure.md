# Project Structure and Naming Convention

## Project Structure

```text
/src
|-- /api                    # API functions
|   |-- userApi.ts
|   |-- workflowApi.ts
|-- /assets                 # Static files like images and fonts
|   |-- /images
|   |   |-- logo.png
|   |   |-- banner.jpg
|   |-- /fonts
|   |   |-- Regular.ttf
|-- /components             # Reusable UI components
|   |-- /common             # Generic reusable UI components
|   |   |-- Button.tsx
|   |   |-- InputField.tsx
|   |-- /layout             # Layout-related components
|   |   |-- Header.tsx
|   |   |-- Footer.tsx
|   |-- /modals             # For modal-related components
|   |   |-- SideModal.tsx
|   |   |-- ConfirmationModal.tsx
|   |-- /tabs               # Components related to tab functionalities
|   |   |-- PopupTabView.tsx
|   |   |-- DetailedTabView.tsx
|-- /context                # React contexts for state management
|   |-- UserContext.tsx
|   |-- ThemeContext.tsx
|-- /hooks                  # Custom React hooks
|   |-- useAuth.ts
|   |-- useDialog.ts
|-- /routes                 # react routes
|   |-- index.ts
|   |-- portal.ts
|   |-- status.ts
|   |-- paths.ts            # route paths defined in system
|-- /pages                  # Route-specific components
|   |-- /HomePage
|   |   |-- index.tsx       # Main component for the HomePage
|   |   |-- /page-sections
|   |       |-- WorkflowTable.tsx  # Hero section of the HomePage
|-- /utils                  # Utility functions
|   |-- formatDate.ts
|   |-- calculateTotal.ts
|-- /types                  # TypeScript type definitions
|   |-- apiResponseTypes.ts
|   |-- workflowTypes.ts
|-- App.tsx                 # Root component
|-- main.tsx                # Entry point of the application
|-- vite-env.d.ts           # TypeScript definitions for Vite
|-- index.css               # Global styles
```

### general guide

- Folders: Use lowercase to avoid case sensitivity issues across different operating systems.
- Files:
  - React Components: Use PascalCase for files that define React components (e.g., UserProfile.tsx).
  - TypeScript Files: Use camelCase for other files (e.g., userApi.ts).
  - Page folder: immediately recognizable as a component as index file defined inside.

### components

- /common: Contains universally reusable UI components like Button.tsx and InputField.tsx.
- /layout: Includes components that are part of the website’s layout, such as Header.tsx and Footer.tsx.

### others

- Index Files: Use index.ts files within directories to re-export components, simplifying imports across the application.