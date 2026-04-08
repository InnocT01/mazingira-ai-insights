## Restructuration complète Mazingira Cloud

### Structure inspirée MSN Météo (thème vert)

**Layout principal :**
- **Sidebar gauche** : Navigation verticale (Actuel, Données Sol, Données Climat, Cartes, Tendances, AI Assistant, Mazingira Media)
- **Zone centrale** : Données en temps réel pour la localisation sélectionnée
- **Barre de recherche** : Rechercher un emplacement au Congo

**Page principale (Dashboard Data) :**
1. **En-tête** : Recherche localisation + sélecteur région
2. **Carte conditions actuelles** : Température, humidité, précipitations, qualité du sol (style MSN)
3. **Mini carte** : Carte interactive de la région avec données
4. **Alertes** : Alertes climatiques/agricoles en temps réel
5. **Onglets horizontaux** : Vue d'ensemble | Précipitations | Sol | Humidité | NDVI | UV
6. **Prévisions jours** : Cartes horizontales scrollables (7 jours)
7. **Graphique horaire** : Comme MSN mais pour données agricoles

**Pages/Sections :**
- `/` — Dashboard data principal (style MSN)
- `/cartes` — Cartes interactives
- `/tendances` — Tendances mensuelles/annuelles
- `/ai` — AI Assistant Mazingira
- `/media` — Blog/Articles Mazingira Media
- `/login` — Authentification
- `/farmer` — Tableau de bord agriculteur (terrains, scans, labo)
- `/researcher` — Tableau de bord chercheur (contribution données)

**Différences avec MSN :**
- Données agricoles/sol au lieu de météo pure
- AI Assistant intégré
- Mazingira Media (blog)
- Contribution participative chercheurs
- Scan sol + service labo pour agriculteurs
- Thème vert (nature/agriculture)

**Auth & Rôles :**
- Agriculteurs : gérer terrains, scanner sol, demander labo
- Chercheurs : contribuer données, gérer publications
- Public : accès lecture données gratuitement
