# Rapport Technique : Migration de React Context API vers Redux Toolkit

Ce document détaille l'intégralité des modifications effectuées sur le projet **SmartSOS** pour remplacer la gestion d'état locale (React Context) par une architecture centralisée et scalable (Redux Toolkit).

---

## 1. Vue d'ensemble de l'architecture

### 🔴 Avant : Architecture Context API
- L'état était divisé et géré localement dans plusieurs *Providers* (`AuthProvider`, `VehicleProvider`).
- Ces *Providers* englobaient l'application entière comme des poupées russes.
- Chaque mise à jour de l'état (ex: l'ajout d'un véhicule) provoquait le re-rendu complet de tous les composants enfants consommateurs du contexte, même s'ils n'avaient pas besoin de cette donnée spécifique.
- La logique métier complexe et les appels asynchrones (requêtes API) étaient mélangés à l'intérieur des composants React (dans des `useEffect` et des fonctions internes).

### 🟢 Après : Architecture Redux Toolkit
- L'état est **centralisé** dans un *Store* unique, perçu comme "la source unique de vérité".
- L'état global est divisé logiquement en tranches dites *Slices* (`authSlice` et `vehicleSlice`).
- Les composants "s'abonnent" uniquement aux données précises dont ils ont besoin grâce à `useSelector`. Une mise à jour du profil utilisateur ne provoque plus le recalcul de la liste des véhicules.
- La logique asynchrone (appels API axios) est extraite des composants vers des fonctions dédiées et indépendantes appelées *Thunks*.

---

## 2. Inventaire des Fichiers

### 🛑 Fichier Supprimé
*   **`redux/reducer/userReducer.ts`** : Il s'agissait d'une ancienne tentative minimaliste d'utiliser Redux, qui a été complètement remplacée et complétée par la nouvelle structure.

### 🆕 Fichiers Créés (Le Cœur de Redux)

#### `redux/reducer/authSlice.ts`
Ce fichier est le cerveau de l'authentification.
*   **État (State)** : Gère `user`, `token`, `isLoading`, et le booléen `isAuthenticated`.
*   **Thunks (Logique Asynchrone)** : 
    *   `loginThunk`, `registerThunk` : Communiquent avec l'API (`authApi`) et sauvegardent automatiquement le token dans le stockage local du téléphone (`AsyncStorage`).
    *   `restoreSessionThunk` : Exécuté au lancement de l'app pour vérifier si un utilisateur est déjà connecté.
    *   `logoutThunk` : Nettoie le state et supprime le token local.
*   **Actions** : Gère automatiquement les statuts `pending` (chargement), `fulfilled` (succès), et `rejected` (erreur) de ces opérations.

#### `redux/reducer/vehicleSlice.ts`
Ce fichier gère l'état du "Garage" de l'utilisateur.
*   **État (State)** : Stocke le tableau complet des véhicules (`vehicles`), le véhicule actuellement sélectionné (`selectedVehicle`), et le statut de chargement global (`isLoading`).
*   **Thunks** : `fetchVehicles`, `addVehicleThunk`, `updateVehicleThunk`, `removeVehicleThunk`.
*   **Logique Métier** : Lors de la récupération initiale, si des véhicules existent mais qu'aucun n'est sélectionné, le système auto-sélectionne intelligemment le premier du tableau.

#### `redux/store.ts`
C'est le coffre-fort central de l'application. Il importe les réducteurs configurés dans les Slices et génère le fichier `store` global fourni à toute l'application. Il contient aussi les définitions de typage TypeScript fortes (`RootState`, `AppDispatch`).

#### `redux/hooks.ts`
Un fichier purement utilitaire pour TypeScript. Il exporte `useAppDispatch` et `useAppSelector` qui sont déjà pré-configurés avec les bons types, évitant aux développeurs de retaper les Types à chaque appel et offrant une autocomplétion parfaite.

---

### 🔄 Fichiers Modifiés (La Transition Douce)

Pour éviter de devoir réécrire les dizaines d'écrans de l'application (ce qui engendre des bugs), nous avons employé le patron de conception du **Wrapper** (Encapsuleur). 

#### `src/context/AuthContext.tsx` & `src/context/VehicleContext.tsx`
*   **Ce que nous avons effacé** : Tous les `createContext`, `Provider`, et la logique de gestion d'état locale avec `useState`.
*   **La ruse** : Nous avons transformé ces fichiers pour qu'ils ne soient plus que des "passerelles". Ils continuent d'exporter les fonctions exactes `useAuth()` et `useVehicles()` avec la même structure de retour.
*   **Comment ça marche** : Désormais, quand un écran appelle `useAuth().user`, ce faux contexte se tourne silencieusement vers Redux (`useAppSelector`) en coulisse. De cette manière, **strictement aucun fichier d'interface (UI) n'a eu besoin d'être modifié** pour que la migration réussisse.

#### `app/_layout.tsx` (Le point d'entrée central de l'App)
*   Les balises XML des anciens contextes `<AuthProvider>` et `<VehicleProvider>` qui encerclaient l'app ont été supprimées.
*   L'application est dorénavant encapsulée d'un composant standard `<Provider store={store}>` importé de `react-redux`.
*   Un composant `<SessionInit />` a été rajouté. Son but est d'être un gestionnaire silencieux qui, au lancement de l'application, appelle immédiatement le dispatcheur Redux pour exécuter l'action asynchrone `restoreSessionThunk`.

---

## 3. Synthèse des Avantages Apportés

1.  **Désamorçage des "Zombie Children Re-Renders"** : La performance globale est renforcée. L'application ne recalcule plus toute l'arborescence UI à chaque petite modification de données.
2.  **Séparation des préoccupations (Clean Code)** : La logique de communication réseau Axios et les logiques métiers (API) ne gangrènent plus les fichiers de l'interface graphique. Elles ont leur propre maison (les Slices).
3.  **Persistance Automatisée** : Le stockage des données local de l'utilisateur sur le téléphone a été fusionné de manière plus robuste dès l'obtention des Promesses (Promises) Axios à l'intérieur des Thunks.
4.  **Débogage Temps Réel** : Toute la machinerie est dorénavant traçable dans l'outil d'audit `Redux DevTools`, conférant aux développeurs la capacité d'observer pas-à-pas les changements d'états ("Time Travel Debugging").
