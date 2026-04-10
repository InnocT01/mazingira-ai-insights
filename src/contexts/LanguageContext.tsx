import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "fr" | "en" | "sw" | "ln" | "wo" | "zu";

export const langNames: Record<Lang, string> = {
  fr: "Français",
  en: "English",
  sw: "Kiswahili",
  ln: "Lingála",
  wo: "Wolof",
  zu: "isiZulu",
};

export const langFlags: Record<Lang, string> = {
  fr: "🇫🇷", en: "🇬🇧", sw: "🇹🇿", ln: "🇨🇩", wo: "🇸🇳", zu: "🇿🇦",
};

const translations: Record<string, Record<Lang, string>> = {
  // Search
  "search.placeholder": { en: "Search a location...", fr: "Rechercher un emplacement...", sw: "Tafuta eneo...", ln: "Luka esika...", wo: "Wut ab benn barab...", zu: "Sesha indawo..." },

  // Sidebar nav
  "nav.data": { en: "Data", fr: "Données", sw: "Data", ln: "Ba données", wo: "Njëlbéen", zu: "Idatha" },
  "nav.current": { en: "Current", fr: "Actuel", sw: "Sasa hivi", ln: "Lelo", wo: "Léegi", zu: "Manje" },
  "nav.opendata": { en: "Open Data", fr: "Données Ouvertes", sw: "Data Huria", ln: "Ba données ya polele", wo: "Njëlbéen ubbiku", zu: "Idatha Evulekile" },
  "nav.maps": { en: "Maps", fr: "Cartes", sw: "Ramani", ln: "Ba carte", wo: "Kart", zu: "Amamephu" },
  "nav.trends": { en: "Trends", fr: "Tendances", sw: "Mwenendo", ln: "Tendance", wo: "Yeesalkat", zu: "Izitayela" },
  "nav.ai": { en: "AI Assistant", fr: "Assistant IA", sw: "Msaidizi wa AI", ln: "Mosungi ya AI", wo: "Ndimbal AI", zu: "Umsizi we-AI" },
  "nav.media": { en: "Mazingira Media", fr: "Mazingira Média", sw: "Mazingira Vyombo", ln: "Mazingira Média", wo: "Mazingira Xebaar", zu: "Mazingira Ababezindaba" },
  "nav.ecokids": { en: "EcoKids Sentinel", fr: "EcoKids Sentinel", sw: "EcoKids Sentinel", ln: "EcoKids Sentinel", wo: "EcoKids Sentinel", zu: "EcoKids Sentinel" },
  "nav.account": { en: "Account", fr: "Compte", sw: "Akaunti", ln: "Compte", wo: "Sàmm", zu: "I-Akhawunti" },
  "nav.farmer_dashboard": { en: "Farmer Dashboard", fr: "Tableau Agriculteur", sw: "Dashibodi ya Mkulima", ln: "Tableau ya Mosali bilanga", wo: "Tablo bu ndogalkat", zu: "Ideshibhodi yoMlimi" },
  "nav.researcher_dashboard": { en: "Researcher Hub", fr: "Hub Chercheur", sw: "Kituo cha Mtafiti", ln: "Hub ya Molukami", wo: "Sàmm bi ci waxtaaney", zu: "Isikhungo soMcwaningi" },
  "nav.more": { en: "More", fr: "Plus", sw: "Zaidi", ln: "Mosusu", wo: "Lu ëpp", zu: "Okwengeziwe" },
  "nav.about": { en: "About", fr: "À propos", sw: "Kuhusu", ln: "Mpo na biso", wo: "Ci biir", zu: "Mayelana" },
  "nav.contact": { en: "Contact", fr: "Contact", sw: "Wasiliana", ln: "Kokutana", wo: "Jokkoo", zu: "Xhumana" },
  "nav.signin": { en: "Sign In", fr: "Connexion", sw: "Ingia", ln: "Kokɔta", wo: "Dugg", zu: "Ngena" },
  "nav.signout": { en: "Sign Out", fr: "Déconnexion", sw: "Toka", ln: "Kobima", wo: "Génn", zu: "Phuma" },

  // Home
  "home.tagline": { en: "Regenerating Congolese land through climate & soil data intelligence", fr: "Régénérer les terres congolaises grâce à l'intelligence des données climatiques et pédologiques", sw: "Kuhuisha ardhi ya Kongo kupitia akili ya data ya hali ya hewa na udongo", ln: "Kozongisa mabele ya Congo na mayele ya ba données ya klima mpe mabele", wo: "Yeesal suuf Kongo ak xam-xam ci klima", zu: "Ukuvuselela umhlaba waseCongo ngolwazi lwedatha yesimo sezulu nenhlabathi" },
  "home.feels_like": { en: "Feels like", fr: "Ressenti", sw: "Inahisi kama", ln: "Eyokani na", wo: "Dafa mel ni", zu: "Kuzizwa njenge" },
  "home.wind": { en: "Wind", fr: "Vent", sw: "Upepo", ln: "Mopepe", wo: "Ngelaw", zu: "Umoya" },
  "home.humidity": { en: "Humidity", fr: "Humidité", sw: "Unyevu", ln: "Mai na mopepe", wo: "Ndox-ngelaw", zu: "Umswakama" },
  "home.visibility": { en: "Visibility", fr: "Visibilité", sw: "Mwonekano", ln: "Komona", wo: "Xàmm", zu: "Ukubonakala" },
  "home.pressure": { en: "Pressure", fr: "Pression", sw: "Shinikizo", ln: "Pression", wo: "Pression", zu: "Ingcindezi" },
  "home.agri_conditions": { en: "Agricultural Conditions", fr: "Conditions Agricoles", sw: "Hali ya Kilimo", ln: "Makambo ya bilanga", wo: "Toll-tollak ndogal", zu: "Izimo Zokulima" },
  "home.soil_moisture": { en: "Soil Moisture", fr: "Humidité du Sol", sw: "Unyevu wa Udongo", ln: "Mai ya mabele", wo: "Ndox suuf", zu: "Umswakama Wenhlabathi" },
  "home.precip_7d": { en: "Precipitation (7d)", fr: "Précipitations (7j)", sw: "Mvua (siku 7)", ln: "Mbula (mikolo 7)", wo: "Taw (7 fan)", zu: "Imvula (izinsuku 7)" },
  "home.agri_tip": { en: "🌱 Good planting conditions for cassava and maize", fr: "🌱 Bonnes conditions de plantation pour le manioc et le maïs", sw: "🌱 Hali nzuri ya kupanda muhogo na mahindi", ln: "🌱 Makambo ya malamu mpo na kolona manɔkɔ mpe masangu", wo: "🌱 Toll-tollak bu baax ngir sëy mañog ak mbuuru", zu: "🌱 Izimo ezinhle zokutshala umkhiwane nombila" },
  "home.forecast_7d": { en: "7-Day Forecast", fr: "Prévisions sur 7 jours", sw: "Utabiri wa Siku 7", ln: "Prevision ya mikolo 7", wo: "Xàmm-xàmm bu 7 fan", zu: "Isibikezelo Sezinsuku 7" },
  "home.loading_data": { en: "Loading climate data...", fr: "Chargement des données climatiques...", sw: "Kupakia data ya hali ya hewa...", ln: "Kozwa ba données ya klima...", wo: "Yab njëlbéen klima yi...", zu: "Ukulayisha idatha yesimo sezulu..." },
  "home.source_nasa": { en: "Source: NASA POWER", fr: "Source : NASA POWER", sw: "Chanzo: NASA POWER", ln: "Source: NASA POWER", wo: "Jëmm: NASA POWER", zu: "Umthombo: NASA POWER" },
  "home.data_source": { en: "Data provided by NASA POWER API — updated daily", fr: "Données fournies par l'API NASA POWER — mises à jour quotidiennement", sw: "Data kutoka NASA POWER API — inasasishwa kila siku", ln: "Ba données ya NASA POWER API — ba mise à jour mokolo na mokolo", wo: "Njëlbéen yi jëm ci NASA POWER API — yeesal bu bés", zu: "Idatha evela ku-NASA POWER API — ibuyekezwa nsuku zonke" },
  "home.rainy": { en: "Rainy", fr: "Pluvieux", sw: "Mvua", ln: "Mbula", wo: "Taw", zu: "Imvula" },
  "home.cloudy": { en: "Cloudy", fr: "Nuageux", sw: "Mawingu", ln: "Lipata", wo: "Niir", zu: "Amafu" },
  "home.precip_today": { en: "Precip. today", fr: "Précip. du jour", sw: "Mvua leo", ln: "Mbula lelo", wo: "Taw tey", zu: "Imvula namuhla" },
  "home.solar": { en: "Solar Rad.", fr: "Rayonnement", sw: "Mionzi ya Jua", ln: "Moyi", wo: "Jant", zu: "Ukukhanya kwelanga" },
  "home.precip_30d": { en: "Precipitation (30d)", fr: "Précipitations (30j)", sw: "Mvua (siku 30)", ln: "Mbula (mikolo 30)", wo: "Taw (30 fan)", zu: "Imvula (izinsuku 30)" },
  "home.avg_temp_30d": { en: "Avg. Temp (30d)", fr: "Temp. Moy. (30j)", sw: "Joto wastani (siku 30)", ln: "Température moyenne (mikolo 30)", wo: "Tangaay mu diggu (30 fan)", zu: "Amazinga Okushisa (izinsuku 30)" },
  "home.agri_good": { en: "Favorable growing conditions", fr: "Conditions de croissance favorables", sw: "Hali nzuri ya kukua", ln: "Makambo ya malamu mpo na kokola", wo: "Toll-tollak bu baax ngir mag", zu: "Izimo ezinhle zokukhula" },
  "home.agri_moderate": { en: "Moderate growing conditions", fr: "Conditions de croissance modérées", sw: "Hali ya wastani ya kukua", ln: "Makambo ya ekomi mwa malamu", wo: "Toll-tollak yu am diggal", zu: "Izimo eziphakathi zokukhula" },
  "home.last_7_days": { en: "Last 7 Days", fr: "7 Derniers Jours", sw: "Siku 7 Zilizopita", ln: "Mikolo 7 oyo eleki", wo: "7 Fan yi weesu", zu: "Izinsuku 7 Ezedlule" },
  "home.temperature": { en: "Temperature", fr: "Température", sw: "Joto", ln: "Température", wo: "Tangaay", zu: "Izinga lokushisa" },
  "home.precipitation": { en: "Precipitation", fr: "Précipitations", sw: "Mvua", ln: "Mbula", wo: "Taw", zu: "Imvula" },
  "home.temp_range": { en: "Temp. Range (30d)", fr: "Plage Temp. (30j)", sw: "Kiwango cha joto (siku 30)", ln: "Kati ya température (mikolo 30)", wo: "Palier tangaay (30 fan)", zu: "Ububanzi bezinga lokushisa (izinsuku 30)" },
  "home.last_30_days": { en: "Over last 30 days", fr: "Sur les 30 derniers jours", sw: "Katika siku 30 zilizopita", ln: "Na mikolo 30 oyo eleki", wo: "Ci biir 30 fan yi weesu", zu: "Ezinsukwini ezingu-30 ezedlule" },
  "home.avg_humidity_label": { en: "Avg. Humidity", fr: "Humidité Moyenne", sw: "Unyevu Wastani", ln: "Humidité moyenne", wo: "Ndox-ngelaw mu diggu", zu: "Amazinga Omswakama" },
  "home.humidity_status": { en: "Tropical", fr: "Tropicale", sw: "Kitropiki", ln: "Tropicale", wo: "Tropikal", zu: "Tropical" },
  "home.partly_sunny": { en: "Mostly Sunny", fr: "Globalement ensoleillé", sw: "Jua kali zaidi", ln: "Moyi mingi", wo: "Jant bu bari", zu: "Ilanga kakhulu" },
  "home.weather_desc": { en: "Good conditions for fieldwork.", fr: "Bonnes conditions pour le travail de terrain.", sw: "Hali nzuri kwa kazi shambani.", ln: "Makambo ya malamu mpo na mosala na bilanga.", wo: "Toll-tollak bu baax ngir liggéey tool", zu: "Izimo ezinhle zomsebenzi wasenkundleni." },

  // Agricultural insights
  "agri.insights_title": { en: "Agricultural Intelligence", fr: "Intelligence Agricole", sw: "Akili ya Kilimo", ln: "Mayele ya Bilanga", wo: "Xam-xam Ndogal", zu: "Ulwazi Lokulima" },
  "agri.planting_window": { en: "Planting Window", fr: "Fenêtre de Semis", sw: "Muda wa Kupanda", ln: "Ntango ya kolona", wo: "Waxtu sëy", zu: "Isikhathi Sokutshala" },
  "agri.planting_favorable": { en: "Conditions are favorable for planting cassava, beans, and maize.", fr: "Les conditions sont favorables pour le semis de manioc, haricots et maïs.", sw: "Hali ni nzuri kwa kupanda muhogo, maharage na mahindi.", ln: "Makambo ezali malamu mpo na kolona manɔkɔ, madesu mpe masangu.", wo: "Toll-tollak yi baax ngir sëy mañog, ñebbe ak mbuuru.", zu: "Izimo zinhle zokutshala umkhiwane, ubhontshisi nombila." },
  "agri.planting_wait": { en: "Wait for more precipitation before planting.", fr: "Attendez plus de précipitations avant de semer.", sw: "Subiri mvua zaidi kabla ya kupanda.", ln: "Zela mbula mingi liboso ya kolona.", wo: "Xaar taw bu bari balaa nga sëy.", zu: "Linda imvula engeziwe ngaphambi kokutshala." },
  "agri.irrigation": { en: "Irrigation Need", fr: "Besoin d'Irrigation", sw: "Haja ya Umwagiliaji", ln: "Esengeli kosopa mai", wo: "Soxla ndox", zu: "Isidingo Sokunisela" },
  "agri.irrigation_sufficient": { en: "Natural rainfall is sufficient.", fr: "Les précipitations naturelles sont suffisantes.", sw: "Mvua ya asili inatosha.", ln: "Mbula ya naturel ekoki.", wo: "Taw bu nekk dafa doy.", zu: "Imvula yemvelo yanele." },
  "agri.irrigation_needed": { en: "Consider supplemental irrigation.", fr: "Envisagez une irrigation d'appoint.", sw: "Fikiria umwagiliaji wa ziada.", ln: "Kanisa mpo na kosopa mai ya kobakisa.", wo: "Xalaat ngir yokk ndox.", zu: "Cabanga ukunisela okwengeziwe." },
  "agri.pest_risk": { en: "Pest Risk", fr: "Risque Parasitaire", sw: "Hatari ya Wadudu", ln: "Likama ya bibwele", wo: "Xiir-xiir ci jabar", zu: "Ingozi Yezinambuzane" },
  "agri.pest_high": { en: "High humidity increases risk of fungal diseases.", fr: "L'humidité élevée augmente le risque de maladies fongiques.", sw: "Unyevu wa juu huongeza hatari ya magonjwa ya kuvu.", ln: "Humidité makasi ebakisi likama ya maladi.", wo: "Ndox-ngelaw bu bari moo def xiir feebar.", zu: "Umswakama ophezulu wandisa ingozi yezifo zesikhunta." },
  "agri.pest_low": { en: "Low to moderate pest risk.", fr: "Risque parasitaire faible à modéré.", sw: "Hatari ya wadudu ni ndogo hadi wastani.", ln: "Likama ya bibwele ezali moke.", wo: "Xiir jabar yi néew.", zu: "Ingozi yezinambuzane iphansi kuya maphakathi." },
  "agri.crop_rec": { en: "Crop Recommendation", fr: "Culture Recommandée", sw: "Pendekezo la Mazao", ln: "Toli ya bilanga", wo: "Digal ci ndogal", zu: "Isincomo Sezitshalo" },
  "agri.crop_rec_warm": { en: "Ideal for: cassava, sweet potato, maize, beans, sorghum.", fr: "Idéal pour : manioc, patate douce, maïs, haricots, sorgho.", sw: "Bora kwa: muhogo, viazi vitamu, mahindi, maharage.", ln: "Ya malamu mpo na: manɔkɔ, mbala, masangu, madesu.", wo: "Bu baax ngir: mañog, pataas, mbuuru, ñebbe.", zu: "Kuhle kakhulu: umkhiwane, ubhatata, umbila, ubhontshisi." },
  "agri.crop_rec_cool": { en: "Ideal for: potatoes, wheat, peas, cabbage.", fr: "Idéal pour : pommes de terre, blé, pois, chou.", sw: "Bora kwa: viazi, ngano, njegere, kabichi.", ln: "Ya malamu mpo na: pomme de terre, blé, pois, chou.", wo: "Bu baax ngir: pombiteer, ble, puwaa, suu.", zu: "Kuhle kakhulu: amazambane, ukolweni, izindumba, iklabishi." },
  "agri.soil_tip": { en: "Soil Health", fr: "Santé du Sol", sw: "Afya ya Udongo", ln: "Sante ya mabele", wo: "Wér suuf", zu: "Impilo Yenhlabathi" },
  "agri.soil_erosion_risk": { en: "Heavy rains increase erosion risk. Use mulching and terracing.", fr: "Les fortes pluies augmentent le risque d'érosion. Utilisez le paillage et le terrassement.", sw: "Mvua kubwa huongeza hatari ya mmomonyoko. Tumia matandazo.", ln: "Mbula makasi ebakisi likama ya érosion. Salelá paillage.", wo: "Taw bu bari moo yokk xiir erosion. Jëfandikul paillage.", zu: "Izimvula ezinkulu zandisa ingozi yokuguguleka. Sebenzisa ukumbozia." },
  "agri.soil_stable": { en: "Soil conditions are stable. Good time for composting.", fr: "Les conditions du sol sont stables. Bon moment pour le compostage.", sw: "Hali ya udongo ni thabiti. Wakati mzuri wa kutengeneza mboji.", ln: "Makambo ya mabele ezali stable. Ntango ya malamu mpo na compost.", wo: "Toll-tollak suuf yi am njàmm. Waxtu bu baax ngir kompost.", zu: "Izimo zenhlabathi zizinzile. Isikhathi esihle sokuqoqa." },
  "agri.season": { en: "Growing Season", fr: "Saison Culturale", sw: "Msimu wa Kilimo", ln: "Eleko ya bilanga", wo: "Nawet", zu: "Inkathi Yokukhula" },
  "agri.season_info": { en: "Season B (Feb-Jun) in progress. Plan harvest schedules.", fr: "Saison B (fév-juin) en cours. Planifiez les calendriers de récolte.", sw: "Msimu B (Feb-Jun) unaendelea. Panga ratiba ya mavuno.", ln: "Saison B (fev-juin) ezali kokende. Bobongisa calendrier ya kobuka.", wo: "Nawet B (Feb-Suwee) nekk. Def plan ngir dund.", zu: "Inkathi B (Feb-Jun) iyaqhubeka. Hlela izinhlelo zokuvuna." },

  // Media
  "media.create": { en: "Write Article", fr: "Écrire un Article", sw: "Andika Makala", ln: "Koma lisolo", wo: "Bind xebaar", zu: "Bhala Isihloko" },
  "media.login_to_create": { en: "Sign in to write", fr: "Connectez-vous pour écrire", sw: "Ingia kuandika", ln: "Kokɔta mpo na kokoma", wo: "Dugg ngir bind", zu: "Ngena ukuze ubhale" },
  "media.title": { en: "Mazingira Media", fr: "Mazingira Média", sw: "Mazingira Vyombo", ln: "Mazingira Média", wo: "Mazingira Xebaar", zu: "Mazingira Media" },
  "media.subtitle": { en: "Articles and insights on climate and agriculture in the DRC.", fr: "Articles et analyses sur le climat et l'agriculture en RDC.", sw: "Makala na ufahamu kuhusu hali ya hewa na kilimo nchini DRC.", ln: "Ba article mpe ba analyse na likambo ya klima na bilanga na RDC.", wo: "Xebaar yi ci klima ak ndogal ci RDC.", zu: "Izihloko kanye nokuqonda ngesimo sezulu kanye nokulima e-DRC." },

  // Days
  "day.mon": { en: "Mon", fr: "Lun", sw: "Jtt", ln: "Lnd", wo: "Alt", zu: "Mso" },
  "day.tue": { en: "Tue", fr: "Mar", sw: "Jnn", ln: "Mrd", wo: "Tal", zu: "Lwe" },
  "day.wed": { en: "Wed", fr: "Mer", sw: "Jtn", ln: "Mkd", wo: "Àla", zu: "Lwe" },
  "day.thu": { en: "Thu", fr: "Jeu", sw: "Alh", ln: "Jd", wo: "Àlx", zu: "Lws" },
  "day.fri": { en: "Fri", fr: "Ven", sw: "Ijm", ln: "Vnd", wo: "Àjj", zu: "Lwh" },
  "day.sat": { en: "Sat", fr: "Sam", sw: "Jmt", ln: "Smd", wo: "Gàw", zu: "Mgq" },
  "day.sun": { en: "Sun", fr: "Dim", sw: "Jpl", ln: "Dms", wo: "Dib", zu: "Son" },

  // Open Data
  "opendata.title": { en: "Mazingira Open Data", fr: "Mazingira Données Ouvertes", sw: "Mazingira Data Huria", ln: "Mazingira Données ya Polele", wo: "Mazingira Njëlbéen ubbiku", zu: "Mazingira Idatha Evulekile" },
  "opendata.subtitle": { en: "Access satellite data and community research for Congolese agriculture.", fr: "Accédez aux données satellites et recherches communautaires pour l'agriculture congolaise.", sw: "Pata data za setilaiti na utafiti wa jamii kwa kilimo cha Kongo.", ln: "Kozwa ba données ya satellite mpe ba recherche ya communauté mpo na bilanga ya Congo.", wo: "Am njëlbéen satellite ak waxtaan mbooloo ngir ndogal.", zu: "Finyelela idatha yesethelayithi nocwaningo lomphakathi." },
  "opendata.tab_satellite": { en: "Satellite Data", fr: "Données Satellites", sw: "Data za Setilaiti", ln: "Ba données ya Satellite", wo: "Njëlbéen satellite", zu: "Idatha Yesethelayithi" },
  "opendata.tab_community": { en: "Community Research", fr: "Recherche Communautaire", sw: "Utafiti wa Jamii", ln: "Recherche ya communauté", wo: "Waxtaan mbooloo", zu: "Ucwaningo Lomphakathi" },
  "opendata.no_community": { en: "No community contributions yet.", fr: "Aucune contribution communautaire pour l'instant.", sw: "Hakuna mchango wa jamii bado.", ln: "Eza naino na contribution ya communauté te.", wo: "Amul lu xew ci mbooloo.", zu: "Akukho umnikelo womphakathi okwamanje." },

  // Maps
  "maps.title": { en: "Interactive Maps", fr: "Cartes Interactives", sw: "Ramani za Kushirikiana", ln: "Ba carte interactives", wo: "Kart interactif yi", zu: "Amamephu Asebenzayo" },
  "maps.subtitle": { en: "Explore environmental data across the DRC", fr: "Explorez les données environnementales à travers la RDC", sw: "Chunguza data za mazingira katika DRC", ln: "Talá ba données ya environnement na RDC mobimba", wo: "Seet njëlbéen àddina ci RDC", zu: "Hlola idatha yemvelo kulo lonke i-DRC" },

  // Trends
  "trends.title": { en: "Climate & Agriculture Trends", fr: "Tendances Climat & Agriculture", sw: "Mwenendo wa Hali ya Hewa na Kilimo", ln: "Tendances ya Klima na Bilanga", wo: "Yeesalkat klima ak ndogal", zu: "Izitayela Zesimo Sezulu Nezokulima" },
  "trends.subtitle": { en: "Monthly and annual analysis for the Goma region", fr: "Analyse mensuelle et annuelle pour la région de Goma", sw: "Uchambuzi wa kila mwezi na mwaka kwa eneo la Goma", ln: "Analyse ya sanza na sanza mpe ya mobu mpo na région ya Goma", wo: "Xàmm-xàmm weer ak at ci Goma", zu: "Ukuhlaziywa kwenyanga nonyaka kwendawo yaseGoma" },
  "trends.avg_temp": { en: "Avg. Temperature", fr: "Temp. Moyenne", sw: "Joto Wastani", ln: "Température moyenne", wo: "Tangaay mu diggu", zu: "Amazinga Okushisa" },
  "trends.stable": { en: "Stable", fr: "Stable", sw: "Imara", ln: "Stable", wo: "Dëgg", zu: "Kuzinzile" },
  "trends.annual_rain": { en: "Annual Rainfall", fr: "Pluviométrie Annuelle", sw: "Mvua ya Mwaka", ln: "Mbula ya mobu", wo: "Taw bu at", zu: "Imvula Yonyaka" },
  "trends.avg_ndvi": { en: "Avg. NDVI", fr: "NDVI Moyen", sw: "NDVI Wastani", ln: "NDVI moyen", wo: "NDVI mu diggu", zu: "Amazinga e-NDVI" },
  "trends.monthly_rain": { en: "Monthly Precipitation (mm)", fr: "Précipitations Mensuelles (mm)", sw: "Mvua ya Mwezi (mm)", ln: "Mbula ya sanza (mm)", wo: "Taw bu weer (mm)", zu: "Imvula Yenyanga (mm)" },
  "trends.monthly_ndvi": { en: "Monthly NDVI", fr: "NDVI Mensuel", sw: "NDVI ya Mwezi", ln: "NDVI ya sanza", wo: "NDVI bu weer", zu: "I-NDVI Yenyanga" },

  // AI
  "ai.title": { en: "Mazingira AI", fr: "Mazingira IA", sw: "Mazingira AI", ln: "Mazingira IA", wo: "Mazingira AI", zu: "Mazingira AI" },
  "ai.subtitle": { en: "Your AI assistant for Congolese agriculture and climate.", fr: "Votre assistant IA pour l'agriculture et le climat congolais.", sw: "Msaidizi wako wa AI kwa kilimo na hali ya hewa ya Kongo.", ln: "Mosungi na yo ya IA mpo na bilanga na klima ya Congo.", wo: "Sa ndimbal AI ngir ndogal ak klima Kongo.", zu: "Umsizi wakho we-AI wokulima nesimo sezulu saseCongo." },
  "ai.placeholder": { en: "Ask about your land, crops, climate...", fr: "Posez vos questions sur vos terres, cultures, climat...", sw: "Uliza kuhusu ardhi yako, mazao, hali ya hewa...", ln: "Tuna mituna na yo na likambo ya mabele, bilanga, klima...", wo: "Laaj ci sa suuf, ndogal, klima...", zu: "Buza ngomhlaba wakho, izitshalo, isimo sezulu..." },

  // About
  "about.title": { en: "About Mazingira Cloud", fr: "À propos de Mazingira Cloud", sw: "Kuhusu Mazingira Cloud", ln: "Mpo na Mazingira Cloud", wo: "Ci biir Mazingira Cloud", zu: "Mayelana ne-Mazingira Cloud" },
  "about.desc": { en: "Building environmental intelligence for Congolese agriculture.", fr: "Construire l'intelligence environnementale pour l'agriculture congolaise.", sw: "Kujenga akili ya mazingira kwa kilimo cha Kongo.", ln: "Kotonga mayele ya environnement mpo na bilanga ya Congo.", wo: "Tabax xam-xam àddina ngir ndogal Kongo.", zu: "Ukwakha ulwazi lwemvelo lokulima kwaseCongo." },
  "about.mission": { en: "Mazingira Cloud combines open-source satellite data with AI-powered analytics to democratize access to environmental intelligence.", fr: "Mazingira Cloud combine des données satellites open-source avec des analyses IA pour démocratiser l'accès à l'intelligence environnementale.", sw: "Mazingira Cloud inachanganya data za setilaiti za chanzo huria na uchambuzi wa AI kupanua ufikiaji wa akili ya mazingira.", ln: "Mazingira Cloud esangisi ba données ya satellite open-source na ba analyse ya IA mpo na kopesa bato nyonso mayele ya environnement.", wo: "Mazingira Cloud moo bokk njëlbéen satellite open-source ak xàmm-xàmm AI ngir ubbeeku xam-xam àddina.", zu: "I-Mazingira Cloud ihlanganisa idatha yesethelayithi evulekile nokuhlaziywa okusekelwe yi-AI ukuze kufinyeleleke ulwazi lwemvelo." },
  "about.v1": { en: "Built in Africa, for Africa, with global relevance.", fr: "Construit en Afrique, pour l'Afrique, avec une pertinence mondiale.", sw: "Imejengwa Afrika, kwa Afrika, yenye umuhimu wa kimataifa.", ln: "Etongamaki na Afrika, mpo na Afrika, na motuya ya mokili mobimba.", wo: "Tabaxal ci Afrig, ngir Afrig, ak solo ci àdduna.", zu: "Kwakhiwe e-Afrika, ngase-Afrika, ngokubaluleka komhlaba wonke." },
  "about.v2": { en: "Environmental data accessible to everyone.", fr: "Données environnementales accessibles à tous.", sw: "Data za mazingira zinazopatikana kwa kila mtu.", ln: "Ba données ya environnement ezali mpo na moto nyonso.", wo: "Njëlbéen àddina am ci kenn ku ëpp.", zu: "Idatha yemvelo efinyelelekalayo kuwo wonke umuntu." },
  "about.v3": { en: "Every insight backed by satellite data and research.", fr: "Chaque analyse soutenue par des données satellites et la recherche.", sw: "Kila ufahamu unategemezwa na data za setilaiti na utafiti.", ln: "Analyse nyonso etelemi na ba données ya satellite na recherche.", wo: "Xàmm-xàmm lépp am tiitange ci njëlbéen satellite ak waxtaan.", zu: "Konke ukuqonda kusekelwe yidatha yesethelayithi nocwaningo." },
  "about.v4": { en: "Success measured by communities empowered.", fr: "Succès mesuré par les communautés autonomisées.", sw: "Mafanikio yanapimwa na jamii zilizoimarishwa.", ln: "Succès etalisamaki na ba communauté oyo ezwi force.", wo: "Yiw gi mat ci mbooloo yu am doole.", zu: "Impumelelo elinganiswa ngemiphakathi enamandlisiwe." },

  // Contact
  "contact.title": { en: "Contact Us", fr: "Contactez-nous", sw: "Wasiliana Nasi", ln: "Kotinda biso nsango", wo: "Jokkoo ak ñun", zu: "Xhumana Nathi" },
  "contact.desc": { en: "Have questions about Mazingira Cloud?", fr: "Des questions sur Mazingira Cloud ?", sw: "Una maswali kuhusu Mazingira Cloud?", ln: "Ozali na mituna na likambo ya Mazingira Cloud?", wo: "Am nga laaj ci Mazingira Cloud?", zu: "Unemibuzo mayelana ne-Mazingira Cloud?" },
  "contact.name": { en: "Name", fr: "Nom", sw: "Jina", ln: "Nkombo", wo: "Tur", zu: "Igama" },
  "contact.send": { en: "Send Message", fr: "Envoyer", sw: "Tuma Ujumbe", ln: "Tinda nsango", wo: "Yónnee bataaxal", zu: "Thumela Umlayezo" },
  "contact.sent": { en: "Message sent!", fr: "Message envoyé !", sw: "Ujumbe umetumwa!", ln: "Nsango etindami!", wo: "Bataaxal bi yónnee na!", zu: "Umlayezo uthunyelwe!" },

  // Auth
  "auth.signin": { en: "Sign In", fr: "Connexion", sw: "Ingia", ln: "Kokɔta", wo: "Dugg", zu: "Ngena" },
  "auth.signup": { en: "Create Account", fr: "Créer un Compte", sw: "Fungua Akaunti", ln: "Kofungola Compte", wo: "Sos sàmm", zu: "Dala I-Akhawunti" },
  "auth.email": { en: "Email", fr: "Email", sw: "Barua pepe", ln: "Email", wo: "Email", zu: "I-imeyili" },
  "auth.password": { en: "Password", fr: "Mot de passe", sw: "Neno la siri", ln: "Mot de passe", wo: "Baatu jàll", zu: "Iphasiwedi" },
  "auth.fullname": { en: "Full Name", fr: "Nom Complet", sw: "Jina Kamili", ln: "Nkombo mobimba", wo: "Tur bu mat", zu: "Igama Eligcwele" },
  "auth.role": { en: "I am a...", fr: "Je suis...", sw: "Mimi ni...", ln: "Nazali...", wo: "Mangi...", zu: "Ngingu..." },
  "auth.role_farmer": { en: "Farmer / Planter", fr: "Agriculteur / Planteur", sw: "Mkulima / Mpandaji", ln: "Mosali bilanga / Moloni", wo: "Ndogalkat / Sëykat", zu: "Umlimi / Umtshali" },
  "auth.role_researcher": { en: "Researcher / Expert", fr: "Chercheur / Expert", sw: "Mtafiti / Mtaalamu", ln: "Molukami / Expert", wo: "Waxtaankat / Xam-xam", zu: "Umcwaningi / Ongoti" },
  "auth.noaccount": { en: "Don't have an account?", fr: "Pas de compte ?", sw: "Huna akaunti?", ln: "Ozali na compte te?", wo: "Amul nga sàmm?", zu: "Awunayo i-akhawunti?" },
  "auth.hasaccount": { en: "Already have an account?", fr: "Déjà un compte ?", sw: "Una akaunti tayari?", ln: "Ozali na compte?", wo: "Am nga sàmm bu jëkk?", zu: "Usunayo i-akhawunti?" },
  "auth.signin_desc": { en: "Access your dashboard", fr: "Accédez à votre tableau de bord", sw: "Fikia dashibodi yako", ln: "Kɔtá na tableau na yo", wo: "Dugg ci sa tablo", zu: "Finyelela ideshibhodi yakho" },
  "auth.signup_desc": { en: "Join Mazingira Cloud", fr: "Rejoignez Mazingira Cloud", sw: "Jiunge na Mazingira Cloud", ln: "Sangana na Mazingira Cloud", wo: "Bokk ci Mazingira Cloud", zu: "Joyina i-Mazingira Cloud" },
  "auth.account_created": { en: "Account created! Welcome.", fr: "Compte créé ! Bienvenue.", sw: "Akaunti imeundwa! Karibu.", ln: "Compte esalami! Boyei malamu.", wo: "Sàmm bi sosees na! Dalal jamm.", zu: "I-akhawunti yenziwe! Siyakwamukela." },

  // Farmer
  "farmer.badge": { en: "Farmer Dashboard", fr: "Tableau de Bord Agriculteur", sw: "Dashibodi ya Mkulima", ln: "Tableau ya Mosali bilanga", wo: "Tablo bu ndogalkat", zu: "Ideshibhodi yoMlimi" },
  "farmer.title": { en: "My Farm Dashboard", fr: "Mon Tableau de Bord Agricole", sw: "Dashibodi Yangu ya Shamba", ln: "Tableau na ngai ya bilanga", wo: "Sa tablo ndogal", zu: "Ideshibhodi Yami Yokulima" },
  "farmer.subtitle": { en: "Manage your farms, scan your soil, get recommendations", fr: "Gérez vos terrains, scannez votre sol, obtenez des recommandations", sw: "Dhibiti mashamba yako, chunguza udongo wako, pata mapendekezo", ln: "Bongisa bilanga na yo, talá mabele na yo, zwa toli", wo: "Saytu sa tool yi, seet sa suuf, am digal", zu: "Phatha amapulazi akho, hlola inhlabathi yakho, thola izincomo" },
  "farmer.tab_farms": { en: "My Farms", fr: "Mes Terrains", sw: "Mashamba Yangu", ln: "Bilanga na ngai", wo: "Sa tool yi", zu: "Amapulazi Ami" },
  "farmer.tab_scans": { en: "Soil Analysis", fr: "Analyses de Sol", sw: "Uchambuzi wa Udongo", ln: "Analyse ya mabele", wo: "Xàmm suuf", zu: "Ukuhlaziywa Kwenhlabathi" },
  "farmer.tab_map": { en: "Map View", fr: "Vue Carte", sw: "Mwonekano wa Ramani", ln: "Komona carte", wo: "Xool kart", zu: "Umbono Wemephu" },
  "farmer.my_farms": { en: "My Farms", fr: "Mes Terrains", sw: "Mashamba Yangu", ln: "Bilanga na ngai", wo: "Sa tool yi", zu: "Amapulazi Ami" },
  "farmer.add_farm": { en: "Add Farm", fr: "Ajouter un Terrain", sw: "Ongeza Shamba", ln: "Bakisa elanga", wo: "Yokk tool", zu: "Engeza Ipulazi" },
  "farmer.farm_name": { en: "Farm Name", fr: "Nom du Terrain", sw: "Jina la Shamba", ln: "Nkombo ya elanga", wo: "Tur tool", zu: "Igama Lepulazi" },
  "farmer.location": { en: "Location", fr: "Localisation", sw: "Mahali", ln: "Esika", wo: "Bëj-sa-bët", zu: "Indawo" },
  "farmer.area": { en: "Area (hectares)", fr: "Superficie (hectares)", sw: "Eneo (hekta)", ln: "Surface (hectares)", wo: "Yoonu (hektaar)", zu: "Indawo (amahekthare)" },
  "farmer.crop_type": { en: "Crop Type", fr: "Type de Culture", sw: "Aina ya Mazao", ln: "Lolenge ya bilanga", wo: "Xeeti ndogal", zu: "Uhlobo Lwesitshalo" },
  "farmer.save": { en: "Save", fr: "Enregistrer", sw: "Hifadhi", ln: "Kobomba", wo: "Denc", zu: "Gcina" },
  "farmer.cancel": { en: "Cancel", fr: "Annuler", sw: "Ghairi", ln: "Kolongola", wo: "Nëbb", zu: "Khansela" },
  "farmer.no_farms": { en: "No farms registered yet.", fr: "Aucun terrain enregistré.", sw: "Hakuna mashamba yaliyosajiliwa.", ln: "Eza naino na elanga te.", wo: "Amul tool bu bindees.", zu: "Akukho mapulazi abhalisiwe okwamanje." },
  "farmer.soil_analysis": { en: "Soil Analysis", fr: "Analyse de Sol", sw: "Uchambuzi wa Udongo", ln: "Analyse ya mabele", wo: "Xàmm suuf", zu: "Ukuhlaziywa Kwenhlabathi" },
  "farmer.new_scan": { en: "New Scan", fr: "Nouvelle Analyse", sw: "Uchunguzi Mpya", ln: "Analyse ya sika", wo: "Xàmm bu bees", zu: "Ukuhlola Okusha" },
  "farmer.scan_desc": { en: "Describe your soil for AI analysis.", fr: "Décrivez votre sol pour une analyse IA.", sw: "Eleza udongo wako kwa uchambuzi wa AI.", ln: "Limbolá mabele na yo mpo na analyse ya IA.", wo: "Wàxx sa suuf ngir xàmm-xàmm AI.", zu: "Chaza inhlabathi yakho ngokuhlaziywa kwe-AI." },
  "farmer.select_farm": { en: "Select Farm", fr: "Sélectionner Terrain", sw: "Chagua Shamba", ln: "Poná elanga", wo: "Tànn tool", zu: "Khetha Ipulazi" },
  "farmer.optional": { en: "Optional", fr: "Optionnel", sw: "Si lazima", ln: "Esengeli te", wo: "Warugar", zu: "Okungenasidingo" },
  "farmer.scan_type": { en: "Scan Type", fr: "Type d'Analyse", sw: "Aina ya Uchunguzi", ln: "Lolenge ya analyse", wo: "Xeeti xàmm", zu: "Uhlobo Lokuhlola" },
  "farmer.quick_scan": { en: "Quick Scan", fr: "Analyse Rapide", sw: "Uchunguzi wa Haraka", ln: "Analyse ya noki", wo: "Xàmm bu gaaw", zu: "Ukuhlola Okusheshayo" },
  "farmer.detailed_scan": { en: "Detailed Scan", fr: "Analyse Détaillée", sw: "Uchunguzi wa Kina", ln: "Analyse ya mobimba", wo: "Xàmm bu sore", zu: "Ukuhlola Okwenabile" },
  "farmer.soil_desc": { en: "Soil Description", fr: "Description du Sol", sw: "Maelezo ya Udongo", ln: "Ndimbola ya mabele", wo: "Njaay suuf", zu: "Incazelo Yenhlabathi" },
  "farmer.soil_desc_placeholder": { en: "Describe color, texture, moisture...", fr: "Décrivez la couleur, texture, humidité...", sw: "Eleza rangi, muundo, unyevu...", ln: "Limbolá couleur, texture, humidité...", wo: "Wàxx melo, mel-mel, ndox...", zu: "Chaza umbala, isimo, umswakama..." },
  "farmer.analyzing": { en: "Analyzing...", fr: "Analyse en cours...", sw: "Inachambua...", ln: "Analyse ezali kokende...", wo: "Xàmm-xàmm nekk...", zu: "Iyahlaziya..." },
  "farmer.run_analysis": { en: "Run AI Analysis", fr: "Lancer l'Analyse IA", sw: "Fanya Uchambuzi wa AI", ln: "Lancer Analyse ya IA", wo: "Tàmbalee xàmm AI", zu: "Qalisa Ukuhlaziywa kwe-AI" },
  "farmer.no_scans": { en: "No analyses yet.", fr: "Aucune analyse.", sw: "Hakuna uchambuzi bado.", ln: "Eza naino na analyse te.", wo: "Amul xàmm.", zu: "Akukho ukuhlaziywa okwamanje." },

  // Researcher
  "researcher.badge": { en: "Researcher Hub", fr: "Hub Chercheur", sw: "Kituo cha Mtafiti", ln: "Hub ya Molukami", wo: "Sàmm waxtaankat", zu: "Isikhungo soMcwaningi" },
  "researcher.title": { en: "Data Contribution Hub", fr: "Hub de Contribution", sw: "Kituo cha Kuchangia Data", ln: "Hub ya Contribution ya données", wo: "Sàmm yokk njëlbéen", zu: "Isikhungo Sokunikela Ngedatha" },
  "researcher.subtitle": { en: "Manage your data contributions", fr: "Gérez vos contributions de données", sw: "Dhibiti michango yako ya data", ln: "Bongisa ba contributions na yo ya données", wo: "Saytu sa yokk njëlbéen yi", zu: "Phatha iminikelo yakho yedatha" },
  "researcher.total": { en: "Total Contributions", fr: "Total Contributions", sw: "Jumla ya Michango", ln: "Total ya Ba Contributions", wo: "Tollu yokk yi", zu: "Iminikelo Yonke" },
  "researcher.approved": { en: "Approved", fr: "Approuvées", sw: "Zilizoidhinishwa", ln: "Endimami", wo: "Nangu na", zu: "Egciniwe" },
  "researcher.pending": { en: "Pending", fr: "En Attente", sw: "Zinazosubiri", ln: "Ezali kozela", wo: "Xaar", zu: "Elindile" },
  "researcher.downloads": { en: "Downloads", fr: "Téléchargements", sw: "Upakuaji", ln: "Téléchargements", wo: "Yàgg", zu: "Ukulanda" },
  "researcher.my_contributions": { en: "My Contributions", fr: "Mes Contributions", sw: "Michango Yangu", ln: "Ba contributions na ngai", wo: "Sa yokk yi", zu: "Iminikelo Yami" },
  "researcher.new_contribution": { en: "New Contribution", fr: "Nouvelle Contribution", sw: "Mchango Mpya", ln: "Contribution ya sika", wo: "Yokk bu bees", zu: "Umnikelo Omusha" },
  "researcher.form_title": { en: "Submit Dataset", fr: "Soumettre un Jeu de Données", sw: "Tuma Seti ya Data", ln: "Tinda jeu de données", wo: "Yónnee njëlbéen", zu: "Thumela Iseti Yedatha" },
  "researcher.form_desc": { en: "Share research data with the community.", fr: "Partagez vos données avec la communauté.", sw: "Shiriki data za utafiti na jamii.", ln: "Kabola ba données na yo na communauté.", wo: "Séddoo sa njëlbéen ak mbooloo.", zu: "Yabelana ngedatha yocwaningo nomphakathi." },
  "researcher.dataset_title": { en: "Title", fr: "Titre", sw: "Kichwa", ln: "Titre", wo: "Tur", zu: "Isihloko" },
  "researcher.dataset_desc": { en: "Description", fr: "Description", sw: "Maelezo", ln: "Ndimbola", wo: "Njaay", zu: "Incazelo" },
  "researcher.data_type": { en: "Data Type", fr: "Type de Données", sw: "Aina ya Data", ln: "Lolenge ya données", wo: "Xeeti njëlbéen", zu: "Uhlobo Lwedatha" },
  "researcher.region": { en: "Region", fr: "Région", sw: "Eneo", ln: "Région", wo: "Gox", zu: "Isifunda" },
  "researcher.select_region": { en: "Select Region", fr: "Sélectionner", sw: "Chagua Eneo", ln: "Poná Région", wo: "Tànn gox", zu: "Khetha Isifunda" },
  "researcher.format": { en: "Format", fr: "Format", sw: "Muundo", ln: "Format", wo: "Format", zu: "Ifomethi" },
  "researcher.file_url": { en: "File URL", fr: "URL du Fichier", sw: "URL ya Faili", ln: "URL ya fichier", wo: "URL dossier", zu: "I-URL Yefayela" },
  "researcher.submit": { en: "Submit for Review", fr: "Soumettre", sw: "Tuma kwa Ukaguzi", ln: "Tinda mpo na révision", wo: "Yónnee ngir xool", zu: "Thumela Ukuze Kubuyekezwe" },
  "researcher.submitted": { en: "Submitted!", fr: "Soumis !", sw: "Imetumwa!", ln: "Etindami!", wo: "Yónnee na!", zu: "Ithunyelwe!" },
  "researcher.no_contributions": { en: "No contributions yet.", fr: "Aucune contribution.", sw: "Hakuna michango bado.", ln: "Eza naino na contribution te.", wo: "Amul yokk.", zu: "Akukho minikelo okwamanje." },

  // EcoKids
  "ecokids.title": { en: "EcoKids Sentinel", fr: "EcoKids Sentinel", sw: "EcoKids Sentinel", ln: "EcoKids Sentinel", wo: "EcoKids Sentinel", zu: "EcoKids Sentinel" },
  "ecokids.subtitle": { en: "Intelligent climate observatory — Every schoolyard becomes a resilience station", fr: "Observatoire climatique intelligent — Chaque cour d'école devient une station de résilience", sw: "Kituo cha hali ya hewa — Kila uwanja wa shule unakuwa kituo cha ustahimilivu", ln: "Observatoire ya klima — Lopango nyonso ya kelasi ekómi station ya résilience", wo: "Observatoire klima — Pénc xarala bu nekk ab bëj-sa-bët résilience", zu: "Indawo yokuhlola isimo sezulu — Zonke izinkantolo zesikole ziba iziteshi zokuqina" },
  "ecokids.stations_active": { en: "active stations", fr: "stations actives", sw: "vituo vinavyofanya kazi", ln: "ba stations actives", wo: "bëj-sa-bët yu dox", zu: "iziteshi ezisebenzayo" },
  "ecokids.students_protected": { en: "students protected", fr: "élèves protégés", sw: "wanafunzi wamelindwa", ln: "ba élèves babatelami", wo: "ndongo yi saafees", zu: "abafundi abavikelwe" },
  "ecokids.health_alerts": { en: "Real-Time Health Alerts", fr: "Alertes Santé en Temps Réel", sw: "Tahadhari za Afya kwa Wakati Halisi", ln: "Alerte ya Sante na ntango ya solo", wo: "Wérséen wér ci waxtu", zu: "Izexwayiso Zempilo Ngesikhathi Sangempela" },
  "ecokids.sensors": { en: "IoT Sensors", fr: "Capteurs IoT", sw: "Sensori za IoT", ln: "Ba capteurs IoT", wo: "Capteur IoT yi", zu: "Ama-sensor e-IoT" },
  "ecokids.ask_assistant": { en: "Ask EcoKids AI", fr: "Demander à EcoKids IA", sw: "Uliza EcoKids AI", ln: "Tuna EcoKids IA", wo: "Laaj EcoKids AI", zu: "Buza i-EcoKids AI" },
  "ecokids.quiz": { en: "🧪 Climate Quiz", fr: "🧪 Quiz Climat", sw: "🧪 Jaribio la Hali ya Hewa", ln: "🧪 Quiz ya Klima", wo: "🧪 Laaj Klima", zu: "🧪 Isivivinyo Sesimo Sezulu" },
  "ecokids.activities": { en: "📋 School Activities", fr: "📋 Activités Scolaires", sw: "📋 Shughuli za Shuleni", ln: "📋 Ba activités ya kelasi", wo: "📋 Jëf xarala", zu: "📋 Imisebenzi Yesikole" },
  "ecokids.report": { en: "📊 My Report", fr: "📊 Mon Rapport", sw: "📊 Ripoti Yangu", ln: "📊 Rapport na ngai", wo: "📊 Sa rapport", zu: "📊 Umbiko Wami" },
  "ecokids.plant_tree": { en: "🌳 Plant a Tree", fr: "🌳 Planter un Arbre", sw: "🌳 Panda Mti", ln: "🌳 Kolona Nzete", wo: "🌳 Togg garab", zu: "🌳 Tshala Isihlahla" },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("fr");

  const t = (key: string): string => {
    return translations[key]?.[lang] || translations[key]?.["en"] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
