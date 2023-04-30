# Load Asset

Load assets such as images, fonts, and sounds is a bit tricky at first.
Sometimes we (~~or the project-client~~) need to place all the assets under different path than the index.html file.
It means that we need to be able to load asset from a dynamic path.

Fortunately this issue already addressed by config file and dev server public path.

Now, instead of directly load an image, you have to load them by URL and put all your assets under *src/assets* folder.

**DONT**
```javascript
import logo from './img/logo.png'
this.game.load.image('logo', logo)
```
**DO**

```javascript
this.game.load.image('logo', CONFIG.BASE_ASSET_URL + '/img/logo.png')
```

this execution require `CONFIG.BASE_ASSET_URL` value which will be explained in [example](#Examples) section below

## Examples

**dev.config.json**
```json
{
    "BASE_ASSET_URL": "."
}
```
**prod.config.json**
```json
{
    "BASE_ASSET_URL": "https://my-awesome-server.com/path/to/asset"
}
```
> `.` (dot) refer to path where index.html file resides

from config above the execution script will result something like this 

**dev CONFIG**
```javascript
this.game.load.image('logo', '.' + '/img/logo.png')
```
**prod CONFIG**
```javascript
this.game.load.image('logo', 'https://my-awesome-server.com/path/to/asset' + '/img/logo.png')
```

> Always use dot (".") for *BASE_ASSET_URL* in your development. 
> 
> That way the game will be able to find your asset under the *src/assets* folder.

## Additional Details

This section will explain what happen behind the hood to enable this functionality 

### Webpack Dev Server

Webpack dev server provides ability to create a server static folder. 
If you read webpack config inside *webpack.dev.js*, you will find an option *devServer* like code below. 

```javascript
devServer: {
    contentBase: 'src/assets'
}
```

Specifying *'src/assets'* in contentBase means that any file inside *src/assets* folder will be served as static files in the dev server. 

> **Quick Example**
> 
> When dev server running . . .
> 
> If you have an image placed at `src/assets/img/logo.png`, 
> 
> it can be accessed through `localhost:8080/img/logo.png`


> **Additional Notes**
> 
> If you set your `BASE_ASSET_URL` as dot ".", 
> 
> code call of `CONFIG.BASE_ASSET_URL + '/img/logo.png'`
> 
> will result to `./img/logo.png` and fallback to `localhost:8080/img/logo.png`

### Production Build

Executing build script will build the project to `dist` folder.
Additionally, all files placed inside `src/assets` will be copied inside `dist` folder.

this configuration will make assets accessible through `BASE_ASSET_URL: '.'` similar to development case 

if there are need to place the assets elsewhere separate from application page, 
make sure to modify `BASE_ASSET_URL` value to point assets folder location.