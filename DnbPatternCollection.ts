import DrumPattern from './DrumPattern';

const genre = 'dnb';
// TODO: generate collection from JSON or yaml files
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
    when: number[] | number[][];
    numberOfBars?: number;
    subdivisions?: number;
}

interface DrumPatternFields {
    numberOfBars?: number;
    subdivisions?: number;
    hihat: DrumPatternInstrumentOptions;
    snare: DrumPatternInstrumentOptions;
    kick: DrumPatternInstrumentOptions;
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
    },

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


  [DnbDrumPatterns.BREAKBEAT_3]: {
    hihat: {
        when: [1,3,5,7,9,11,13,15],
    },
    snare: {
        when: [13],
    },
    kick: {
        when: [1,3,7,9],
    }
  },

  [DnbDrumPatterns.BREAKBEAT_4]: {
    hihat: {
        when: [1,3,5,7,9,11,13,15],
    },
    snare: {
        when: [5],
    },
    kick: {
        when: [1,11,15],
    }
  },

  [DnbDrumPatterns.EXTENDED_1]: {
    hihat: {
        when: [],
    },
    snare: {
        when: [[5, 15], [7, 13]],
    },
    kick: {
        when: [[1, 11], [3, 9]],
    },
    numberOfBars: 2,
  },

  [DnbDrumPatterns.EXTENDED_2]: {
    hihat: {
        when: [],
    },
    snare: {
        when: [],
    },
    kick: {
        when: [],
    }
  },

  [DnbDrumPatterns.EXTENDED_3]: {
    hihat: {
        when: [],
    },
    snare: {
        when: [],
    },
    kick: {
        when: [],
    }
  },

  [DnbDrumPatterns.BREAKOUT_1]: {
    hihat: {
        when: [],
    },
    snare: {
        when: [],
    },
    kick: {
        when: [],
    }
  },

  
  [DnbDrumPatterns.BREAKOUT_2]: {
    hihat: {
        when: [],
    },
    snare: {
        when: [],
    },
    kick: {
        when: [],
    }
  },
  
};



export function getPattern(pattern: DnbDrumPatterns){
    let chosenPattern;

    if (Object.keys(patterns).includes(pattern)){
        chosenPattern = patterns[pattern];
    }

    if (!chosenPattern) return undefined;
    const { kick, snare, hihat, numberOfBars = 1, subdivisions = 16 } = chosenPattern;
    
    return {
        hihat: new DrumPattern(hihat.name, {numberOfBars, subdivisions, name: `${genre}_${pattern}_hihat`, ...hihat}),
        snare: new DrumPattern(snare.name, {numberOfBars, name: `${genre}_${pattern}_snare`, subdivisions, ...snare}),
        kick: new DrumPattern(kick.name, {numberOfBars, subdivisions, name: `{genre}_${pattern}_snare`, ...kick}),
    }

}

export default {
    getPattern,
}