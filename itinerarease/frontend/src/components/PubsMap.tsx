import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import '../styles/PubsMap.css';
import Axios from '../services/Axios';
import glassIconPng from '../assets/glass_15521972.png';


const pubIcon = L.icon({
    iconUrl: glassIconPng,
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Haversine formula to calculate the distance between two coordinates
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const toRad = (value: number) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

const PubsMap: React.FC = () => {
    // State variables to manage app state
    const [pubsData, setPubsData] = useState<any[]>([]); // List of all pubs
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null); // Current user location
    const [selectedPubs, setSelectedPubs] = useState<any[]>([]); // Pubs selected by the user for the route
    const [searchQuery, setSearchQuery] = useState<string>(''); // Search query for filtering pubs
    const [distanceCovered, setDistanceCovered] = useState(0); // Distance user has traveled along the route
    const [totalDistance, setTotalDistance] = useState(0); // Total distance of the route
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Whether the map has been initially centered
    const [user, setUser] = useState({ username: 'JohnDoe' }); // Example user object

    // References for the map and routing control
    const mapRef = useRef<L.Map | null>(null);
    const routingControlRef = useRef<L.Routing.Control | null>(null);

    // Default map center coordinates
    const defaultCenter: [number, number] = [53.3498, -6.2603];
    const navigate = useNavigate(); // Navigation hook for redirecting the user

    // Array of emojis for use in pub list
    const emojis = ['🍺', '🍻', '🍹', '🍸', '🍷', '🥂', '🍾', '🍶', '🍵', '🍶'];

    // Fetch pub data from the server
    const fetchPubsData = async () => {
        try {
            const response = await Axios.get('https://itinerarease.xyz/api/pubs-data'); // Fetch pub data from API
            setPubsData(response.data); // Save data to state
        } catch (error) {
            console.error('Error fetching pubs data:', error);
        }
    };

    // Fetch user info (e.g., username) from the server
    const fetchUserInfo = async () => {
        try {
            const response = await Axios.get('https://itinerarease.xyz/api/user-info-api');
            setUser(response.data); // Set user data to state
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    // Log the user out and redirect to the login page
    const handleLogout = async () => {
        try {
            await Axios.post("https://itinerarease.xyz/api/logout/");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Get the user's current location using geolocation API
    const updateUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            });
        }
    };

    // Add routing control to the map for the selected waypoints
    const addRoutingControl = (waypoints: [number, number][]) => {
        if (!mapRef.current) {
            console.error('Map reference is null');
            return;
        }

        if (routingControlRef.current) {
            mapRef.current.removeControl(routingControlRef.current); // Remove existing control
        }

        routingControlRef.current = L.Routing.control({
            waypoints: waypoints.map(([lat, lng]) => ({
                latLng: new L.LatLng(lat, lng),
            })),
            routeWhileDragging: true, // Allow route to be updated while dragging markers
            lineOptions: {
                styles: [{ color: '#6FA1EC', weight: 6 }], // Style for the route line
            } as any,
            createMarker: (i, waypoint) => {
                return L.marker(waypoint.latLng, {
                    icon: i === 0 ? userIcon : pubIcon, // User's marker is red, pubs are blue
                });
            },
            router: new L.Routing.OSRMv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1', // Routing API
                profile: 'foot', // Specify walking route
            }),
        }).addTo(mapRef.current);
    };

    // Search for pubs based on the query and zoom to the matching pub
    const handleSearch = (query: string) => {
        setSearchQuery(query);

        const matchingPub = pubsData.find((pub) =>
            pub.properties.name.toLowerCase().includes(query.toLowerCase())
        );

        if (matchingPub && mapRef.current) {
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.MarkerClusterGroup) {
                    layer.eachLayer((subLayer: L.Layer) => {
                        if (subLayer instanceof L.Marker) {
                            const popupContent = subLayer.getPopup()?.getContent();

                            if (typeof popupContent === 'string' && popupContent.includes(matchingPub.properties.name)) {
                                (layer as any).zoomToShowLayer(subLayer, () => {
                                    mapRef.current?.setView(subLayer.getLatLng(), Math.max(mapRef.current?.getZoom() || 13, 16));
                                    subLayer.openPopup();
                                });
                            }
                        }
                    });
                }
            });
        } else {
            console.error("No matching pub found");
        }
    };

    // Toggle selection of a pub for the route
    const togglePubSelection = (pub: any) => {
        setSelectedPubs((prevSelected) => {
            const isSelected = prevSelected.some(
                (selectedPub) =>
                    selectedPub.latitude === pub.latitude &&
                    selectedPub.longitude === pub.longitude
            );
            if (isSelected) {
                return prevSelected.filter(
                    (selectedPub) =>
                        selectedPub.latitude !== pub.latitude ||
                        selectedPub.longitude !== pub.longitude
                );
            } else {
                return [...prevSelected, pub];
            }
        });
    };

    // Remove a pub from the route
    const removePubFromRoute = (pub: any) => {
        setSelectedPubs((prevSelected) =>
            prevSelected.filter(
                (selectedPub) =>
                    selectedPub.latitude !== pub.latitude ||
                    selectedPub.longitude !== pub.longitude
            )
        );
    };

    // Create a route with the selected pubs
    const createRoute = () => {
        if (userLocation && selectedPubs.length > 0) {
            const waypoints: [number, number][] = [
                [userLocation.lat, userLocation.lng],
                ...selectedPubs.map((pub) => [pub.latitude, pub.longitude] as [number, number]),
            ];

            setDistanceCovered(0); // Reset progress
            calculateTotalDistance(waypoints); // Calculate total distance
            addRoutingControl(waypoints); // Add route to map
        }
    };

    // Calculate total distance for the route
    const calculateTotalDistance = (waypoints: [number, number][]) => {
        let distance = 0;
        for (let i = 0; i < waypoints.length - 1; i++) {
            const [lat1, lon1] = waypoints[i];
            const [lat2, lon2] = waypoints[i + 1];
            distance += haversineDistance(lat1, lon1, lat2, lon2);
        }
        setTotalDistance(distance); // Save distance to state
    };

    // Track user's progress along the route
    const trackUserProgress = (position: GeolocationPosition) => {
        if (!userLocation) return;

        const { latitude, longitude } = position.coords;
        const updatedLocation = { lat: latitude, lng: longitude };

        let distance = 0;
        if (selectedPubs.length > 0) {
            const waypoints: [number, number][] = [
                [userLocation.lat, userLocation.lng],
                ...selectedPubs.map((pub) => [pub.latitude, pub.longitude] as [number, number]),
            ];

            for (let i = 0; i < waypoints.length - 1; i++) {
                const [lat1, lon1] = waypoints[i];
                const [lat2, lon2] = waypoints[i + 1];
                distance += haversineDistance(lat1, lon1, latitude, longitude);
                if (latitude === lat2 && longitude === lon2) break; // Stop if user reaches a waypoint
            }
        }

        setDistanceCovered(distance); // Update distance covered
        setUserLocation(updatedLocation); // Update user's location
    };

    // Fetch data and initialize map on component mount
    useEffect(() => {
        fetchPubsData();
        fetchUserInfo();
        updateUserLocation();
    }, []);

    // Center map on user's location during the initial load
    useEffect(() => {
        if (userLocation && mapRef.current && isInitialLoad) {
            mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
            setIsInitialLoad(false);
        }
    }, [userLocation, isInitialLoad]);

    // Track user's location changes and progress
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(trackUserProgress);
        }
    }, [selectedPubs]);

    return (
        <div>
            {/* Header */}
            <header className="web-header">
                <div className="left-container">
                    <div className="user-profile">
                        <div className="profile-icon">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="username">{user.username}</span>
                    </div>
                </div>
                <div className="center-container">
                    <h1 className="app-title">Itinerarease</h1>
                </div>
                <div className="right-container">
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </header>

            {/* Map and Left Panel */}
            <div className="pubs-map-container">
                <div className="map-container">
                    <MapContainer
                        center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
                        zoom={10}
                        style={{ height: '100%' }}
                        whenReady={() => {
                            if (mapRef.current) {
                                console.log('Map is ready:', mapRef.current);
                            }
                        }}
                        ref={(mapInstance) => {
                            mapRef.current = mapInstance ?? null;
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        <MarkerClusterGroup>
                            {pubsData.map((pub, index) => (
                                <Marker
                                    key={`${pub.latitude}-${pub.longitude}-${index}`}
                                    position={[pub.latitude, pub.longitude]}
                                    icon={pubIcon}
                                    eventHandlers={{
                                        mouseover: (e) => {
                                            const marker = e.target as L.Marker;
                                            marker.openPopup();
                                        },
                                        mouseout: (e) => {
                                            const marker = e.target as L.Marker;
                                            setTimeout(() => {
                                                if (!marker.getPopup()?.isOpen()) {
                                                    marker.closePopup();
                                                }
                                            }, 300);
                                        },
                                    }}
                                >
                                    <Popup>
                                        <div
                                            onMouseEnter={(e) => {
                                                const popup = e.target as HTMLElement;
                                                const marker = (popup as any)._source as L.Marker;
                                                marker.openPopup();
                                            }}
                                            onMouseLeave={(e) => {
                                                const popup = e.target as HTMLElement;
                                                const marker = (popup as any)._source as L.Marker;
                                                marker.closePopup();
                                            }}
                                        >
                                            <b>{pub.name}</b>
                                            <br />
                                            {pub.address_1 && (
                                                <>
                                                    {pub.address_1} <br />
                                                </>
                                            )}
                                            {pub.address_2 && (
                                                <>
                                                    {pub.address_2} <br />
                                                </>
                                            )}
                                            {pub.address_3 && (
                                                <>
                                                    {pub.address_3} <br />
                                                </>
                                            )}
                                            {pub.county && (
                                                <>
                                                    {pub.county} <br />
                                                </>
                                            )}
                                            <button
                                                className={`popup-button ${selectedPubs.includes(pub) ? 'selected' : ''}`}
                                                onClick={() => togglePubSelection(pub)}
                                            >
                                                {selectedPubs.includes(pub) ? 'Remove' : 'Add'}
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MarkerClusterGroup>
                        {userLocation && (
                            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                                <Popup>Your Location</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
                <div className="left-panel">
                    <h2>Pub Crawl</h2>
                    <input
                        type="text"
                        placeholder="Search pubs..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <div className="selected-pubs-container">
                        <h3>Selected Pubs for Route</h3>
                        <ul className="selected-pubs-list">
                            {selectedPubs.map((pub, index) => (
                                <li
                                    key={`${pub.latitude}-${pub.longitude}`}
                                    onClick={() => {
                                        if (mapRef.current) {
                                            mapRef.current.setView([pub.latitude, pub.longitude], 20);
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>
                                        {emojis[index % emojis.length]} {pub.name}
                                    </span>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        removePubFromRoute(pub);
                                    }}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={createRoute}
                        disabled={selectedPubs.length === 0}
                        className="create-route-button"
                    >
                        Create Route
                    </button>
                    <div>
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${(distanceCovered / totalDistance) * 100}%` }}
                                ></div>
                            </div>
                            <p>
                                Distance covered: {distanceCovered.toFixed(2)} km / {totalDistance.toFixed(2)} km
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PubsMap;
