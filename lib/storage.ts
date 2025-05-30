import { users, type User, type InsertUser, venues, type Venue, type InsertVenue } from "./schema";
import axios from 'axios';
import 'dotenv/config'


// Add interface for Mapbox Geocoding API response
interface MapboxGeocodingFeature {
  center: [number, number]; // [longitude, latitude]
  place_name: string;
}

interface MapboxGeocodingResponse {
  features: MapboxGeocodingFeature[];
}

// Extend the storage interface with venue operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Venue operations
  getAllVenues(): Promise<Venue[]>;
  getVenueById(id: number): Promise<Venue | undefined>;
  getVenuesByType(type: string): Promise<Venue[]>;
  searchVenues(query: string): Promise<Venue[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, venue: Partial<InsertVenue>): Promise<Venue | undefined>;
  deleteVenue(id: number): Promise<boolean>;

  // Google Sheets operations
  fetchVenuesFromGoogleSheets(): Promise<Venue[]>;
  refreshVenuesFromGoogleSheets(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private venues: Map<number, Venue>;
  private userCurrentId: number;
  private venueCurrentId: number;
  private lastSheetsRefresh: Date | null = null;

  constructor() {
    this.users = new Map();
    this.venues = new Map();
    this.userCurrentId = 1;
    this.venueCurrentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Venue operations
  async getAllVenues(): Promise<Venue[]> {
    // If no data or older than 15 minutes, refresh from Google Sheets
    await this.refreshVenuesFromGoogleSheets();
    // if (!this.lastSheetsRefresh ||
    //     (new Date().getTime() - this.lastSheetsRefresh.getTime()) > 15 * 60 * 1000) {
    // }

    const venues = Array.from(this.venues.values());

    // If there are no valid coordinates in the Google Sheets data, use sample data
    if (venues.length > 0 && venues.every(venue => venue.latitude === 0 && venue.longitude === 0)) {
      console.log("No valid coordinates found in venues, using sample data instead");
      return this.getSampleVenues();
    }

    return venues;
  }

  async getVenueById(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenuesByType(type: string): Promise<Venue[]> {
    return Array.from(this.venues.values()).filter(
      (venue) => venue.type === type
    );
  }

  async searchVenues(query: string): Promise<Venue[]> {
    const normalizedQuery = query.toLowerCase();
    return Array.from(this.venues.values()).filter((venue) =>
      venue.name.toLowerCase().includes(normalizedQuery) ||
      venue.description.toLowerCase().includes(normalizedQuery) ||
      venue.address.toLowerCase().includes(normalizedQuery) ||
      venue.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
    );
  }

  async createVenue(insertVenue: InsertVenue): Promise<Venue> {
    const id = this.venueCurrentId++;
    const venue: Venue = {
      ...insertVenue,
      id,
      rating: insertVenue.rating || null,
      reviewCount: insertVenue.reviewCount || null,
      priceLevel: insertVenue.priceLevel || null,
      openingHours: insertVenue.openingHours || null,
      phoneNumber: insertVenue.phoneNumber || null,
      website: insertVenue.website || null,
      imageUrl: insertVenue.imageUrl || null,
      tags: insertVenue.tags || null,
      distance: 0
    };
    this.venues.set(id, venue);
    return venue;
  }

  async updateVenue(id: number, venueUpdate: Partial<InsertVenue>): Promise<Venue | undefined> {
    const existingVenue = this.venues.get(id);
    if (!existingVenue) return undefined;

    // Create a properly typed updated venue
    const updatedVenue: Venue = {
      ...existingVenue,
      ...venueUpdate,
      rating: 'rating' in venueUpdate ? venueUpdate.rating || null : existingVenue.rating,
      reviewCount: 'reviewCount' in venueUpdate ? venueUpdate.reviewCount || null : existingVenue.reviewCount,
      priceLevel: 'priceLevel' in venueUpdate ? venueUpdate.priceLevel || null : existingVenue.priceLevel,
      openingHours: 'openingHours' in venueUpdate ? venueUpdate.openingHours || null : existingVenue.openingHours,
      phoneNumber: 'phoneNumber' in venueUpdate ? venueUpdate.phoneNumber || null : existingVenue.phoneNumber,
      website: 'website' in venueUpdate ? venueUpdate.website || null : existingVenue.website,
      imageUrl: 'imageUrl' in venueUpdate ? venueUpdate.imageUrl || null : existingVenue.imageUrl,
      tags: 'tags' in venueUpdate ? venueUpdate.tags || null : existingVenue.tags,
      distance: existingVenue.distance
    };

    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  async deleteVenue(id: number): Promise<boolean> {
    return this.venues.delete(id);
  }

  // Geocode an address to get coordinates
  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
        console.error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is missing");
        return null;
      }

      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      const encodedAddress = encodeURIComponent(address);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}&limit=1`;

      console.log(`Geocoding address: "${address}"`);
      const response = await axios.get<MapboxGeocodingResponse>(url);

      if (response. data.features && response.data.features.length > 0) {
        const [longitude, latitude] = response.data.features[0].center;
        console.log(`Geocoded "${address}" to [${latitude}, ${longitude}]`);
        return { latitude, longitude };
      }

      console.log(`No geocoding results found for "${address}"`);
      return null;
    } catch (error) {
      console.error(`Error geocoding address "${address}":`, error);
      return null;
    }
  }

  // Google Sheets integration
  async fetchVenuesFromGoogleSheets(): Promise<Venue[]> {
    try {
      console.log("Starting Google Sheets fetch");

      if (!process.env.GOOGLE_SHEETS_API_KEY) {
        console.error("GOOGLE_SHEETS_API_KEY is missing");
        throw new Error("Google Sheets API key not found");
      }

      if (!process.env.GOOGLE_SHEETS_ID) {
        console.error("GOOGLE_SHEETS_ID is missing");
        throw new Error("Google Sheets ID not found");
      }

      const sheetId = process.env.GOOGLE_SHEETS_ID;
      const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
      const range = "A2:P100"; // Adjust range as needed

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      console.log("Fetching from URL:", url);

      const response = await axios.get(url);
      console.log("Google Sheets response status:", response.status);
      console.log("Response data:", JSON.stringify(response.data).substring(0, 200) + "...");

      const rows = response.data.values || [];
      console.log("Found rows:", rows.length);

      if (rows.length === 0) {
        console.log("No data found in Google Sheets. Check your sheet ID and make sure it contains data.");
        // Add some sample data for testing if no data is found
        return this.getSampleVenues();
      }

      // Process each row and geocode addresses if needed
      const venuesPromises = rows.map(async (row: string[], index: number) => {
        const id = index + 1;
        const name = row[0] || "";
        const type = row[1]?.toLowerCase() || "coffee"; // Default to coffee shop
        const description = row[4] || "";
        const address = row[6] || "";

        // Check if we have coordinates already
        let latitude = parseFloat(row[7]) || 0;
        let longitude = parseFloat(row[8]) || 0;

        // If we have an address but no valid coordinates, try to geocode
        if (address && (latitude === 0 || longitude === 0)) {
          console.log(`Venue "${name}" has address but no coordinates, geocoding...`);
          const coords = await this.geocodeAddress(address);
          if (coords) {
            latitude = coords.latitude;
            longitude = coords.longitude;
            console.log(`Successfully geocoded "${name}" at ${address} to [${latitude}, ${longitude}]`);
          }
        }

        // Parse tags if they exist
        let tags: string[] = [];
        if (row[11]) {
          tags = row[11].split(',').map(tag => tag.trim());
        }

        // Normalize venue type
        let normalizedType = type;
        if (type.includes("coffee") || type.includes("café") || type.includes("cafe")) {
          normalizedType = "coffee";
        } else if (type.includes("restaurant") || type.includes("food")) {
          normalizedType = "restaurant";
        } else if (type.includes("bar") || type.includes("pub") || type.includes("lounge")) {
          normalizedType = "bar";
        }

        return {
          id,
          name,
          type: normalizedType as "coffee" | "restaurant" | "bar",
          description,
          address,
          latitude,
          longitude,
          rating: parseFloat(row[6]) || null,
          reviewCount: parseInt(row[7], 10) || null,
          priceLevel: row[8] || null,
          openingHours: row[9] || null,
          phoneNumber: row[10] || null,
          website: row[12] || null,
          imageUrl: row[13] || null,
          tags: tags.length > 0 ? tags : null,
          distance: 0 // Will be calculated on client-side
        };
      });

      // Wait for all geocoding operations to complete
      const venues = await Promise.all(venuesPromises);
      console.log("Processed venues:", venues.length);

      // Check if we have valid coordinates for at least some venues
      const validVenues = venues.filter(venue => venue.latitude !== 0 || venue.longitude !== 0);
      if (validVenues.length === 0) {
        console.log("No venues with valid coordinates found after geocoding, using sample data");
        return this.getSampleVenues();
      }

      return venues;
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
      // Add some sample data for testing if there's an error
      return this.getSampleVenues();
    }
  }

  // Sample venues for testing when Google Sheets data is unavailable
  private getSampleVenues(): Venue[] {
    console.log("Using sample venue data for testing");
    return [
      {
        id: 1,
        name: "Urban Bean Coffeehouse",
        type: "coffee",
        description: "Cozy coffeehouse with artisanal brews and fresh pastries",
        address: "123 Main St, New York, NY",
        latitude: 40.7128,
        longitude: -74.006,
        rating: 4.5,
        reviewCount: 128,
        priceLevel: "$$",
        openingHours: "7AM - 7PM",
        phoneNumber: "212-555-0123",
        website: "https://urbanbean.example.com",
        imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
        tags: ["coffee", "pastries", "wifi"],
        distance: 0
      },
      {
        id: 2,
        name: "The Hungry Fork",
        type: "restaurant",
        description: "Farm-to-table restaurant with seasonal ingredients",
        address: "456 Broadway, New York, NY",
        latitude: 40.7193,
        longitude: -73.9986,
        rating: 4.7,
        reviewCount: 256,
        priceLevel: "$$$",
        openingHours: "11AM - 10PM",
        phoneNumber: "212-555-0456",
        website: "https://hungryfork.example.com",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        tags: ["dinner", "lunch", "organic"],
        distance: 0
      },
      {
        id: 3,
        name: "Nightcap Lounge",
        type: "bar",
        description: "Stylish cocktail bar with live jazz music",
        address: "789 5th Ave, New York, NY",
        latitude: 40.7234,
        longitude: -73.9961,
        rating: 4.3,
        reviewCount: 178,
        priceLevel: "$$$",
        openingHours: "5PM - 2AM",
        phoneNumber: "212-555-0789",
        website: "https://nightcap.example.com",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34",
        tags: ["cocktails", "jazz", "nightlife"],
        distance: 0
      },
      {
        id: 4,
        name: "Morning Brew Coffee",
        type: "coffee",
        description: "Specialty coffee shop with single-origin beans",
        address: "234 Park Ave, New York, NY",
        latitude: 40.7142,
        longitude: -74.0121,
        rating: 4.8,
        reviewCount: 213,
        priceLevel: "$$",
        openingHours: "6AM - 6PM",
        phoneNumber: "212-555-0234",
        website: "https://morningbrew.example.com",
        imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772",
        tags: ["coffee", "vegan", "breakfast"],
        distance: 0
      }
    ];
  }

  async refreshVenuesFromGoogleSheets(): Promise<void> {
    const venues = await this.fetchVenuesFromGoogleSheets();

    // Clear existing venues
    this.venues.clear();

    // Add new venues
    venues.forEach(venue => {
      this.venues.set(venue.id, venue);
    });

    // Update the last refresh time
    this.lastSheetsRefresh = new Date();

    // Reset the currentId counter
    this.venueCurrentId = venues.length + 1;
  }
}

export const storage = new MemStorage();
