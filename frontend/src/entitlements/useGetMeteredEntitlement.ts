import { useStiggContext, useMeteredEntitlement } from '@stigg/react-sdk';

// Stigg context hook to get the relevant entitlement information for a metered feature
export function useGetMeteredEntitlement(featureId: string) {
  const { refreshData } = useStiggContext();
  const { currentUsage, usageLimit } = useMeteredEntitlement({ featureId });
  const hasAccess = usageLimit !== undefined && currentUsage < usageLimit;

  return {
    currentUsage,
    usageLimit,
    hasAccess,
    refreshData,
  };
}
