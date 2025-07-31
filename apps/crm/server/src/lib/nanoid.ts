import { customAlphabet } from 'nanoid';

class NanoId {
  private readonly alphaNumAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  str(stringLength: number) {
    const nanoid = customAlphabet(this.alphaNumAlphabet, stringLength);
    return nanoid();
  }
}

export default NanoId;
