/**
 * Logger module
 * @module Logger
 */
import Raven from 'raven-js'
import CONFIG from '../../config.json'

/**
 * Logger instance
 * @type {Logger}
 * @private
 */
let __instance = null;

/**
 * Definition of the different levels of logging
 * @readonly
 * @enum {Symbol}
 * @type {Object}
 */
const LEVELS = Object.freeze({
    ERROR : Symbol('[ERROR]'),
    WARN : Symbol('[WARN]'),
    LOG : Symbol('[LOG]'),
    INFO : Symbol('[INFO]')
});

/**
 * Logger implementation
 */
export default class Logger {
    constructor(){
        if(!__instance) {
            __instance = this
            //Raven.config(CONFIG.sentry.url).install()
        }

        return __instance
    }

    /**
     * Returns a singleton instance of the Logger
     * @type {Logger}
     */
    static get instance(){
        return new Logger()
    }


    /**
     * Log a message if the level of logging from the app contains the level specified in the function call.
     * @param {Symbol} [level = LEVELS.LOG] The level in which you want to log this type of error.
     * @param message The message you want to log
     * @param [exception = null] The exception generated
     */
    log(level = LEVELS.LOG, message, exception = null){
        switch(level){
            case LEVELS.INFO:
                console.info(message);
                /*Raven.captureMessage(message, {
                    level: 'info'
                })*/
                break;
            case LEVELS.WARN:
                console.warn(message);
                /*Raven.captureMessage(message, {
                    level: 'warn'
                })*/
                break;
            case LEVELS.ERROR:
                console.error(message, exception);
                /*Raven.captureMessage(message,{
                    level: 'error'
                })
                Raven.captureException(exception)*/
                break;
            default:
                console.log(message);
                /*Raven.captureMessage(message, {
                    level: 'info'
                })*/
                break;
        }
    }
}

export {
    /**
     * Logging levels
     * @enum {Symbol}
     */
    LEVELS,
    /**
     * Logger singleton implementation
     */
    Logger
}
