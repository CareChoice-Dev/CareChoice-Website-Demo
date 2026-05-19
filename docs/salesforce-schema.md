# Salesforce UAT — Site Object Schema Discovery

**Discovered:** 2026-05-19
**Discovered by:** Claude (via `mcp__claude_ai_CareChoice_Salesforce_UAT__getObjectSchema` + `__soqlQuery`)
**Salesforce UAT instance:** see `$SALESFORCE_INSTANCE_URL` in `.env.local`
**Object API name:** `enrtcr__Site__c` (Lumary namespace). Label: *Site*. **143 fields total.**

## Active-record filter (WHERE clause)

```sql
WHERE enrtcr__Inactive__c = false
  AND SDA_Approved__c = 'Yes'
  AND Future_or_Current_Build__c = 'Current'
  AND enrtcr__Total_Active_Beds__c > 0
```

This matches **18 active SDA sites** in UAT as of discovery, across **3 distinct `SDA_Design_Standards__c` values**.

## Confirmed fields (used for SDA listing + detail)

| Need / role                       | Field API name                                       | Type           | Notes |
|-----------------------------------|------------------------------------------------------|----------------|---|
| Record ID                         | `Id`                                                 | id             | — |
| Display name                      | `Name`                                               | string         | e.g. "CC-Homes 28 Eaton Road, Mount Duneed" |
| Address line 1                    | `enrtcr__Business_Address_1__c`                      | string         | e.g. "28 Eaton Road" |
| Address line 2                    | `enrtcr__Business_Address_2__c`                      | string         | usually null |
| Suburb                            | `enrtcr__Business_Suburb__c`                         | string         | — |
| State                             | `enrtcr__Business_State__c`                          | string         | often `"VIC"`; sometimes null |
| Postcode                          | `enrtcr__Business_Postcode__c`                       | string         | — |
| Latitude                          | `enrtcr__Business_Geolocation__Latitude__s`          | double         | mostly null in UAT; populate before launch |
| Longitude                         | `enrtcr__Business_Geolocation__Longitude__s`         | double         | mostly null in UAT |
| Region (CareChoice grouping)      | `enrtcr__Site_Region__c`                             | picklist       | e.g. "CareChoice Homes", "Western", "Northern" |
| Site description / about          | `enrtcr__Site_Description__c`                        | textarea       | null in all 4 sample records — needs content team to populate |
| SDA Design Standards              | `SDA_Design_Standards__c`                            | picklist       | confirmed values: "High Physical Support", "Fully Accessible". NDIS also defines "Improved Liveability", "Robust" — present in picklist, not in sample data |
| Property type                     | `Property_Type__c`                                   | picklist       | e.g. "Shared house", "Private Home" |
| Build status                      | `Future_or_Current_Build__c`                         | picklist       | "Current" / "Future" — filter on this |
| SDA approved flag                 | `SDA_Approved__c`                                    | picklist       | filter `= 'Yes'` |
| Active flag (inverted)            | `enrtcr__Inactive__c`                                | boolean        | filter `= false`; `true` records typically include "DO NOT USE" in `Name` |
| Tenancy status                    | `enrtcr__Tenancy_Status__c`                          | picklist       | e.g. "SDA Tenancy Agreement" |
| Amenities                         | `enrtcr__Amenities__c`                               | multipicklist  | semicolon-separated values, e.g. `"Sleepover;Zoned rooms;Distress alarms"` |
| Accessibility features            | `Accessibility__c`                                   | multipicklist  | **no namespace** prefix (despite related fields having `enrtcr__`); null in all sample records — needs content team to populate |
| Total active beds                 | `enrtcr__Total_Active_Beds__c`                       | double         | confirmed; primary divisor |
| Total occupied (permanent)        | `enrtcr__Total_Beds_Occupied_Permanent__c`           | double         | confirmed |
| Total vacant (permanent) — alt    | `enrtcr__Total_Beds_Vacant_Permanent__c`             | double         | Salesforce-side cache of vacancy count; matches our app-side `calculateAvailableBeds` |
| Vacancy count (computed)          | `Total_Vacancies__c`                                 | double         | Salesforce-side aggregate |
| Vacancy percentage                | `Vacancy_Percentage__c`                              | percent        | Salesforce-side aggregate |
| Photos / floorplans (interim)     | `Sharepoint_Direct_Link__c`                          | url            | SharePoint folder URL with photos + floorplans (e.g. `https://carechoice1.sharepoint.com/sites/CareChoiceHomes/MtDuneedEaton28`). **No direct primary-photo URL field exists** — photo intake to Payload Media is the production path; for the demo, hero galleries use Payload Media populated by the content team. |
| Last modified date                | `LastModifiedDate`                                   | datetime       | available; could surface "updated" timestamp |

## Fields explicitly NOT confirmed (out of scope for Plan 1 — Plan 2 will revisit)

- **Vacancy-available-from date** — no obvious field. `enrtcr__Start_Date__c` and `enrtcr__End_Date__c` exist but appear to relate to site operating period, not vacancy availability. Likely lives on a child Vacancy/Bed object — investigate when Plan 2 needs it.
- **Direct photo URLs** — no field. Production answer: Payload Media collection with Media records linked to Site Id via a custom CMS field; demo answer: photographer intake into Payload before demo day.
- **Housemate profiles** — likely on a related Contact/Tenant object. Investigate in Plan 2.

## Notes

- The `enrtcr__` prefix marks Lumary's managed-package fields. Plain `Accessibility__c`, `SDA_Design_Standards__c`, `Sharepoint_Direct_Link__c`, etc. are CareChoice-defined fields directly on the Site object (no namespace).
- `Total_Vacancies__c` is a CareChoice computed field on the Site object. Our `calculateAvailableBeds` mirrors the same arithmetic with defensive null-handling, so the app is resilient to the field being null on partially-configured records.
- For the listing query, `LIMIT 50` is plenty (only 18 active records).

## SOQL used in `route.ts` (after Task 24)

```sql
SELECT Id, Name,
       enrtcr__Business_Address_1__c,
       enrtcr__Business_Suburb__c,
       enrtcr__Business_State__c,
       enrtcr__Business_Postcode__c,
       enrtcr__Business_Geolocation__Latitude__s,
       enrtcr__Business_Geolocation__Longitude__s,
       enrtcr__Site_Region__c,
       enrtcr__Site_Description__c,
       SDA_Design_Standards__c,
       Property_Type__c,
       enrtcr__Tenancy_Status__c,
       enrtcr__Amenities__c,
       Accessibility__c,
       Sharepoint_Direct_Link__c,
       enrtcr__Total_Active_Beds__c,
       enrtcr__Total_Beds_Occupied_Permanent__c
FROM enrtcr__Site__c
WHERE enrtcr__Inactive__c = false
  AND SDA_Approved__c = 'Yes'
  AND Future_or_Current_Build__c = 'Current'
  AND enrtcr__Total_Active_Beds__c > 0
LIMIT 50
```
