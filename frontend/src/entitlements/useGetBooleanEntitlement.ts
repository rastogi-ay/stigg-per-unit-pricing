import { useBooleanEntitlement } from '@stigg/react-sdk';

// Stigg context hook to get the relevant entitlement information for a boolean feature
export function useGetBooleanEntitlement(featureId: string) {
  const { hasAccess } = useBooleanEntitlement({ featureId });
  return hasAccess;
}
