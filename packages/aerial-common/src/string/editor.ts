
export class SourceStringEditor {
  private _replacements: Array<[number, number, string]>;

  private _position: number = 0;
  private _output: string;

  constructor(readonly input: string) {
    this._output = input;
    this._replacements = [];
  }

  replace(sourceStartIndex: number, sourceEndIndex: number, value = "") {
    
    let offsetSourceStartIndex = sourceStartIndex;
    let offsetSourceEndIndex   = sourceEndIndex;

    this._replacements.push([sourceStartIndex, sourceEndIndex, value]);
  }

  getOutput() {
    let output = this.input;
    const computedReplacements: Array<[number, number, string]> = [];

    for (let i = 0, n = this._replacements.length; i < n; i++) {
      const [startIndex, endIndex, value] = this._replacements[i];

      let offsetStartIndex = startIndex;
      let offsetEndIndex   = endIndex;
      let invalid          = false;
      const insertion      = startIndex === endIndex;

      // based on all of the previous edits, calculate where this edit is
      for (let j = 0; j < i; j++) {
        const [previousStartIndex, previousEndIndex, previousNewValue] = this._replacements[j];

        const prevInsertion     = previousStartIndex === previousEndIndex;
        const startIndicesMatch = startIndex === previousStartIndex;
        const endIndicesMatch   = endIndex === previousEndIndex;

        // input :  a b c d e f g h i
        // prev  :     ^-------^
        // curr  :     ^
        const insertBeginning        = startIndicesMatch && insertion;

        // input :  a b c d e f g h i
        // prev  :     ^-------^
        // curr  :             ^
        const insertEnd              = endIndicesMatch && insertion;

        // input :  a b c d e f g h i
        // prev  :     ^
        // curr  :     ^-------^
        const prevInsertBeginning    = startIndicesMatch && prevInsertion;
        
        // input :  a b c d e f g h i
        // prev  :     ^
        // curr  :     ^-------^
        const prevInsertEnd         = endIndicesMatch && prevInsertion;

        const currOrPrevInserting   = insertBeginning || insertEnd || prevInsertBeginning || prevInsertEnd;

        // input :  a b c d e f g h i
        // prev  :         ^-------^ 
        // curr  :     ^-------^
        if (previousStartIndex < endIndex && previousStartIndex > startIndex) {
          offsetEndIndex = offsetEndIndex - (endIndex - previousStartIndex);
        }

        // input :  a b c d e f g h i
        // prev  :   ^-----^
        // curr  :       ^-------^
        if (previousEndIndex > startIndex && previousEndIndex < endIndex) {
          offsetStartIndex = offsetStartIndex + (previousEndIndex - startIndex);
        }

        // Invalid edit because previous replacement 
        // completely clobbers this one. There's nothing else to edit.
        // input :  a b c d e f g h i 
        // prev  :   ^---------^
        // curr  :     ^---^
        // curr  : ^-------------^
        // not   :   ^
        // not   :             ^
        // not   :   ^-----------^
        if (
            (
              (startIndex >= previousStartIndex && endIndex <= previousEndIndex) || 
              (startIndex < previousStartIndex && endIndex >= previousEndIndex)
            ) && !currOrPrevInserting) {
          invalid = true;
          break;
        }

        // input :  a b c d e f g h
        // prev  :     ^-----^
        // curr  :       ^-----^
        // curr  :           ^---^
        // curr  :               ^-^
        // curr  : ^-----^
        // not   : ^---^
        // not   :   ^-^
        // not   :     ^

        // input :  a b c d e f g h
        // prev  : ^---^
        // curr  :   ^---^
        if (previousStartIndex <= startIndex && endIndex > previousStartIndex) {
          const prevValueLengthDelta = previousNewValue.length - (previousEndIndex - previousStartIndex);

          // shift left or right
          offsetStartIndex = Math.max(0, offsetStartIndex + prevValueLengthDelta);
          offsetEndIndex   = Math.max(0, offsetEndIndex + prevValueLengthDelta);
        }
      }

      if (!invalid) {
        output = output.substr(0, offsetStartIndex) + value + output.substr(offsetEndIndex);
      }
    }

    return output;
  }
}