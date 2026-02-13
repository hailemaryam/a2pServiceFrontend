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
        
        <div class="signup">
            <a id="backToApplication" href="https://fastsms.dev">${msg("backToApplication")}</a>
        </div>
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
