<#-- FASTSMS Keycloak Reset Password Template -->
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayWide=false; section>
    <#if section = "form">
<div class="fastsms-root">
  <div class="left-panel">

    <div class="form-wrap">
      <h1 class="title">Forgot Password?</h1>
      <p class="subtitle">Enter your email or username to reset your password.</p>

      <#if message?has_content>
        <#if message.type == "success"><div class="kc-feedback kc-success">${message.summary}</div></#if>
        <#if message.type == "warning"><div class="kc-feedback kc-warning">${message.summary}</div></#if>
        <#if message.type == "error"><div class="kc-feedback kc-error">${message.summary}</div></#if>
        <#if message.type == "info"><div class="kc-feedback kc-info">${message.summary}</div></#if>
      </#if>

      <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
        
        <div class="form-group">
          <label for="username">${msg("emailInstruction")}</label>
          <input type="text" id="username" name="username" class="form-control" autofocus value="${(auth.attemptedUsername!'')}" />
        </div>

        <div class="submit-row" style="margin-top: 24px;">
          <button class="btn btn-primary" type="submit">${msg("doSubmit")}</button>
        </div>

        <div class="signup">
          <a href="${url.loginUrl}">${msg("backToLogin")}</a>
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
