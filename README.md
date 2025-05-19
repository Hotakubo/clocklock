# ClockLock

Stop wasting time against your will.

# Overview

This is a Google Chrome extension.

## Features

- You can limit the browsing time for specific domains
- Tabs playing audio are also counted as being browsed
- The count resets at 11:59 PM

## How to Use

1. Enter the domains you want to restrict
    - Maximum of 5 domains
2. Enter the browsing time allowed per day
    - You can select from 30 minutes to a maximum of 6 hours
3. Press save
    - The time when you first press the button becomes the start time

## Structure

- options.tsx
    - Input domains and time limits and save them

# CLI

- `npm create plasmo`
