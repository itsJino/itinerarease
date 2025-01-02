import * as L from 'leaflet';

// Extend the MarkerOptions interface to include custom properties
declare module 'leaflet' {
    interface MarkerOptions {
        pubName?: string; // Add the pubName property
    }
}
