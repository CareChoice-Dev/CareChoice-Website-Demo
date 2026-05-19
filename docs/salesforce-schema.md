# Salesforce UAT — Site Object Schema Discovery

**Discovered:** [TBD — fill in when Task 24 is run]
**Discovered by:** [TBD]
**Salesforce UAT instance:** see `$SALESFORCE_INSTANCE_URL` in `.env.local`

## Known fields (confirmed before week 1 build)

| Field API name                              | Type    | Purpose                          |
|---------------------------------------------|---------|----------------------------------|
| `enrtcr__Total_Active_Beds__c`              | Number  | Total active beds at the site    |
| `enrtcr__Total_Beds_Occupied_Permanent__c`  | Number  | Beds occupied permanently        |
| `Name`                                      | Text    | Site name                        |
| `Id`                                        | ID      | Salesforce record ID             |

Available beds = `Total_Active_Beds__c` − `Total_Beds_Occupied_Permanent__c`

## Fields to discover during Task 24

Use either:
- Claude Code MCP tool: `mcp__claude_ai_CareChoice_Salesforce_UAT__getObjectSchema` with `objectName: "Site"`
- Salesforce CLI: `sf sobject describe -s Site -o <username>`

Discover and document:

| Need                          | Likely field | Confirmed name |
|-------------------------------|--------------|----------------|
| Address line 1                |              |                |
| Suburb                        |              |                |
| State                         |              |                |
| Postcode                      |              |                |
| Region (e.g. Geelong, North)  |              |                |
| Design category (e.g. HPS)    |              |                |
| Active status flag            |              |                |
| Vacancy from date             |              |                |
| Site description / about      |              |                |
| Primary photo URL             |              |                |
| Additional photo URLs         |              |                |
| Floorplan URL                 |              |                |
| Latitude                      |              |                |
| Longitude                     |              |                |

## SOQL query template

```sql
SELECT Id, Name,
       enrtcr__Total_Active_Beds__c,
       enrtcr__Total_Beds_Occupied_Permanent__c,
       [TBD address fields],
       [TBD design category],
       [TBD photo refs]
FROM Site
WHERE [TBD active criteria]
LIMIT 50
```

## Notes

- The `enrtcr__` prefix indicates Lumary's managed package namespace.
- Some fields might be on related child objects (e.g. `SiteContact__r`, `SitePhoto__r`) — investigate during discovery.
- Confirm read scope of the Connected App covers all needed fields.
