class TelegramAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = "TelegramAPIError";
  }
}


class GramotaRuError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GramotaRuError';
  }
}


module.exports = {
  TelegramAPIError,
  GramotaRuError
};