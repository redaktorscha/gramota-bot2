class TelegramAPIError extends Error {
    constructor(message) {
      super(message);
      this.name = "TelegramAPIError";
    }
  }

  module.exports = TelegramAPIError;