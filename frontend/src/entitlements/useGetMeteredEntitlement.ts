import { useStiggContext, useMeteredEntitlement } from '@stigg/react-sdk';

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
