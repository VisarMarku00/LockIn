# LockIn

LockIn is a modern, responsive task management application designed to help you organize your work into collections and track your To-Dos with ease.

## How it Works

LockIn allows you to create multiple **Collections**, each acting as a container for related tasks.
- **Collections**: You can give each collection a title and a description. They are displayed as distinct boxes on the main page.
- **To-Dos**: Within each collection, you can add individual tasks. Each To-Do supports:
    - **Titles**: Clear names for your tasks.
    - **Due Dates**: Set specific deadlines using an integrated date picker.
    - **Priorities**: Mark tasks as high priority with a simple toggle.
- **Persistence**: Your data is automatically saved to your browser's local storage. This means your collections and tasks will still be there even if you refresh the page or close your browser.
- **Interactive Interface**: Most elements like collection titles, descriptions, and task titles can be edited directly on the page.

## Tech Stack

LockIn is built using modern web technologies to ensure a fast and smooth user experience:

- **Frontend**: 
    - **Vanilla JavaScript (ES6+)**: For core logic and DOM manipulation.
    - **HTML5**: For structure, utilizing templates for dynamic rendering.
    - **CSS3**: For a responsive and modern design.
- **Build Tools**:
    - **Webpack 5**: Used for bundling modules, handling assets, and providing a development server.
- **Libraries**:
    - **[date-fns](https://date-fns.org/)**: For robust date manipulation and formatting.
    - **[uuid](https://github.com/uuidjs/uuid)**: For generating unique identifiers for collections and tasks.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server and view the app in your browser:
```bash
npm start
```

### Building for Production

To generate a production-ready build in the `dist` directory:
```bash
npm run build
```