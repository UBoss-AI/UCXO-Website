# UCXO demo email handoff

Request my demo validates required fields and opens a mailto draft addressed to info@ubossai.com. The subject identifies UCXO and the company. The body includes name, work email, company, job title, size, country, and optional goals. All URI query values are encoded. The visitor reviews and sends the message in their chosen email app; opening a draft never means the request was received or sent. Form values remain available. The submit handler launches the email draft directly, with no on-page notification, status panel, reopen link, or copy-details button.

FormSubmit and recipient activation are no longer used. Native email app selection depends on the visitor's device/browser configuration. A mail handler must be configured for automatic opening. The website cannot force Outlook or detect whether a message was sent.
