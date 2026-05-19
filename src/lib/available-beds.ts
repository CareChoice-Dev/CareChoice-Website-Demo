/**
 * Available = Total_Active_Beds__c − Total_Beds_Occupied_Permanent__c.
 * Nullish values treated as 0; never returns negative.
 */
export function calculateAvailableBeds(
  active: number | null | undefined,
  occupied: number | null | undefined,
): number {
  const a = typeof active === 'number' ? active : 0
  const o = typeof occupied === 'number' ? occupied : 0
  return Math.max(0, a - o)
}
