# ClockLock

Stop wasting time against your will.

# Overview

This is a Google Chrome extension.

## Features

- You can limit the browsing time for specific domains
- The timer resets when the date changes

## How to Use

1. Enter the domains you want to restrict
    - Maximum of 5 domains
2. Enter the browsing time allowed per day
    - You can select from 5 minutes to a maximum of 6 hours

- `options/index.tsx`
- `contents/index.tsx`
    - Components to display on the page you want to restrict
- `background`
    - `/index.ts`
        - Measure tab usage time and save it in storage
    - `/messages/ping.ts`
        - Respond with a boolean value if the time limit is exceeded
