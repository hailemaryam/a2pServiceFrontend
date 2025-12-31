<#-- FASTSMS Keycloak Login Template -->
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">
<div class="fastsms-root">
  <div class="left-panel">


    <div class="form-wrap">
      <h1 class="title">Sign In</h1>
      <p class="subtitle">Enter your email and password to sign in!</p>

      <#if message?has_content>
        <#if message.type == "success"><div class="kc-feedback kc-success">${message.summary}</div></#if>
        <#if message.type == "warning"><div class="kc-feedback kc-warning">${message.summary}</div></#if>
        <#if message.type == "error"><div class="kc-feedback kc-error">${message.summary}</div></#if>
        <#if message.type == "info"><div class="kc-feedback kc-info">${message.summary}</div></#if>
      </#if>

      <form id="kc-form-login" action="${url.loginAction}" method="post">
        <div class="form-group">
          <label for="username">Email <span class="required">*</span></label>
          <input tabindex="1" id="username" name="username" value="${username!}" class="form-control" type="text" autofocus />
        </div>

        <div class="form-group">
          <label for="password">Password <span class="required">*</span></label>
          <div class="password-row">
            <input tabindex="2" id="password" name="password" class="form-control" type="password" autocomplete="off" />
          </div>
        </div>

        <div class="form-row">
          <label class="checkbox">
            <input type="checkbox" name="rememberMe" <#if rememberMe?? && rememberMe>checked</#if>>
            Keep me logged in
          </label>

          <#if url.loginResetCredentialsUrl??>
            <a class="forgot" href="${url.loginResetCredentialsUrl}">Forgot password?</a>
          </#if>
        </div>

        <div class="submit-row">
          <button class="btn btn-primary" name="login" type="submit">Sign in</button>
        </div>

        <#if realm.registrationAllowed?? && realm.registrationAllowed>
          <div class="signup">
            Don't have an account? <a href="${url.registrationUrl}">Sign Up</a>
          </div>
        </#if>

        <input type="hidden" id="id-hidden" name="credentialId" />
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
