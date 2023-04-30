# Config Files

Config File are made to address configuration setting difference between project, and webpack environment.
By default, there are 3 pre-made project environment config file (development, staging, and production).
additionally, a base config that serve as global configuration across environment

Additional Environment config can be made if the need arise.
Config file need to be placed inside `config` folder, and must use `.config.json` postfix.
This config feature is provided by webpack define plugin.
Config assignment are done in `package.json` script section, when webpack command is executed with `--env.build` param

Config file that used in your current environment is base config combined with environment config.
So if you have a global config that runs in every environment, you can put that inside `base.config.json`.

> If a same key is found inside your base and environment config,
> then key value pairs in environment config will be used instead.

> it is advised to provide every KeyValue pair in base config, and it's default value.
>
> this advice is to give more clarity on every available / required configuration in the project

## Config Examples

for example, we have 3 of these config files

**base.config.json**
```json
{
  "SERVER_HOST": "http://192.0.0.1",
  "ENABLE_LOG": true
}
```
**dev.config.json**
```json
{
    "SERVER_HOST": "http://172.4.16.219:4000"
}
```
**prod.config.json**
```json
{
    "SERVER_HOST": "https://my-awesome-server.com",
    "ENABLE_LOG": false
}
```

These are the resulting `CONFIG` Value produced from config file above

**dev CONFIG**
```json
{
  "SERVER_HOST": "http://172.4.16.219:4000",
  "ENABLE_LOG": true
}
```
**prod CONFIG**
```json
{
  "SERVER_HOST": "https://my-awesome-server.com",
  "ENABLE_LOG": false
}
```

## Specify Project Environment Config to use

To specify project config, use flag `--env.build=<yourconfig>` when executing webpack or webpack dev server.

for example  `--env.build=prod` will use previously mentioned example config `prod.config.json`

| script | details |
| ------ | ------- |
| webpack-dev-server --config webpack/webpack.dev.js --env.build=dev | This command will run your dev server and use dev config (--env.build=dev)
| webpack-dev-server --config webpack/webpack.dev.js --env.build=prod --open | This command will run your dev server and use prod config (--env.build=prod)
| webpack --config webpack/webpack.prod.js --env.build=prod | This command will build your project using prod config (--env.build=prod)

> You can use *npm run scripts* to help you run those long lines. Read more about npm run [here](https://docs.npmjs.com/cli/run-script)

## Using config value

From anywhere inside your project, you can get config value by simply calling their keys.
```javascript
// index.js or anywhere in your project

console.log(CONFIG.ENABLE_LOG)
// will print true in dev and false in prod


console.log(CONFIG.SERVER_HOST)
// will print http://172.4.16.219:4000 in dev
// will print https://my-awesome-server.com in prod

// automatically added
console.log(DEVELOPMENT, PRODUCTION)
// will print (true false) if you use development webpack config (webpack.dev.js)
// will print (false true) if you use production webpack config (webpack.prod.js)
```