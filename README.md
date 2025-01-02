
# Pub Crawl Navigator

Pub Crawl Navigator is an interactive web application designed to help users plan and enjoy their pub crawls. It provides a map-based interface where users can search for pubs, add them to their route, and track their progress during the crawl. The app includes features like user authentication, search functionality, dynamic route creation, and a progress tracker.

## Features

### 1. **User Authentication**
- Login and signup forms with robust error handling.
- Displays the logged-in user's username and profile icon in the header.
- Logout functionality to securely end user sessions.

### 2. **Interactive Map**
- **Map View**: Displays pubs as markers on a map using Leaflet.js with clustering for better visualization.
- **User Location**: Automatically detects and displays the user's current location on the map.
- **Pub Search**: Allows users to search for pubs by name, and the map dynamically zooms to the matched pub.

### 3. **Pub Selection and Route Planning**
- Users can add pubs to their route by selecting them from the map.
- Selected pubs are displayed in a list with unique emoji icons.
- Clicking on a pub in the list centers the map on the pub location.
- Users can remove pubs from the route with a simple button click.

### 4. **Dynamic Routing**
- Routes are created dynamically based on selected pubs and the user's current location.
- Total route distance is calculated, and the user can track their progress.
- Progress bar updates in real time based on the user's location relative to the route.

### 5. **Clustered Markers**
- Pub markers are grouped into clusters for better map performance.
- Clusters expand to show individual markers when zoomed in.

### 6. **Responsive Design**
- Fully responsive UI with a clean and intuitive design.
- Header includes the app title centered, a logout button on the left, and the user profile on the right.

### 7. **Backend Integration**
- Fetches user details via `/user-info-api`.
- Fetches pub data from `/pubs-data`.
- Logout is handled via a POST request to `/logout/`.

## Technologies Used

### Frontend
- **React.js**: Used for building the user interface.
- **Leaflet.js**: For interactive map rendering.
- **React-Leaflet**: A React wrapper for Leaflet.
- **CSS**: For styling components with a modern and clean look.

### Backend
- **Django REST Framework (DRF)**: Used for authentication and serving user and pub data.

### Other Tools
- **Axios**: For handling HTTP requests.
- **Leaflet-Routing-Machine**: For routing functionality.
- **MarkerClusterGroup**: For clustering map markers.

## File Structure

### Key Files
- `src/components/PubsMap.js`: Main component for rendering the map and managing pub routes.
- `src/services/Axios.js`: Configured Axios instance for API communication.
- `src/styles/PubsMap.css`: Styling for the map and UI components.
- `backend/api.py`: Django API endpoints for user and pub data.

### APIs
1. **User Info API**:
   - Endpoint: `/user-info-api`
   - Returns the authenticated user's details (username, email, and ID).

2. **Pub Data API**:
   - Endpoint: `/pubs-data`
   - Returns a list of pubs with their names, locations, and properties.

3. **Logout API**:
   - Endpoint: `/logout/`
   - Handles user logout securely.

## Setup Instructions

### Prerequisites
- Node.js and npm installed.
- Python and Django environment set up for the backend.

### Frontend
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/pub-crawl-navigator.git
   cd pub-crawl-navigator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the Django development server:
   ```bash
   python manage.py runserver
   ```

### Environment Variables
- Configure API base URLs and authentication tokens as needed in the frontend (e.g., Axios instance) and backend settings.

## Future Enhancements
- Add support for saving and sharing pub crawl routes.
- Integrate user reviews and ratings for pubs.
- Implement a leaderboard to gamify the pub crawl experience.

## License
This project is open-source under the [MIT License](LICENSE).
