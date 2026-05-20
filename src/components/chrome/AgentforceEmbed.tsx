import { getPayload } from 'payload'
import config from '@payload-config'
import Script from 'next/script'
import { ChatStub } from './ChatStub'

interface SiteSettingsShape {
  agentforceDeploymentId?: string
  agentforceOrgId?: string
}

export async function AgentforceEmbed() {
  const payload = await getPayload({ config })
  const settings = (await payload.findGlobal({ slug: 'site-settings' })) as SiteSettingsShape

  const deploymentId = settings.agentforceDeploymentId
  const orgId = settings.agentforceOrgId

  if (!deploymentId || !orgId) {
    return <ChatStub />
  }

  // Real Embedded Service Deployment snippet.
  // The exact `initEmbeddedSvc` arguments come from Salesforce's Service Embedded Setup wizard.
  // Cam will provide the snippet; the wrapper logic below is the standard pattern.
  return (
    <>
      <Script
        src="https://service.force.com/embeddedservice/5.0/esw.min.js"
        strategy="lazyOnload"
      />
      <Script id="agentforce-init" strategy="lazyOnload">
        {`
          var initESW = function(gslbBaseURL) {
            if (!window.embedded_svc) return;
            window.embedded_svc.settings.displayHelpButton = true;
            window.embedded_svc.settings.language = 'en-AU';
            window.embedded_svc.init(
              'https://carechoice.my.salesforce.com',
              'https://care-choice-website-demo.vercel.app',
              gslbBaseURL,
              '${orgId}',
              'CareChoice_Demo',
              {
                baseLiveAgentContentURL: 'https://service.force.com/content',
                deploymentId: '${deploymentId}',
                buttonId: '${deploymentId}',
                baseLiveAgentURL: 'https://d.la1-c1cs-iad.salesforceliveagent.com/chat',
                eswLiveAgentDevName: 'CareChoice_Demo',
                isOfflineSupportEnabled: false
              }
            );
          };
          if (!window.embedded_svc) {
            var s = document.createElement('script');
            s.setAttribute('src', 'https://service.force.com/embeddedservice/5.0/esw.min.js');
            s.onload = function() { initESW(null); };
            document.body.appendChild(s);
          } else {
            initESW('https://service.force.com');
          }
        `}
      </Script>
    </>
  )
}
