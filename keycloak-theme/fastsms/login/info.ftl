<#-- FASTSMS Keycloak Info Template -->
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "form">
<div class="fastsms-root">
  <div class="left-panel">

    <div class="form-wrap">
      <h1 class="title">${msg("infoTitle")}</h1>
      
      <div id="kc-info-message">
        <p class="subtitle">${message.summary}<#if requiredActions??><#list requiredActions>: <b><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>, </#items></b></#list><#else></#if></p>
        
        <#if actionUri??>
            <div class="submit-row" style="margin-top: 24px;">
                <a href="${actionUri}" class="btn btn-primary">${msg("proceedWithAction")}</a>
            </div>
        <#elseif skipLink??>
        <#else>
            <#if (client.baseUrl)?has_content>
                <div class="signup">
                    <a href="${client.baseUrl}">${msg("backToApplication")}</a>
                </div>
            </#if>
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
