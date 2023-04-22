import { create } from 'zustand';

type SearchKeyStore = {
  searchKey: string;
  setSearchKey: (searchKey: string) => void;
};

export const useSearchKeyStore = create<SearchKeyStore>((set) => ({
  searchKey: '',
  setSearchKey: (keyword: string) => set(() => ({ searchKey: keyword })),
}));
