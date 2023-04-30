# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[//]: <> (Remove Line Below on Use)

## [unreleased]

## [3.5.1] 23-03-2022

- remove plural on modules and scenes

## [3.5.0] 15-02-2022

- Upgrade to webpack 5
- Fix Module Alias
- Fix Object Types
- Add Phaser Module D.ts
- Move index.d.ts & custom.d.ts to types folder
- add plural 's' to module and scene folders
- Fix yaml gcp deployment

## [3.4.1] 27-07-2021

- add global type definition in index.d.ts

## [3.4.0] 27-07-2021

- implement eslint
- implement directory naming standards (FileName: PascalCase, DirectoryName: camelCase)
- implement webpack alias for shorter import
- cleanup screen utility controller

## [3.3.2] 21-06-2021

- update readme improve documentation

## [3.3.1] 16-03-2021

- AWS deployment script hotfix

## [3.3.0] 16-02-2021

- AWS deployment script

## [3.2.1] 25-01-2021

**Audio Hotfix**

### Changes

- rename config variable `AUDIO_ACTIVE` to `IS_AUDIO_MUTED`

## [3.2.0] 04-01-2021

### Addition

- bug report template based on QA
- auto build & deploy ci script (GCP)

### Changes

- cleanup webpack config
- copy build asset through webpack plugin
- cleanup asset load scripts

### Fixes

- fix vulnerability dependency in npm

## [3.1.0] 18-11-2020

### Addition

- add jsonp in prod webpack config (based on jdid deployment problems)
- add wrapper in html and css
- add template version badge in readme
- add changelog

### Changes

- re-organize folder structure and renaming
- cleanup webpack scripts
- cleanup index.js scripts
- improve debug scene structure
- improve and cleanup audio controller
- remove constraint module
