import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Favorites = {
  names: string[];
  toggle: (name: string) => void;
};

export const useFavorites = create<Favorites>()(
  persist(
    (set) => ({
      names: [],
      toggle: (name) => set(({ names }) => ({
          names: names.includes(name)
            ? names.filter((item) => item !== name)
            : [...names, name],
        })),
    }),
    { name: 'eco-favorites' },
  ),
);
