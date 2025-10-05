import { Pipe, PipeTransform } from '@angular/core';

/**
 * We are conflicts on how the Angular date:dateTimeFormat likes the 
 * date time format strings, and what we can use in, for example IonDateTime.
 * So we will use our own pipe.
 * Prefixed with mm to make obvious is not one of the built in pipes.
 */
@Pipe({ name: 'mmDateTimeFormat' })
export class MmDateTimeFormatPipe implements PipeTransform {
  /**
   * Pipes transform
   * @param value - the value
   * @param args - optional date time pattern
   * @returns formatted date time
   */
  public transform(value: any, ...args: any[]): any {
    try {
      const pattern: string =
        args && args.length > 0 ? (args[0] as string) : '';
      const result = this.formatDateTime(value, pattern);
      return result;
    } catch (error) {
      console.error(`MmDateTimeFormatPipe.transform: ${error}`);
      return value;
    }
  }

  public formatDateTime(
    dateTime: Date | string | number,
    pattern?: string
  ): string {
    if (!dateTime) {
      return '';
    }

   
    // if (pattern) {
    //   // See common mistakes as at
    //   // https://github.com/date-fns/date-fns/blob/main/docs/unicodeTokens.md
    //   pattern = pattern.replace(/D/g, 'd');
    //   pattern = pattern.replace(/Y/g, 'y');

    //   const dateObj = dateTime instanceof Date ? dateTime : new Date(dateTime);
    //   const patternResult = formatDateFns(dateObj, pattern);
    //   return patternResult;
    // }

    const now = new Date();
    const dateTimeToFormat =
      dateTime instanceof Date ? dateTime : new Date(dateTime);
    const result =
      now.getDate() === dateTimeToFormat.getDate()
        ? dateTimeToFormat.toLocaleTimeString()
        : `${dateTimeToFormat.toLocaleDateString()} ${dateTimeToFormat.toLocaleTimeString()}`;

    return result;
  }
}
