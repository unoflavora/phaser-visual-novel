 # Template Phaser

> ![template version](https://img.shields.io/badge/Phaser_Template-3.4.1-brightgreen)


*Phaser Starting Project* is a template to improve browser games development. 
It consists of [phaserjs](https://phaser.io/phaser3) as a game framework, 
and [webpack](https://webpack.js.org/) module to enhance development process.

This template use npm as package manager, thus requires you to have [nodejs](https://nodejs.org/en/) installed. 
You can fork / copy this template to your working directory, 
don't forget to change your **project name** and **version** under `package.json` file.

### Template Usage Details

* [Template Overview](docs/template-overview.md)
* [Using Config File](docs/config-files.md)
* [Loading Asset](docs/loading-assets.md)

## Quickstart
1. Download this repo
2. Install all your dependencies by run `npm i`
3. Run your dev server by `npm run dev`
4. Add, or Modify project content 

## CLI

In `package.json` file and section `scripts` listed handy commands to help your development process. You can add more if needed.

| script                    | details                                                   |
| ------------------------- | --------------------------------------------------------- |
| `npm run dev`             | Run webpack development server in port 8080               |
| `npm run build::prod`     | Build your project into `dist/` folder                    |
| `npm run server::dist`    | Run static server from your `dist/` folder in port 8007   |

> in the current version, don't use `import Phaser from 'phaser'` in any source files. 
> 
> Because we will use phaser script from cdn under index.html file.
> 
> Manually importing Phaser will result in phaser script being included in the bundle and increase build file size.

## Bug Reporting

Details Bug :
---
<!-- Jelaskan secara detail terkait bug yang terjadi
--->
***

Detail Information :
---
<!--- Berisi bukti saat bug terjadi atau saat reproduce bug seperti:
1. Device : (Device yang digunakan saat tes atau saat menemukan bug)
2. User ID / Username: (Isi jika ada)
3. Screenshot Bug
4. Link Video Screenrecorder cara memunculkan bug (Video upload dulu ke Google/OneDrive)
--->
***

Reproduce :
---
<!--Jelaskan step by step cara reproduce bug, contoh :
1. Login Facebook
2. Masukkan Email dan Password
3. Muncul Pop Up Reward dari Login Facebook
4. Matikan Koneksi
5. Tekan tombol Ok di Pop Up Reward
6. Muncul pop up reconnect
7. Nyalakan Koneksi
8. Tekan tombol ok di pop up reconnect
9. Reward tidak masuk
--->  
***
