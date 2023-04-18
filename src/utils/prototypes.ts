// enable BigInt serialization when calling JSON.stringify
// eslint-disable-next-line no-extend-native, @typescript-eslint/dot-notation
BigInt.prototype['toJSON'] = function () {
  return this.toString();
};
