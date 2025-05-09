const MOBILE_PATTERN = /^\d{10}$/;

export function assertValidPhoneNumber(phoneNumber: string) {
  assertValidString(phoneNumber);

  if(!phoneNumber.match(MOBILE_PATTERN)) {
    throw new Error('Invalid phone number ' + phoneNumber);
  }
}

export function assertValidString(s: string) {
  if (typeof s !== 'string') {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    throw new Error('Invalid string ' + s);
  }
}
