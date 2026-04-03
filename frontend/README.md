# 🚗 SmartSOS - L'Assistant de Bord et de Panne Intelligent

**SmartSOS** est une application mobile connectée développée avec **React Native** et **Expo**, conçue pour accompagner les conducteurs dans la gestion proactive de leurs véhicules, et pour leur offrir une assistance immédiate et géolocalisée en cas de problème sur la route (crevaison, panne moteur, accident, etc.).

---

## 📑 Table des matières
1. [À propos du projet](#à-propos-du-projet)
2. [Fonctionnalités Détaillées](#fonctionnalités-détaillées)
3. [Architecture technique](#architecture-technique)
4. [Démarrage Rapide](#démarrage-rapide)
5. [Structure du Projet](#structure-du-projet)

---

## 🎯 À propos du projet

La vocation de **SmartSOS** est de moderniser le rapport qu'ont les conducteurs à l'entretien de leurs véhicules, tout en réduisant considérablement le stress lié aux pannes.
Qu'il s'agisse de gérer le cycle de vie de l'huile moteur, de garder un œil sur le prochain contrôle technique, ou d'appeler une dépanneuse au milieu de nulle part avec sa localisation GPS précise : SmartSOS agit comme un carnet d'entretien numérique intelligent doublé d'une borne d'appel d'urgence dans la poche.

---

## ✨ Fonctionnalités Détaillées

### 🏠 1. Tableau de bord intelligent (Accueil)
Dès l'ouverture, l'application présente un cockpit sur-mesure au conducteur :
- **Aperçu contextuel** : Message d'accueil selon l'heure de la journée, affichage en évidence du "Véhicule Actif" sélectionné.
- **Indicateurs clés de performance (KPIs)** : Compteur du nombre de missions SOS déjà effectuées, nombre d'alertes en cours, d'entretiens, etc.
- **Système de recommandations prédictives** : En fonction du kilométrage renseigné, l'application calcule et pousse des recommandations (ex: *"Vidange huile moteur à prévoir dans 1500 km"*).
- **Raccourcis intelligents** : Accès direct vers les pages de Profil, Diagnostic IA, Véhicules, etc.

### 🚨 2. Assistance d'urgence géolocalisée (SOS)
La fonctionnalité critique de l'application :
- **Bouton d'alerte** : Un bouton permanent au centre de la barre de navigation.
- **Qualification rapide de l'anomalie** : L'utilisateur sélectionne parmi des pannes types (Moteur, Batterie, Pneus, Clés, Accident...) pour qualifier le besoin en équipement du dépanneur.
- **Localisation GPS automatique** : Récupération stricte de la position (`lat/lon`) de l'utilisateur via le module de localisation natif du smartphone.
- **Suivi post-SOS (Tracking)** : Après l'appel de détresse, l'application affiche un écran de suivi indiquant :
  - Le nom du dépanneur assigné et son numéro de téléphone.
  - La plaque d'immatriculation du camion d'intervention.
  - L'heure estimée d'arrivée (ETA) en temps réel.

### 🤖 3. Diagnostic IA - L'assistant mécanique
Un Chatbot intégré aide les conducteurs à interpréter leurs symptômes mécaniques :
- **Suggestions de problèmes courants** : "Bruit au freinage", "Voyant huile allumé"...
- **Analyse des requêtes** : L'IA identifie les mots-clés du conducteur (ex: *température*, *freins*, *démarrage*) et réagit instantanément avec un conseil ciblé, expliquant si le véhicule doit être arrêté ou s'il s'agit d'un examen de routine.
- **Interface conversationnelle fluide** : Historisation locale des messages, effet "typing" (l'IA écrit...), adaptation du clavier.

### 🚙 4. Garage Virtuel & Multi-véhicules
L'utilisateur peut gérer 1 à *n* véhicules dans son compte :
- **Fiches descriptives complètes** : Marque, Modèle, Année, Immatriculation, VIN (numéro de châssis), Kilométrage actuel, Type de carburant (Thermique, Hybride, Électrique).
- **CRUD Complet** : Ajout, modification, suppression facile des véhicules depuis l'onglet dédié.
- **Concept du "Véhicule principal"** : L'utilisateur sélectionne sur quel véhicule il roule actuellement, afin que le tableau de bord et les règles métier s'adaptent à ce dernier.

### 👤 5. Gestion de Profil
- **Espace utilisateur** : Données personnelles de base (Nom complet, Email, Téléphone).
- **Système de paramétrages simples** : Opt-in / Opt-out des notifications pour l'entretien et/ou pour le suivi de secours (SOS).

---

## 🛠️ Architecture technique

- **React Native & Expo** : Le framework de base, garantissant une construction cross-platform (iOS, Android, Web) robuste.
- **Expo Router** : Le système de routage de nouvelle génération d'Expo (File-based Routing). Les URLs matchent précisément la hiérarchie de fichiers du dossier `app/` (Navigations par onglets et Stack intégrées).
- **TypeScript** : Typage statique et rigoureux pour garantir un code modulaire sans erreurs invisibles à la compilation.
- **React Context API** : Utilisation de Contextes personnalisés (`AuthContext`, `VehicleContext`) permettant la gestion de l'état global et abstrayant la logique métier (connexion factice, opérations asynchrones de sauvegarde de flotte) de la couche Visuelle.
- **Hooks Modernes** : Séparation stricte des préoccupations à travers les hooks React modernes.

---

## 📂 Structure du Projet

L'architecture du dossier a été conçue selon les meilleures conventions hybrides (Expo Router + logique externe) :

```text
smartsos-mobile/
├── app/                  # Routeur Expo (File-based routing)
│   ├── _layout.tsx       # Root layout - Observateurs (Authentification) & Context Providers
│   ├── (auth)/           # Stack publique : Connexion, Inscription
│   └── (tabs)/           # Stack privée (Tabs) : Accueil, SOS, Profil, Flotte...
│       └── vehicles/     # Nested Stack pour la vue de détail / ajout d'une voiture
├── src/                  # Code source : Logique métier et Interfaces
│   ├── components/       # Composants réutilisables UI (Boutons, Input, Cards...)
│   ├── context/          # Contextes globaux (Authentification, Magasin de Véhicules)
│   ├── screens/          # Composants de Page (Appelés depuis le routeur app/)
│   ├── services/         # API, services externes (Mock API SOS)
│   └── theme/            # Design System System (Couleurs, Typographie, Espacements)
├── assets/               # Ressources statiques (Images, polices locales)
├── package.json          # Dépendances Node.js (Expo Router, Vector Icons, etc.)
└── app.json              # Configuration globale Expo (Nom de l'app, icônes, slug)
```

**Note essentielle sur l'architecture (`app/` vs `src/`)** :  
Même avec le `file-based routing` de Expo Router (`app/`), **il est hautement recommandé comme meilleure pratique de garder le dossier `src/` séparé**. 
Le dossier `app/` ne doit contenir *uniquement* que ce qui sert à créer le lien URL / Routage. Toute la complexité visuelle (les vraies vues d'écrans), ainsi que toute la logique pure (services, state form, data context) reste isolée dans `src/`. Ainsi, le cycle de vie applicatif métier n'est pas pollué par les règles du routeur !

---

## 🚀 Démarrage Rapide

1. **Installer les dépendances :**
```bash
npm install
```

2. **Lancer le serveur Expo :**
```bash
npx expo start -c
```
> Le flag `-c` (clear) est recommandé lors des changements massifs de routeurs pour nettoyer le cache de Metro Bundler.

3. **Environnement de test :**
Saisir n'importe quelle adresse email avec le mot de passe de test prédéfini pour accéder à l'interface principale, ou cliquer sur s'inscrire pour créer une entité utilisateur factice.
