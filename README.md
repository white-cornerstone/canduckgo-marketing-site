# 廣得好 CanDuckGo Marketing Site

Public marketing and store-compliance website for **廣得好 (CanDuckGo)**, a Cantonese stroke-order learning game for children aged 4–12.

CanDuckGo is published by **WHITE CORNERSTONE PTY LTD**. This exact legal entity name must stay consistent across the website policies, app copyright, App Store seller, and Google Play developer profile.

## Pages

- `/` — bilingual product landing page
- `/support/` — support contact and mailto form
- `/privacy/` — privacy policy
- `/terms/` — terms of use and EULA
- `/licenses/` — third-party notices and downloadable modified stroke data

## Local development

```sh
npm install
npm run dev
```

## Checks

```sh
npm run build
```

The site has no analytics, cookies, sign-up form, form backend, database, or runtime third-party assets. Support actions open the visitor's email client and send directly to `support@canduckgo.com`; the site does not store the message.

## Deployment

Pushes to `main` build and deploy the static site through GitHub Pages at `canduckgo.com`. The repository includes the Pages `CNAME`; the domain's apex DNS records must point to GitHub Pages before the site becomes reachable there.

## Asset attribution

- `CanDuckGoDisplay.ttf` is a Kosefont subset, © 2020 LXGW, licensed under SIL Open Font License 1.1.
- Noto Sans TC and M PLUS Rounded 1c are bundled through Fontsource and licensed under SIL Open Font License 1.1.
- Game screenshots and voxel models are CanDuckGo product assets.
- In-app stroke and pronunciation data credits shown on the site: Make Me a Hanzi (Arphic Public License) and rime-cantonese / CanCLID (CC BY 4.0).

The repository is public for website delivery. No license is granted for the original CanDuckGo artwork, screenshots, product copy, or source code unless stated otherwise.
