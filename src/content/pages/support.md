---
title: Support
subtitle: Have a question? Need to report an issue? Want to request a new feature? Please let me know!
sections:
  - type: section
    blocks:
    - type: form
      name: support
      fields:
        - type: text
          name: name
          label: What’s your name?

        - type: email
          name: email
          label: And what’s your email address?

        - type: select
          name: category
          label: What kind of question do you have today?
          options:
            - Need help
            - Found a bug
            - Requesting a feature
            - Something else

        - type: select
          name: platform
          label: Where are you using Spell Check?
          options:
            - Android
            - Desktop
            - iOS
          optional: true

        - type: textarea
          name: message
          label: How can I help?

      submit:
        value: Send
---