Vite-Plugin-Nodemon
===================
Run a backend server in a Vite project via [Nodemon](https://github.com/remy/nodemon).


Usage
-----
Install the plugin as you would any other Vite plugin:

In `vite.config.js`:
```javascript
import {defineConfig} from 'vite';

export default defineConfig({
    plugins: [
		pluginNodemon({
			script: './server.js',
			watch: [
				'.env',
				'package.json',
				'server.js',
				'src/' + '**' + '/*.js', // Watch all JS files (we split the string up like this because those charcaters together can sometimes upset linters)
			],
			ignore: [
				'src/main.js', // Ignore the Vite main file
			],
            envInject: { // Inject these environment variables into both Vite + the process
            },
			envInjectVite: { // Inject these environment variables into Vite
				VITE_API_URL_BASE: 'http://localhost:8080',
			},
			envInjectProcess: { // Inject these environment variables into the process
				SERVER_HOST: 'localhost',
				SERVER_PORT: 8080,
			},
		}),
    ],
});
```


API
===
This NPM exposes a single function which returns a Vite plugin.

The function takes the following options:


| Option             | Type                       | Default | Description                                                                                                      |
|--------------------|----------------------------|---------|------------------------------------------------------------------------------------------------------------------|
| `script`           | `String`                   |         | File entrypoint to run as the server                                                                             |
| `delay=250`        | `Number`                   | `250`   | Delay between restarts when noticing a file change                                                               |
| `watch`            | `Array<String>` / `String` |         | Array (or single) glob of files to react to                                                                      |
| `ignore`           | `Array<String>` / `String` |         | (or single) glob of files to ignore                                                                              |
| `envInject`        | `Object`                   |         | Additional ENV variables to inject into both the outer VITE process + inner process when running in Nodemon mode |
| `envInjectVite`    | `Object`                   |         | Additional ENV variables to inject into the outer Vite instance when running in Nodemon mode                     |
| `envInjectProcess` | `Object`                   |         | Additional ENV variables to inject into the inner instance when running in Nodemon mode                          |
| `onStart`          | `Function`                 |         | Function to run on initial boot. Called as `()`                                                                  |
| `onRestart`        | `Function`                 |         | Function to run on subsequent restarts. Called as `(filesChanged:Array)`                                         |
| `onQuit`           | `Function`                 |         | Function to run on Nodemon quit. Called as `()`                                                                  |
| `onLog`            | `Function`                 |         | Function to run when Nodemon outputs log entries. Called as `(logEntry:Object)`                                  |
