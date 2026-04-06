
## Plan de restructuration Mazingira Cloud

### 1. Fusion Dashboard + Explorer → "Mazingira Open Data"
- Supprimer la page Dashboard séparée
- Renommer Explorer en "Mazingira Open Data" (`/open-data`)
- Structure: données satellites (NASA POWER, Copernicus) + contributions communautaires
- Corriger le tagline: "Regenerating the Congolese land/fields through climate and soil data intelligence"

### 2. Intégration APIs données réelles
- **Edge function `nasa-power`**: température, précipitations, humidité sol via NASA POWER API (gratuit, pas de clé)
- **Edge function `copernicus`**: NDVI, couverture végétale via Copernicus Data Space (gratuit)
- Affichage dans le tableau Open Data avec filtres par région DRC

### 3. Deux parcours utilisateurs distincts

#### A. Agriculteurs/Planteurs/Coopératives (clients)
- Inscription/connexion standard
- Upload et enregistrement de terrains (géolocalisation, superficie)
- Scanner de sol: soumettre échantillon → diagnostic IA
- Consulter données publiées dans leur région
- Tables DB: `user_profiles`, `farms`, `soil_scans`

#### B. Chercheurs/Experts (contributeurs)
- Inscription/connexion avec rôle "researcher"
- Formulaire de contribution type Ushahidi (données climat, sol, agriculture)
- Dashboard de gestion de leurs contributions
- Tables DB: `contributions`, `datasets`

### 4. Migration DB
- Table `profiles` (user_id, role: farmer|researcher|organization)
- Table `farms` (user_id, name, location, area_hectares)
- Table `soil_scans` (farm_id, user_id, results)
- Table `contributions` (researcher_id, type, data, status: pending|approved)

### 5. Mise à jour navigation
- Remplacer Dashboard + Explorer par "Open Data" dans la navbar
- Ajouter liens vers contribution et diagnostic sol
