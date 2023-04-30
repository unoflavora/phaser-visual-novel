# Template Overview

## Directory Structure

| Name                | Description                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| config              | Contains Project environment scoped configuration                                              |
| dist                | Contains build result / pack result (shown after webpack build command is executed)            |
| src                 | Source File including assets file. more like Assets Folder of unity 3d Project                 |
| src/assets          | non-script related assets, (e.g. sprite, audio, etc)                                           |
| src/css             | css file for index.html                                                                        |
| src/js/assetLibrary | contain asset library that contains key and corresponding asset path                           |
| src/js/def          | data type definition for template                                                              |
| src/js/module       | Template Provided module that crafted based on project experience of other programmer          |
| src/js/scene        | Game Implementation where most your development process take place                             |
| src/index.js        |  Initiation Script / starting script to start phaser 3 game and it's base configuration        |
| webpack             | Contains webpack configuration files                                                           |
| .babelrc            | babel configuration                                                                            |
| index.html          | page where the game runs. it also packed with all other assets on build and run                |
| package.json        | project information, and project dependencies, refer to nodejs docs for more info.             |
| tsconfig.json       | typescript configuration  (haven't used type script as a whole only used for type referencing) |

## Installed Packages Dependencies

- Uses Babel, and it's plugin to enable backward compatibility with pre-ES6 script
- uses webpack plugin to load files to pack, and add additional functionality to optimize pack result

## Execution Flow

### NPM

1. `npm run` execute command within package.json
2. package.json defined script launch webpack
3. webpack launched with pre-defined configuration script to launch its environment specific configuration

### Webpack

4. base config (webpack.common.js) is called.
5. config file loaded through base config script
6. environment specific configuration merged with base config
7. generated bundled script / deployed dev server

### Index.html / Phaser Application

1. load `index.html`
2. launch `index.js`
3. launch `BootScene` (as it's first scene to load)

## Webpack Configurations

[**Webpack Concepts**](https://v4.webpack.js.org/concepts/)

below are config done within webpack in the compiling process.

> this information isn't complete

### Base

- set `entry` point with name `app` from `src/index.js`
- `modules` :
    - `babel-loader` to transpile later ES `.js` script to ES2015 compatible script
    - `raw-loader` to load `.vert` and `.frag` (unknown reason)
    - `file-loader` to load images (`.gif`, `.jpg`, etc) and `.xml` files
- `plugins` :
    - `webpack.DefinePlugin` define field that can be accessed globally.
      Defined Field :
        - `CONFIG` contain both base config and environment specifc config that specified through `—env.build=*name*` argument on webpack execution
        - `CANVAS_RENDERER` and `WEBGL_RENDERER` with unknown purposes
    - `html-webpack-plugin` generate html 5 that attached with compiled (packed script) using `index.html` as it's template

### Dev

- `mode` =`development`  to trigger webpack dev server deployment
- `devtool` = `eval-source-map` for easier debugging purposes so it display base script instead of packed script
- `devServer` configure dev server
    - `contentBase` = `src/assets` make `src/assets` accessible from page root
- `modules` : add css loader to add css within webpack which is called within index.js (can be moved to base ?)
- `plugins` :
    - `webpack.DefinePlugin`
        - `DEVELOPMENT` = `true`
        - `PRODUCTION` = `false`

### prod

- `mode` = `production`
- `output` : set output directory to `dist` directory
- `performance` : (unknown configuration)
- `optimization`: (unknown configuration)
- `plugins` :
    - `JavaScriptObfuscator` [Details . . .](https://github.com/javascript-obfuscator/webpack-obfuscator)
    - `CleanWebpackPlugin` [Details . . .](https://www.npmjs.com/package/clean-webpack-plugin)
    - `webpack.DefinePlugin`
        - `DEVELOPMENT` = `false`
        - `PRODUCTION` = `true`
    - `MiniCssExtractPlugin` [Details . . .](https://webpack.js.org/plugins/mini-css-extract-plugin/)
    
