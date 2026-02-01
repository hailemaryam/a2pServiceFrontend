<#-- FASTSMS Keycloak Error Template -->
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "form">
<div class="fastsms-root">
  <div class="left-panel">

    <div class="form-wrap">
      <h1 class="title">${msg("errorTitle")}</h1>
      
      <div id="kc-error-message">
        <p class="subtitle">${message.summary}</p>
        
        <#if client?? && client.baseUrl?has_content>
            <div class="signup">
                <a id="backToApplication" href="${client.baseUrl}">${msg("backToApplication")}</a>
            </div>
        </#if>
      </div>

      <div class="signup" style="margin-top: 24px;">
        <a href="${url.loginUrl}">${msg("backToLogin")}</a>
      </div>
    </div>
  </div>

  <div class="right-panel">
    <div class="brand-grid"></div>
    <div class="brand-center">
      <img src="${url.resourcesPath}/img/logo.png" alt="${realm.displayName} logo" class="brand-logo" />
    </div>
  </div>
</div>
    </#if>
</@layout.registrationLayout>
