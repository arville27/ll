import { useUserSettingsStore } from '@/hooks/store/useUserSettingsStore';
import { PropsWithChildren } from 'react';

export const UserSettingsStoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const hydrated = useUserSettingsStore((state) => state._hydrated);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
};

export default UserSettingsStoreProvider;
