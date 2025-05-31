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

// Get marker icon SVG for venue type
export function getMarkerIcon(type: string): string {
  const baseStyle = 'width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor"';

  switch (type.toLowerCase()) {
    case 'coffee':
      return `<svg ${baseStyle}>
        <path d="M2 21h18v-2H2v2zM20 8h-2V5h2v3zm0-5H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm-4 10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5h10v8z"/>
      </svg>`;
    case 'restaurant':
      return `<svg ${baseStyle}>
        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
      </svg>`;
    case 'bar':
      return `<svg ${baseStyle}>
        <path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z"/>
      </svg>`;
    default:
      return `<svg ${baseStyle}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>`;
  }
}
