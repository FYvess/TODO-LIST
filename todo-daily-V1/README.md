# Todo Daily V1 (Original)

This directory contains the original Version 1 of the Todo Daily application.

## Description

Todo Daily V1 is a dynamic web application for managing daily tasks. It is built with a Node.js backend using the Express framework and EJS for templating. This version represents the initial implementation of the project.

## Setup and Running

To run this application locally:

1.  **Navigate to the directory:**
    ```bash
    cd todo-daily-V1
    ```
2.  **Install dependencies:**
    Make sure you have Node.js and npm installed. Then run:
    ```bash
    npm install
    ```
3.  **Start the server:**
    The `package.json` likely contains a start script. Common commands include:
    ```bash
    npm start
    ```
    or
    ```bash
    node index.js
    ```
    Check the `scripts` section in `package.json` for the exact command.

4.  **Access the application:**
    Open your web browser and go to `http://localhost:PORT` (the port number will be specified in `index.js` or your environment configuration, commonly 3000 or 8000).

## Project Structure

- `index.js`: The main entry point for the Node.js application.
- `package.json`: Contains project metadata and dependencies.
- `public/`: Contains static assets.
    - `image/`: Image files (e.g., `image.png`).
    - `layout/`: CSS stylesheets (e.g., `styles.css`).
- `views/`: EJS templates for rendering dynamic HTML.
    - `agenda.ejs`: View for the agenda.
    - `index.ejs`: Main view (e.g., homepage).
    - `pabili.ejs`: Another specific view.
    - `partial/`: Reusable EJS partials (e.g., `header.ejs`, `footer.ejs`).
