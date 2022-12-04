// enable BitInt serialization
BigInt.prototype["toJSON"] = function () {
  return this.toString();
};