import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(value: string, length: number): string {
    const biggestWord = 3;
    const elipses = '...';

    if(typeof value === 'undefined') return value;
    if(value.length <= length) return value;
    if(length < elipses.length) return '';


    // .. truncate to about correct lenght
    let truncatedText = value.slice(0, length + biggestWord);

    // .. now nibble ends till correct length
    while (truncatedText.length > length - elipses.length) {

      const lastSpace = truncatedText.lastIndexOf(' ');
      if (lastSpace === -1) break;
      truncatedText = truncatedText.slice(0, lastSpace).replace(/[!,.?;:]$/, '');

    };

    return truncatedText + elipses;

  }


}
