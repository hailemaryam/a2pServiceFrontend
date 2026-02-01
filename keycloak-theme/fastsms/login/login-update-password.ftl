<#-- FASTSMS Keycloak Update Password Template -->
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayWide=false; section>
    <#if section = "form">
<div class="fastsms-root">
  <div class="left-panel">

    <div class="form-wrap">
      <h1 class="title">${msg("updatePasswordTitle")}</h1>
      <p class="subtitle">${msg("updatePasswordInstruction")}</p>

      <#if message?has_content>
        <#if message.type == "success"><div class="kc-feedback kc-success">${message.summary}</div></#if>
        <#if message.type == "warning"><div class="kc-feedback kc-warning">${message.summary}</div></#if>
        <#if message.type == "error"><div class="kc-feedback kc-error">${message.summary}</div></#if>
        <#if message.type == "info"><div class="kc-feedback kc-info">${message.summary}</div></#if>
      </#if>

      <form id="kc-passwd-update-form" action="${url.loginAction}" method="post">
        
        <div class="form-group">
          <label for="password-new">${msg("passwordNew")}</label>
          <input type="password" id="password-new" name="password-new" class="form-control" autofocus autocomplete="new-password" />
        </div>

        <div class="form-group">
          <label for="password-confirm">${msg("passwordConfirm")}</label>
          <input type="password" id="password-confirm" name="password-confirm" class="form-control" autocomplete="new-password" />
        </div>

        <div class="form-group">
            <div class="checkbox">
                <label><input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" checked> ${msg("logoutOtherSessions")}</label>
            </div>
        </div>

        <div class="submit-row" style="margin-top: 24px;">
          <button class="btn btn-primary" type="submit">${msg("doSubmit")}</button>
        </div>
      </form>
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
