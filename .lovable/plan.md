## Plan

### 1. Enable Lovable Cloud
- Activate backend for auth, database, AI assistant
- Configure email auth **without email confirmation**
- Set up user profiles table

### 2. Change tagline
- Update hero text to: "Regenerating the Congolese land/fields through climate and soil data intelligence"

### 3. Add interactive map (Congo)
- Integrate Leaflet with OpenStreetMap on the Dashboard page
- Center on DRC/North Kivu with satellite tile layer

### 4. Build premium dashboard
- Create a protected `/premium` route (login required)
- Add charts (soil health, crop performance, climate risk)
- Add cards for AI analysis results

### 5. Add French language toggle
- Add FR/EN language switcher in navbar
- Create i18n context with translations for key UI text

### 6. Clean up & branding
- Rewrite README.md for Mazingira Cloud
- Remove Lovable references from source code
- Add Facebook page button in footer and contact page

### Questions before proceeding:
- For auth: Do you need user profiles (username, avatar, preferences)?
- For the premium dashboard: Should it have mock data for now, or wait for real data sources?
