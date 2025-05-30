import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format opening hours
export function formatOpeningHours(openingHours: string | undefined): string {
  if (!openingHours) return 'Hours not available';
  
  // Check if venue is currently open
  const isOpen = checkIfOpen(openingHours);
  if (isOpen) {
    return `Open • ${getClosingTime(openingHours)}`;
  } else {
    return `Closed • Opens ${getNextOpeningTime(openingHours)}`;
  }
}

// Check if the venue is currently open
export function checkIfOpen(openingHours: string): boolean {
  // This is a simplified version
  // In a production app, this would parse the opening hours string and check against current time
  const currentHour = new Date().getHours();
  
  // Assuming format like "7AM - 9PM"
  const match = openingHours.match(/(\d+)(?:AM|PM)\s*-\s*(\d+)(?:AM|PM)/i);
  if (!match) return false;
  
  let openHour = parseInt(match[1], 10);
  let closeHour = parseInt(match[2], 10);
  
  // Adjust for PM times
  if (openingHours.includes('PM') && openHour < 12) openHour += 12;
  if (openingHours.includes('PM') && closeHour < 12) closeHour += 12;
  
  return currentHour >= openHour && currentHour < closeHour;
}

// Get the closing time from opening hours string
export function getClosingTime(openingHours: string): string {
  const match = openingHours.match(/\s*-\s*(\d+)(?:AM|PM)/i);
  if (match) return `Closes at ${match[0].replace('-', '').trim()}`;
  return '';
}

// Get the next opening time
export function getNextOpeningTime(openingHours: string): string {
  const match = openingHours.match(/(\d+)(?:AM|PM)/i);
  if (match) return `at ${match[0]}`;
  return '';
}

// Format distance
export function formatDistance(distance: number | undefined): string {
  if (distance === undefined) return '';
  
  if (distance < 0.1) {
    return 'Very close';
  } else {
    return `${distance} miles away`;
  }
}

// Get venue type label
export function getVenueTypeLabel(type: string): string {
  switch (type.toLowerCase()) {
    case 'coffee':
      return 'Coffee Shop';
    case 'restaurant':
      return 'Restaurant';
    case 'bar':
      return 'Bar';
    default:
      return type;
  }
}

// Get venue type color (tailwind class)
export function getVenueTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'coffee':
      return 'bg-coffee-primary';
    case 'restaurant':
      return 'bg-red-500';
    case 'bar':
      return 'bg-indigo-600';
    default:
      return 'bg-gray-500';
  }
}

// Format phone number
export function formatPhoneNumber(phoneNumber: string | undefined): string {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phoneNumber;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
