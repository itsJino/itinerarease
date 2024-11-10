# Pub Locator Map Application

This is a web application that allows users to locate pubs on a map, search for pubs by name, and view their distance to the nearest pub based on their current location. It features interactive map functionality powered by Leaflet.js and uses clustering for efficient display of multiple locations. Users can also click on pub names to navigate to their locations on the map.

## Features

- **Map Display with Clustering**: Pubs are displayed on an interactive map using Leaflet.js with clustering to organize markers. This enhances user experience when dealing with a large number of locations.

- **Search for Pubs by Name**: A search box allows users to enter a pub name, which filters and focuses on the pub's location on the map if it exists. This makes it easier to locate specific pubs.

- **User Geolocation and Nearest Pub**: When users enable geolocation, their position is marked on the map, and the application finds the closest pub to their location, displaying its distance in kilometers. Users can click on the pub’s name in the distance message to zoom in on that pub’s location.

- **Layer Toggle for Map Views**: Users can switch between standard OpenStreetMap and satellite views for better map visualization.

## How It Works

1. **Map Initialization**: The map initializes with a view of a specified region (defaulting to central Dublin) and loads pub data from the server to populate map markers.
   
2. **Loading Pub Data**: The pub data, including coordinates and names, is fetched from the server and used to add markers to the map. The application clusters these markers for optimized display.
   
3. **User Location and Distance Calculation**: On page load, the application attempts to retrieve the user's location via the browser's Geolocation API. When the location is retrieved, a custom marker is placed on the map to represent the user's position. Using the Haversine formula, the application calculates the distance from the user’s location to each pub, determining the nearest pub.

4. **Interactive Closest Pub Link**: The nearest pub’s name and distance appear in a message below the map. Clicking the pub name zooms the map to that pub’s location and opens its popup, providing additional details.

5. **Search Functionality**: Users can search for a pub by entering its name in the search box. The application finds and zooms in on matching results.
