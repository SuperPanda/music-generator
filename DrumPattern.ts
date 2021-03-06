import { clip, midi } from 'scribbletune';
import wu from 'wu';

function _generateDrumPattern(
  numberOfBars: number,
  subdivisions: number,
  when: number[]
): string[] {
  const patternTemplate: string = '-'.repeat(numberOfBars * subdivisions);
  const pattern: string[] = patternTemplate.split('');

  return when.reduce((acc, curr) => {
    if (typeof curr === 'number') {
      const next: string[] = acc;
      next[curr - 1] = 'x';
      return next;
    }
    console.log('unsupported as yet');
    return acc;
  }, pattern);
}

export interface DrumPatternOpts {
  numberOfBars?: number;
  subdivisions?: number;
  when?: number[] | number[][];
  repeat?: number;
  name?: string;
}

interface MergeInfo {
  numberOfBars: number;
  pattern: string[];
  subdivisions: number;
  repeat: number;
  when: number[];
}

export class DrumPattern {
  static mergePattern(
    pattern1: DrumPattern,
    pattern2: DrumPattern,
    name: string
  ): DrumPattern {
    const pattern1Info = pattern1.mergeInfo();
    const pattern2Info = pattern2.mergeInfo();
    if (pattern1Info.subdivisions !== pattern2Info.subdivisions) {
      console.log('Need to implement LCM and readjust subdivisions');
      throw new Error('not implemented');
    }
    // if no sub division renormalization needed
    const subdivisions = pattern1Info.subdivisions;
    const numberOfBars =
      pattern1Info.numberOfBars * pattern1Info.repeat +
      pattern2Info.numberOfBars * pattern2Info.repeat;
    const offset =
      pattern1Info.numberOfBars *
      pattern1Info.repeat *
      pattern1Info.subdivisions; // adjust this when different subdivisions
    const newWhenPattern1 = wu(
      Array.from(Array(pattern1Info.repeat).keys())
    ).reduce((acc: number[], curr) => {
      const _thisWhenpatternForThisRepeat = pattern1Info.when.map(
        value => value + subdivisions * curr
      );
      return [...acc, ..._thisWhenpatternForThisRepeat];
    }, []);

    const newWhenPattern2 = wu(
      Array.from(Array(pattern2Info.repeat).keys())
    ).reduce((acc: number[], curr) => {
      const _thisWhenpatternForThisRepeat = pattern2Info.when.map(
        value => value + subdivisions * curr + offset
      );
      return [...acc, ..._thisWhenpatternForThisRepeat];
    }, []);

    return new DrumPattern(name, {
      numberOfBars,
      subdivisions,
      repeat: 1,
      when: [...newWhenPattern1, ...newWhenPattern2],
    });
  }

  private _numberOfBars: number;
  private _subdivisions: number;
  private _when: number[];
  private _name: string;
  private _repeat: number;
  constructor(name = 'emptydrums', drumPatternOpts?: DrumPatternOpts) {
    const { numberOfBars, subdivisions, name: _overrideName, repeat, when } =
      drumPatternOpts || {};
    this._numberOfBars = numberOfBars || 1;
    this._subdivisions = subdivisions || 16;
    this._name = _overrideName || name;

    // should add some checks
    if (
      drumPatternOpts &&
      Array.isArray(drumPatternOpts.when) &&
      Array.isArray(drumPatternOpts.when[0])
    ) {
      const _when = drumPatternOpts.when as number[][];
      this._when = _when
        .map((whenPart: number[], idx: number): number[] =>
          whenPart.map(
            (value: number): number => value + this._subdivisions * idx
          )
        )
        .reduce((acc: number[], curr: number[]) => [...acc, ...curr], []);
    } else {
      const _when = when as number[] | undefined;
      this._when = _when || [];
    }
    this._repeat = repeat || 1;
  }

  show(): string {
    return this.pattern.join('').repeat(this._repeat);
  }

  get pattern(): string[] {
    return _generateDrumPattern(
      this._numberOfBars,
      this._subdivisions,
      this._when
    );
  }

  set repeat(repeat: number) {
    this._repeat = repeat;
  }
  get repeat(): number {
    return this._repeat;
  }

  get numberOfBars(): number {
    return this._numberOfBars * this._repeat;
  }

  get subdivisions(): number {
    return this._subdivisions;
  }

  save(name?: string): void {
    const filename = name || this._name;
    midi(
      clip({
        notes: 'c4',
        pattern: this.show(),
        subdiv: `${this._subdivisions}n`,
      }),
      filename.endsWith('.mid') ? filename : filename + '.mid'
    );
  }

  generate(when: number[]): void {
    this._when = when;
  }

  mergeInfo(): MergeInfo {
    return {
      numberOfBars: this._numberOfBars,
      pattern: this.pattern,
      subdivisions: this._subdivisions,
      repeat: this._repeat,
      when: this._when,
    };
  }

  clone(): DrumPattern {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}

export default DrumPattern;
