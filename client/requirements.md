## Packages
framer-motion | Smooth page transitions and micro-interactions
lucide-react | Beautiful icons for the UI
date-fns | Date formatting for history view

## Notes
Tailwind Config - ensure the following font variables are respected via CSS custom properties.
Image processing: Using standard browser FileReader for Base64 conversion before sending to POST /api/scans.
Geolocation: Automatically attempts to fetch user coordinates on mount. Fails silently if user denies, sending undefined for lat/long.
