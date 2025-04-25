import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to apply film-style filter to an image
export function applyFilmFilter(imageData: ImageData): ImageData {
  const data = imageData.data

  // Apply vintage color grading
  for (let i = 0; i < data.length; i += 4) {
    // Increase red channel slightly for warm tone
    data[i] = Math.min(255, data[i] * 1.1)

    // Reduce blue channel slightly for vintage feel
    data[i + 2] = Math.max(0, data[i + 2] * 0.9)

    // Add slight sepia tone
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)

    // Reduce contrast slightly
    for (let j = 0; j < 3; j++) {
      data[i + j] = 0.8 * data[i + j] + 30
    }
  }

  return imageData
}

// Function to validate if a photo was taken within the event time window
export function isPhotoWithinTimeWindow(photoDate: Date, eventStartDate: Date, durationHours: number): boolean {
  const eventEndDate = new Date(eventStartDate.getTime() + durationHours * 60 * 60 * 1000)
  return photoDate >= eventStartDate && photoDate <= eventEndDate
}

// Function to generate a random event code
export function generateEventCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
