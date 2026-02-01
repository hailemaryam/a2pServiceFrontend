<#-- FASTSMS Keycloak Registration Template -->
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">
<div class="fastsms-root">
  <div class="left-panel">

    <div class="form-wrap">
      <h1 class="title">Create Account</h1>
      <p class="subtitle">Please fill in the details below to register. </p>

      <#if message?has_content>
        <#if message.type == "success"><div class="kc-feedback kc-success">${message.summary}</div></#if>
        <#if message.type == "warning"><div class="kc-feedback kc-warning">${message.summary}</div></#if>
        <#if message.type == "error"><div class="kc-feedback kc-error">${message.summary}</div></#if>
        <#if message.type == "info"><div class="kc-feedback kc-info">${message.summary}</div></#if>
      </#if>

      <form id="kc-register-form" action="${url.registrationAction}" method="post">
        
        <div class="form-row" style="gap: 20px; margin-bottom: 22px;">
          <div class="form-group" style="width: 100%; margin-bottom: 0;">
            <label for="firstName">${msg("firstName")}</label>
            <input type="text" id="firstName" class="form-control" name="firstName" value="${(register.formData.firstName!'')}" />
          </div>

          <div class="form-group" style="width: 100%; margin-bottom: 0;">
            <label for="lastName">${msg("lastName")}</label>
            <input type="text" id="lastName" class="form-control" name="lastName" value="${(register.formData.lastName!'')}" />
          </div>
        </div>

        <div class="form-group">
          <label for="email">${msg("email")}</label>
          <input type="text" id="email" class="form-control" name="email" value="${(register.formData.email!'')}" autocomplete="email" />
        </div>

        <div class="form-group">
          <label for="user.attributes.phoneNumber">${msg("phoneNumber")}</label>
          <input type="text" id="user.attributes.phoneNumber" class="form-control" name="user.attributes.phoneNumber" value="${(register.formData['user.attributes.phoneNumber']!'')}" />
        </div>

        <#if !realm.registrationEmailAsUsername>
            <div class="form-group">
                <label for="username">${msg("username")}</label>
                <input type="text" id="username" class="form-control" name="username" value="${(register.formData.username!'')}" autocomplete="username" />
            </div>
        </#if>

        <#if passwordRequired??>
            <div class="form-group">
                <label for="password">${msg("password")}</label>
                <input type="password" id="password" class="form-control" name="password" autocomplete="new-password" />
            </div>

            <div class="form-group">
                <label for="password-confirm">${msg("passwordConfirm")}</label>
                <input type="password" id="password-confirm" class="form-control" name="password-confirm" />
            </div>
        </#if>

        <#if recaptchaRequired??>
            <div class="form-group">
                <div class="g-recaptcha" data-sitekey="${recaptchaSiteKey}"></div>
            </div>
        </#if>

        <div class="submit-row" style="margin-top: 24px;">
          <button class="btn btn-primary" type="submit">${msg("doRegister")}</button>
        </div>

        <div class="signup">
          Already have an account? <a href="${url.loginUrl}">${msg("backToLogin")}</a>
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
