# Agentforce Setup (Cam's checklist)

For the demo to use the real Agentforce chat (instead of the polished mock), we need three things from the Salesforce side:

## What we need

1. **Agentforce agent trained**
   - Knowledge articles for CareChoice services exported from Salesforce Knowledge
   - Agent configured to answer questions about: services, SDA homes, NDIS/TAC/WorkSafe pathways, enquiry process
   - Tested in Salesforce internal preview before exposing externally

2. **Embedded Service Deployment**
   - Setup → Embedded Service Deployments → new deployment for CareChoice Demo
   - Allowlist `care-choice-website-demo.vercel.app` as embedded domain
   - Snippet generator outputs the `initEmbeddedSvc(...)` arguments — we need the **Deployment ID** and **Salesforce Organization ID** specifically

3. **CORS whitelist**
   - Setup → CORS → add `https://care-choice-website-demo.vercel.app` if not already

## Where to enter them in Payload

Once Cam provides the IDs:

1. Open `/admin` → Globals → Site Settings
2. Fill `agentforceDeploymentId` and `agentforceOrgId`
3. Save

Within 10 minutes, the real Agentforce widget replaces the mock on every page.

## If Cam isn't ready by demo day

The polished mock stands in. It has canned answers to the 5 most-likely demo questions (SIL, find-a-home, TAC/WorkSafe, cost, enquiry). Demo line: "We'll switch this to a real Agentforce instance — same Embedded Service Deployment Cam uses for participant communications — once the Salesforce team finishes the knowledge-base export. For today, the responses are canned but the integration shape is right."
