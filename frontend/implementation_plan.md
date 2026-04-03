# Migration de Context API vers Redux Toolkit

## Contexte

Le projet SmartSOS utilise actuellement **React Context API** pour la gestion d'état via deux providers :
- `AuthContext` — gestion de l'authentification (login, register, logout, user)
- `VehicleContext` — gestion des véhicules (CRUD, sélection, kilométrage)

Votre professeur demande de migrer vers **Redux Toolkit**. Le projet a déjà `@reduxjs/toolkit` et `react-redux` installés, avec un `userReducer` basique existant.

## Différence entre Context API et Redux

| Critère | Context API | Redux Toolkit |
|---|---|---|
| **Architecture** | Provider/Consumer intégré à React | Store centralisé externe avec slices |
| **Complexité** | Simple, peu de boilerplate | Plus structuré, nécessite slices/store/actions |
| **Performance** | Re-render tous les consumers quand le context change | Sélection fine avec `useSelector` — seuls les composants qui lisent la valeur modifiée se re-rendrent |
| **DevTools** | Aucun outil de debug dédié | Redux DevTools puissant (time-travel, inspection d'actions) |
| **Scalabilité** | Limité pour les gros projets (nesting de providers) | Excellent pour les projets complexes |
| **Middleware** | Pas de support natif | Thunks, sagas, RTK Query pour la logique async |
| **Structure** | État éparpillé dans plusieurs providers | Un seul store centralisé, divisé en slices |
| **Mutation** | Immutable via `useState`/`useReducer` | Immer intégré — on peut "muter" directement dans les reducers |
| **Cas d'usage idéal** | Petits projets, thèmes, configs | Applications moyennes/grandes, état complexe |

> [!IMPORTANT]
> **Résumé** : Context API est parfait pour passer des données simples (thème, langue, auth basique). Redux est meilleur quand l'état est complexe, partagé entre beaucoup de composants, et nécessite du debug avancé. Redux Toolkit réduit considérablement le code boilerplate par rapport au Redux classique.

## Stratégie de migration

La migration est **progressive** : on remplace les contextes par des Redux slices tout en gardant les mêmes hooks (`useAuth`, `useVehicles`) pour que les écrans n'aient quasiment pas de changements.

> [!WARNING]
> **AuthContext** contient de la logique async (AsyncStorage, API calls). Dans Redux, cette logique sera gérée par des **thunks** (fonctions async dispatched via `createAsyncThunk`).

---

## Proposed Changes

### 1. Redux — Slices & Store

#### [NEW] `redux/reducer/authSlice.ts`
Slice Redux pour l'authentification avec :
- State : `user`, `token`, `isLoading`, `isAuthenticated`
- Async thunks : `loginThunk`, `registerThunk`, `logoutThunk`, `restoreSessionThunk`
- Reducers : `updateUser`

#### [NEW] `redux/reducer/vehicleSlice.ts`
Slice Redux pour les véhicules avec :
- State : `vehicles`, `selectedVehicle`, `isLoading`
- Async thunks : `fetchVehicles`, `addVehicleThunk`, `updateVehicleThunk`, `removeVehicleThunk`
- Reducers : `setSelectedVehicle`

#### [MODIFY] [store.ts](file:///c:/Users/DELL/.gemini/antigravity/scratch/smartsos-mobile/redux/store.ts)
Ajouter les nouveaux slices et exporter les types `RootState` et `AppDispatch`.

#### [DELETE] [userReducer.ts](file:///c:/Users/DELL/.gemini/antigravity/scratch/smartsos-mobile/redux/reducer/userReducer.ts)
Remplacé par `authSlice.ts` qui est plus complet.

---

### 2. Redux — Hooks compatibles

#### [NEW] `redux/hooks.ts`
Hooks typés `useAppDispatch` et `useAppSelector` pour un usage sûr dans les composants.

---

### 3. Context → Redux wrappers (conservation de l'API existante)

#### [MODIFY] [VehicleContext.tsx](file:///c:/Users/DELL/.gemini/antigravity/scratch/smartsos-mobile/src/context/VehicleContext.tsx)
- Supprimer le provider React Context
- Remplacer `useVehicles()` par un hook qui utilise `useAppSelector` + `useAppDispatch`
- Le type `Vehicle` reste exporté comme avant → les imports dans les composants ne changent pas

#### [MODIFY] [AuthContext.tsx](file:///c:/Users/DELL/.gemini/antigravity/scratch/smartsos-mobile/src/context/AuthContext.tsx)
- Supprimer le provider React Context
- Remplacer `useAuth()` par un hook Redux
- Garder les mêmes signatures de fonctions

---

### 4. Layout — Nettoyage des Providers

#### [MODIFY] [_layout.tsx](file:///c:/Users/DELL/.gemini/antigravity/scratch/smartsos-mobile/app/_layout.tsx)
- Retirer `<AuthProvider>` et `<VehicleProvider>`
- Le `<Provider store={store}>` englobe tout (déjà partiellement en place)
- Ajouter un composant `SessionInit` pour lancer `restoreSessionThunk` au démarrage

---

### 5. Fichiers écrans et hooks

**Aucun changement nécessaire** dans les fichiers suivants car les hooks `useAuth()` et `useVehicles()` conservent la même API :
- `HomeScreen.tsx`, `VehicleListScreen.tsx`, `AddVehicleScreen.tsx`
- `MaintenanceScreen.tsx`, `PlanningScreen.tsx`, `SOSScreen.tsx`
- `HealthScreen.tsx`, `ProfileScreen.tsx`, `LoginScreen.tsx`, `RegisterScreen.tsx`
- `useVehicle.ts`, `useMileage.ts`, `useHealth.ts`, `useRecommendations.ts`
- `VehicleHealthCard.tsx`, `VehicleHeroCard.tsx`

> [!NOTE]
> La seule modification sera dans les imports du type `Vehicle` dans certains fichiers, qui sera ré-exporté depuis le même chemin pour compatibilité.

---

## Verification Plan

### Automated Tests
- `npx expo start --web` pour vérifier que l'application compile et se lance sans erreurs
- Vérifier que le login fonctionne, que les véhicules s'affichent, et que la navigation est fonctionnelle

### Manual Verification
- Tester le flux de connexion (login → dashboard → véhicules)
- Vérifier que la sélection de véhicule persiste entre les écrans
