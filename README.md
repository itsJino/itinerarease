# Pub Locator Map Application

This repository hosts my Advanced Web Mapping CA1 project, a web application designed for users interested in locating nearby pubs. The site combines geolocation with interactive map features to provide a seamless experience for finding pubs. Built with Django and Django Templates, the application leverages PostgreSQL with PostGIS for managing spatial data and is administered via PgAdmin 4. The map interface, powered by Leaflet.js and OpenStreetMap, includes clustering for efficient display of multiple pub locations. Users can search for pubs by name, view the distance to the nearest pub based on their location, and navigate to specific pubs by clicking on names. The entire project is containerized with Docker for easy deployment and hosted on AWS. Access the website here.


## Features

- **Map Display with Clustering**: Pubs are displayed on an interactive map using Leaflet.js with clustering to organize markers. This enhances user experience when dealing with a large number of locations.

- **Search for Pubs by Name**: A search box allows users to enter a pub name, which filters and focuses on the pub's location on the map if it exists. This makes it easier to locate specific pubs.

- **User Geolocation and Nearest Pub**: When users enable geolocation, their position is marked on the map, and the application finds the closest pub to their location, displaying its distance in kilometers. Users can click on the pub’s name in the distance message to zoom in on that pub’s location.

- **Layer Toggle for Map Views**: Users can switch between standard OpenStreetMap and satellite views for better map visualization.

### Pubs Page
![image](https://github.com/user-attachments/assets/dd6deb57-17d1-42d3-bd2d-bc15abd1dfd7)

### Pubs in Custering
![image](https://github.com/user-attachments/assets/3e83bc4e-8d89-462a-a066-8350d36bf205)

### Toggle View (Satellite View)
![image](https://github.com/user-attachments/assets/12df2686-75a4-485b-a7be-af2a0e42a992)

### Search Pub
![image](https://github.com/user-attachments/assets/a2fdfad6-e0a1-4d32-beb3-27eb863ac04f)

### Login Page
![image](https://github.com/user-attachments/assets/857124e6-34a7-4348-bb2e-0f3d9df498f6)

### Sing Up Page
![image](https://github.com/user-attachments/assets/01c010c5-9700-4702-a51a-deb64000de6b)



## How It Works

1. **Map Initialization**: The map initializes with a view of a specified region (defaulting to central Dublin) and loads pub data from the server to populate map markers.
   
2. **Loading Pub Data**: The pub data, including coordinates and names, is fetched from the server and used to add markers to the map. The application clusters these markers for optimized display.
   
3. **User Location and Distance Calculation**: On page load, the application attempts to retrieve the user's location via the browser's Geolocation API. When the location is retrieved, a custom marker is placed on the map to represent the user's position. Using the Haversine formula, the application calculates the distance from the user’s location to each pub, determining the nearest pub.

4. **Interactive Closest Pub Link**: The nearest pub’s name and distance appear in a message below the map. Clicking the pub name zooms the map to that pub’s location and opens its popup, providing additional details.

5. **Search Functionality**: Users can search for a pub by entering its name in the search box. The application finds and zooms in on matching results.

## Conclusion

The Pub Locator Map Application provides a user-friendly interface for locating nearby pubs with ease. By integrating advanced mapping techniques like geolocation, clustering, and search functionality, it enhances the experience of users looking to explore local pubs. The combination of Django, PostgreSQL with PostGIS, and Leaflet.js has proven effective in managing spatial data and delivering interactive, real-time information. Hosting the application on AWS with Docker makes it scalable and accessible to a broad audience.

## Future Implementations

To further enhance the application, several additional features are planned for future releases:

1. **User Accounts and Saved Favorites**: Allow users to create accounts, save favorite pubs, and access their favorite locations quickly.
   
2. **Review and Rating System**: Enable users to leave reviews and ratings for pubs. This would provide helpful insights to other users and increase user engagement.

3. **Improved Search Filters**: Implement additional search filters (e.g., by pub type, amenities, or rating) to refine search results and help users find pubs that best match their preferences.

4. **Route and Navigation Suggestions**: Integrate routing functionality to provide users with suggested routes from their current location to a chosen pub, enhancing the application's usability as a navigational tool.

5. **Real-time Updates on Pub Information**: Introduce real-time updates for information such as special events, promotions, and open/closed status to keep users informed about what's happening at each pub.

6. **Mobile App Integration**: Consider building a mobile application with the same functionality for more convenient, on-the-go access.

These enhancements will continue to improve the Pub Locator Map Application and provide users with a comprehensive and enjoyable pub-finding experience.

