# UCXO demo request form

User approved the local review and authorized production deployment and GitHub push.

Header button links to /book-a-demo/ on every page. The page uses Hone's contact-flow pattern and original UCXO styling informed by 21st.dev Contact Form and Aceternity input treatments. No additional component dependencies are installed.

Delivery uses FormSubmit AJAX at https://formsubmit.co/ajax/info@ubossai.com. FormSubmit must send a one-time activation email to info@ubossai.com, and the inbox owner must follow its activation link before relying on delivery. The confirmation email may appear in spam. A successful API acceptance does not itself prove inbox delivery. Before relying on customer delivery, submit a clearly marked test through the deployed domain, activate the recipient, and confirm a second test arrives. Do not use actual customer enquiries for setup. No delivery test or activation was performed during the local design review.

Fields: first name, last name, work email, company, job title, company size, country, optional goals. Native required/email validation runs before submission. Honeypot, duplicate-submit guard, 20-second timeout, provider response checking, retained inputs on errors, email fallback, and success state are implemented. Reply-To is the visitor's email. Automatic visitor emails and calendar booking are not configured; the UCXO team follows up manually. Never describe the enquiry as a confirmed scheduled meeting.

References: https://hone.com/contact-sales/ ; https://21st.dev/@kevingirelli/components/contact-form ; https://ui.aceternity.com/components/signup-form ; https://formsubmit.co/documentation ; https://formsubmit.co/ajax-documentation
