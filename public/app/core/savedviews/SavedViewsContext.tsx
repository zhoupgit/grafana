import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface SavedViewsContextProps {
  isAvailable: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const SavedViewsContext = createContext<SavedViewsContextProps>({
  isAvailable: false,
  isOpen: false,
  setIsOpen: () => {},
});

export function SavedViewsContextProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SavedViewsContext.Provider value={{ isOpen, setIsOpen, isAvailable: true }}>{children}</SavedViewsContext.Provider>
  );
}

export function useSavedViewsContext() {
  return useContext(SavedViewsContext);
}
