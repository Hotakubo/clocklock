# ClockLock

This is a Google Chrome extension.

Limit the time spent on websites to reduce unwanted time and focus on what truly matters.

You can always disable this extension or find ways around it, but even a slight inconvenience is enough to make you lose interest.

## Features

- You can limit the browsing time for specific domains
- The timer resets when the date changes

## How to Use

1. Enter the domains you want to restrict
    - Maximum of 5 domains
    - You can specify subdomains using an asterisk in the domain
2. Enter the browsing time allowed per day
    - You can select from 5 minutes to a maximum of 6 hours

## Structure

- `options/index.tsx`
    - Browser Extension Pages
    - `onSave` method is the main logic
- `popup/index.tsx`
    - Popup Pages
- `contents/index.tsx`
    - Components to display on the page you want to restrict
    - `checkOpenTabs` method is the main process
- `background`
    - `/index.ts`
        - Measure tab usage time and save it in storage
    - `/messages/ping.ts`
        - Respond with a boolean value if the time limit is exceeded

## Develop

1. `npm run dev`
1. `Developer mode` turn on of Chrome
1. Upload `build/chrome-mv3-dev` to `Load unpacked`

## Publish

1. Change `package.json` version
1. `npm run build -- --zip`
1. Upload `build/chrome-mv3-prod.zip`
