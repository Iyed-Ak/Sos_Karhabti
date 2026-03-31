import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// ─── Typed Hooks ──────────────────────────────────────────────────────────────
// Utilisez ces hooks à la place de useDispatch / useSelector pour un typage sûr.

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
