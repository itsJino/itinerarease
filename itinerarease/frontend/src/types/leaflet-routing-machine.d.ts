import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    class Control extends L.Control {
      constructor(options?: RoutingOptions);
      getPlan(): Plan;
      setWaypoints(waypoints: Waypoint[]): this;
      getWaypoints(): Waypoint[];
      show(): this;
      hide(): this;
      onAdd(map: L.Map): HTMLElement;
      onRemove(map: L.Map): void;
    }

    interface RoutingOptions {
      waypoints?: Waypoint[];
      lineOptions?: L.PolylineOptions;
      routeWhileDragging?: boolean;
      showAlternatives?: boolean;
      createMarker?: (
        i: number,
        waypoint: Waypoint,
        n: number
      ) => L.Marker | undefined;
      profile?: string; // Added support for profile ('foot', 'car', 'bike', etc.)
      router?: OSRMv1; // Optional router configuration
      plan?: Plan; // Optional plan configuration
    }

    interface Waypoint {
      latLng: L.LatLng;
      name?: string;
    }

    interface Plan {
      options: {
        geocoder?: any; // Optional custom geocoder
        waypointNameFallback?: (latLng: L.LatLng) => string; // Fallback for waypoint names
        urlParameters?: {
          vehicle?: string; // Optional vehicle configuration (foot, bike, car)
        };
      };
      setWaypoints(waypoints: Waypoint[]): this;
      getWaypoints(): Waypoint[];
    }

    class OSRMv1 {
      constructor(options?: OSRMv1Options);
    }

    interface OSRMv1Options {
      serviceUrl?: string; // Custom service URL
      profile?: string; // Route profile ('foot', 'bike', 'car')
      timeout?: number; // Timeout for requests
    }

    function control(options?: RoutingOptions): Control;
    function plan(waypoints: Waypoint[], options?: PlanOptions): Plan; // Add plan creation method
  }
}
