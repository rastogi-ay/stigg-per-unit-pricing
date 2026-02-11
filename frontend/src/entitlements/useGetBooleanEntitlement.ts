import { useBooleanEntitlement } from '@stigg/react-sdk';

export function useGetBooleanEntitlement(featureId: string) {
  const { hasAccess } = useBooleanEntitlement({ featureId });

  return {
    hasAccess,
  };
}
