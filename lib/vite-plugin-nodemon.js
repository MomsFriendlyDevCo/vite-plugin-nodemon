 import nodemon from 'nodemon';

/**
* Run Nodemon in a sub-process and have it run a server
*
* @param {Object} options Additional options to mutate behaviour
* @param {String} options.script File entrypoint to run as the server
* @param {Number} [options.delay=250] Delay between restarts when noticing a file change
* @param {Array<String>|String} [options.watch] Array (or single) glob of files to react to
* @param {Array<String>|String} [options.ignore] Array (or single) glob of files to ignore
*
* @param {Object} [options.envInject] Additional ENV variables to inject into both the outer VITE process + inner process when running in Nodemon mode
* @param {Object} [options.envInjectVite] Additional ENV variables to inject into the outer Vite instance when running in Nodemon mode
* @param {Object} [options.envInjectProcess] Additional ENV variables to inject into the inner instance when running in Nodemon mode
*
* @param {Function} [options.onStart] Function to run on initial boot. Called as `()`
* @param {Function} [options.onRestart] Function to run on subsequent restarts. Called as `(filesChanged:Array)`
* @param {Function} [options.onQuit] Function to run on Nodemon quit. Called as `()`
* @param {Function} [options.onLog] Function to run when Nodemon outputs log entries. Called as `(logEntry:Object)`
*
* @returns {VitePlugin}
*/
export default function vitePluginNodemon(options) {
	let settings = {
		// Basic passthru options
		script: null,
		delay: 250,
		ignore: null,
		watch: null,

		// Env extending
		envInject: null,
		envInjectVite: null,
		envInjectProcess: null,

		// Event handling
		onStart: ()=> {},
		onRestart: files => {}, // eslint-ignore-line
		onQuit: ()=> {},
		onLog: entry => {}, // Or something like console.log('NODEMON>', entry.colour),
		...options,
	};

	process.nodemonInstance ||= nodemon({ // Only boot Nodemon if its not already running
		delay: settings.delay,
		ignore: settings.ignore,
		script: settings.script,
		watch: settings.watch,
		...(settings.envInject || settings.envInjectProcess && {
			env: {
				...settings.envInject,
				...settings.envInjectProcess,
			},
		}),
		execOptions: {},
	})
		.on('start', settings.onStart)
		.on('restart', settings.onRestart)
		.on('quit', settings.onQuit)
		.on('log', settings.onLog)

	// Merge environment variables
	Object.assign(process.env, settings.envInject, settings.envInjectVite);

	return {
		name: 'nodemon',
		apply: 'serve', // Only run on serve rather than each build
	};
}
