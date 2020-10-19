/**
 * @module src/tools/customErrors
 */

 /**
  * @class representing telegram error
  */
class TelegramAPIError extends Error {
  /**
   * @param {string} message - error message
   */
  constructor(message) {
    super(message);
    this.name = "TelegramAPIError";
  }
}

 /**
  * @class representing dictionary page error
  */
class GramotaRuError extends Error {
  /**
   * @param {string} message - error message
   */
  constructor(message) {
    super(message);
    this.name = 'GramotaRuError';
  }
}


module.exports = {
  TelegramAPIError,
  GramotaRuError
};