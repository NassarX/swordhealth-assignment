import seedrandom from 'seedrandom';

export class Anonymizer {
  private seed: string;
  private diacritics: boolean;

  constructor(seed: string, diacritics = true) {
    this.seed = seed;
    this.diacritics = diacritics;
  }

  private getRandomInt(max: number): number {
    const rng = seedrandom(this.seed);
    return Math.floor(rng() * Math.floor(max));
  }

  private getAnonymizedPostCode(postCode: string): string {
    const firstTwoChars = postCode.substring(0, 2);
    return `${firstTwoChars}** ***`;
  }

  private getAnonymizedAge(age: string): string {
    const firstChar = age.substring(0, 1);
    return `${firstChar}*`;
  }

  private getAnonymizedAddress(address: string): string {
    const addressParts = address.split(' ');
    const anonymizedAddress = addressParts.map((part) => {
      if (part.match(/[0-9]/g)) {
        return part.replace(/\d/g, '*');
      }
      return part;
    });
    const firstTwoChars = address.substring(0, 2);
    const anonymizeAddr = anonymizedAddress.join(' ');
    return `${firstTwoChars}${anonymizeAddr}`;
  }

  private getAnonymizedEmail(email: string): string {
    const [username, domain] = email.split('@');
    const firstTwoChars = username.substring(0, 2);
    return `${firstTwoChars}****@${domain}`;
  }

  private anonymizePhoneNumber(phoneNumber: string): string {
      return phoneNumber.slice(0, 2) + '****' + phoneNumber.slice(-2);
  }


  public anonymize(summary: string): string {
    let anonymizedSummary = summary;
    anonymizedSummary = anonymizedSummary.replace(/(0|\+44)[1-9][0-9]{8,9}/g, (phoneNumber) => {
      return this.anonymizePhoneNumber(phoneNumber);
    });
    anonymizedSummary = anonymizedSummary.replace(/([A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2})/g, (postCode) => {
      return this.getAnonymizedPostCode(postCode);
    });
    anonymizedSummary = anonymizedSummary.replace(/\d{1,3}/g, (age) => {
      return this.getAnonymizedAge(age);
    });
    anonymizedSummary = anonymizedSummary.replace(/((?<=\s)[A-Za-z0-9'\.\-#/]+[\s]\d{1,4}[\s](st|nd|rd|th)[\s]([A-Za-z]+)?[\s]*([A-Za-z]+)?)/g, (address) => {
      return this.getAnonymizedAddress(address);
    });
    anonymizedSummary = anonymizedSummary.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g, (email) => {
      return this.getAnonymizedEmail(email);
    });
    return anonymizedSummary;
  }
}
