import DrumPattern from './generateDrumPatterns';

const genre = 'dnb';

export enum DnbDrumPatterns {
    BASIC_1 = 'basic1',
    BASIC_2 = 'basic2',
    BREAKBEAT_1 = 'break1',
    BREAKBEAT_2 = 'break2',
    BREAKBEAT_3 = 'break3',
    BREAKBEAT_4 = 'break4',
    EXTENDED_1 = 'extended1',
    EXTENDED_2 = 'extended2',
    EXTENDED_3 = 'extended3',
    BREAKOUT_1 = 'breakout1',
    BREAKOUT_2 = 'breakout2',
}

interface DrumPatternInstrumentOptions {
    name?: string;
    when: number[];
    numberOfBars?: number;
    subdivisions?: number;
}

interface DrumPatternFields {
    numberOfBars?: number;
    subdivisions?: number;
    hihat?: DrumPatternInstrumentOptions;
    snare?: DrumPatternInstrumentOptions;
    kick?: DrumPatternInstrumentOptions;
}

const patterns: { [key in DnbDrumPatterns]? : DrumPatternFields } = {
  [DnbDrumPatterns.BASIC_1]: {
    hihat: {
        when: [1,3,5,7,9,11,13,15],             
    },
    snare: {
        when: [5,13],
    },
    kick: {
        when: [1,11],
    },
 },

  [DnbDrumPatterns.BASIC_2]: {
    hihat: {
        when: [1,3,5,7,9,11,13,15],             
    },
    snare: {
        when: [5,11],
    },
    kick: {
        when: [1,7,13],
    },
  },

  [DnbDrumPatterns.BREAKBEAT_1]: {
    hihat: {
        when: [1,3,5,7,9,11,13,15],
    },
    snare: {
        when: [5, 15],
    },
    kick: {
        when: [1, 11],
    }

  },

  [DnbDrumPatterns.BREAKBEAT_2]: {
    hihat: {
        when: [1,3,5,7,9,11,13,15],
    },
    snare: {
        when: [5,7,11],
    },
    kick: {
        when: [1, 13],
    }
  },

};



export function getPattern(pattern: DnbDrumPatterns){
    let chosenPattern;
    if (pattern in Object.keys(patterns)){
        chosenPattern = patterns[pattern];
    }

    if (!chosenPattern) return null;
    const { kick, snare, hihat, numberOfBars = 1, subdivisions = 16 } = chosenPattern;
    return {
        hihat: hihat && new DrumPattern(hihat.name, {numberOfBars, subdivisions, name: `${genre}_${pattern}_hihat`, ...hihat}),
        snare: snare && new DrumPattern(snare.name, {numberOfBars, name: `${genre}_${pattern}_snare`, subdivisions, ...snare}),
        kick: kick && new DrumPattern(kick.name, {numberOfBars, subdivisions, name: `{genre}_${pattern}_snare`, ...kick}),
    }

}