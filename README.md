# REACT TEMPLATE PROJECT

This project is a template for React projects. It is built using Webpack. It includes React, Redux, React-Router and Material-UI.

## STRUCTURE
```
src
|-- common/
|   |-- containers/             ->  Root elements for the app. This components contains initialization code for binding 
|   |                               React and Redux, and the routes.
|   |-- store/                  ->  Files relatives to the state store (implemented with Redux).
|   |   |-- actions/            ->  Folder containing the implementation of the actions you can do to the store.
|   |   |   |-- *.js
|   |   |   `-- types/          ->  Folder containing the definition of the different types of actions you can do.
|   |   |       `-- *.js
|   |   |-- reducers/
|   |   |   |-- index.js        ->  File used to combine all the different stores (reducers in Redux terminology) 
|   |   |   |                       implemented in this folder.
|   |   |   `-- *.js            ->  Implementation of the different stores that compose the state.
|   |   `-- configure.js        ->  Configuration of the store to support the Hot Module Reloading (Don't modify).
|   |-- styles/                 ->  Folder containing the styles for the web
|   |   |-- MaterialUITheme.js  ->  Definition of the theme to use with MaterialUI components
|   |   |-- palette.scss        ->  Definition of the theme (SCSS version)
|   |   |-- Breakpoints.js      ->  Breakpoints definition for responsive designs
|   |   |-- breakpoins.scss     ->  Breakpoints definition (SCSS version)
|   |   `-- styles.scss         ->  Basic styles for the App Layout
|   |-- index.html              ->  HTML index file. Doesn't need to be modified.
|   `-- index.js                ->  Entry point for the app.
`-- components/                 ->  Folder containing the React components that conform the app. One subfolder for each.
    `-- XXXXXXXXX 
        |-- Actions             
        |   |-- types/          ->  Folder containing the definition of the different types of actions you can do.
        |   |   `-- index.js    ->  Definition of the action types you can do.
        |   `-- index.js        ->  Definition of the different actions related to this component.  
        |-- Reducer
        |   `-- index.js        ->  Implementation of the store relative to this component.
        |-- helpers             ->  Código auxiliar usado en la implementacion del reducer
        |-- img                 
        |-- index.js            ->  Definición del componente
        `-- styles.scss
```

## WEBPACK TASKS
The *package.json* includes some scripts to avoid the user from writing it every time they want to transform the code with Webpack

* `npm run serve`: starts a development server with Hot Module Reload and live reload for changes in the code.
* `npm run build:dev`: generate the development executable files in /dist.
* `npm run build:dist`: generate the distributable files, minified, uglified and unified in the folder /dist. If the folder exists it clears it's content first.

## USEFUL TOOLS
* [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi): Extension for Google Chrome. 
Allows the user to inspect the REACT components on the web with the Developer Tools.
* [Scratch JS](https://chrome.google.com/webstore/detail/scratch-js/alploljligeomonipppgaahpkenfnfkn): Extension for Google Chrome. Inserts a console where
you can try your ES6 code without transforming to ES5.
* [CORS Toggle](https://chrome.google.com/webstore/detail/cors-toggle/omcncfnpmcabckcddookmnajignpffnh): Extension for Google Chrome. Useful for testing 
REST APIs and avoid the CORS troubles.
* [Web Developer](https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm): Extension for Google Chrome. 
Adds a toolbar button with various web developer tools.
* [Material Design Pallete Generator](https://www.materialui.co/colors): Utility for creating collor palletes for theming material design elements.

## CODE STYLE GUIDES
* [JS](https://github.com/airbnb/javascript)
* [React](https://github.com/airbnb/javascript/tree/master/react)
* [CSS/SASS](https://github.com/airbnb/css)

## USEFUL DOCUMENTATION
### React
* [React HowTo](https://github.com/petehunt/react-howto)

### React-Router:
* [Simple cheat sheet with examples](http://ricostacruz.com/cheatsheets/react-router.html)

### Redux
* [Getting Started with Redux](https://egghead.io/series/getting-started-with-redux)

### Material-UI
* [Themes manager](http://www.material-ui.com/#/customization/themes)

### WebPack
* [WebPack HowTo](https://github.com/petehunt/webpack-howto)
* [React WebPack Template](https://github.com/petehunt/react-webpack-template/blob/master/webpack.config.js)
* [WebPack React Hot Reload](https://github.com/HenrikJoreteg/hjs-webpack)