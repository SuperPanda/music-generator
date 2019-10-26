import { DrumPattern } from './DrumPattern';
import { DrumPatternCollection } from './DrumPatternCollection';

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
  BREAKOUT_3 = 'breakout3',
  BREAKOUT_4 = 'breakout4',
  BREAKOUT_5 = 'breakout5',
  EXTENDED_BREAKOUT_1 = 'extendedbreakout1',
  BASIC_HIHAT_1 = 'basichihat1',
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
  hihat?: DrumPatternInstrumentOptions;
  snare?: DrumPatternInstrumentOptions;
  kick?: DrumPatternInstrumentOptions;
}

// Graciously adapted from: https://music.tutsplus.com/tutorials/making-the-beat-drum-n-bass-drums--audio-8697

const patterns: { [key in DnbDrumPatterns]?: DrumPatternFields } = {
  [DnbDrumPatterns.BASIC_1]: {
    hihat: {
      when: [1, 3, 5, 7, 9, 11, 13, 15],
    },
    snare: {
      when: [5, 13],
    },
    kick: {
      when: [1, 11],
    },
  },

  [DnbDrumPatterns.BASIC_2]: {
    hihat: {
      when: [1, 3, 5, 7, 9, 11, 13, 15],
    },
    snare: {
      when: [5, 11],
    },
    kick: {
      when: [1, 7, 13],
    },
  },

  [DnbDrumPatterns.BREAKBEAT_1]: {
    hihat: {
      when: [1, 3, 5, 7, 9, 11, 13, 15],
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
      when: [1, 3, 5, 7, 9, 11, 13, 15],
    },
    snare: {
      when: [5, 7, 11],
    },
    kick: {
      when: [1, 13],
    },
  },

  [DnbDrumPatterns.BREAKBEAT_3]: {
    hihat: {
      when: [1, 3, 5, 7, 9, 11, 13, 15],
    },
    snare: {
      when: [13],
    },
    kick: {
      when: [1, 3, 7, 9],
    },
  },

  [DnbDrumPatterns.BREAKBEAT_4]: {
    hihat: {
      when: [1, 3, 5, 7, 9, 11, 13, 15],
    },
    snare: {
      when: [5],
    },
    kick: {
      when: [1, 11, 15],
    },
  },

  [DnbDrumPatterns.EXTENDED_1]: {
    // # 5
    snare: {
      when: [[5, 15], [7, 13]],
    },
    kick: {
      when: [[1, 11], [3, 9]],
    },
    numberOfBars: 2,
  },

  [DnbDrumPatterns.EXTENDED_2]: {
    // # 6
    snare: {
      when: [[5, 11], [3, 11]],
    },
    kick: {
      when: [[1, 7, 13], [7, 3]],
    },
    numberOfBars: 2,
  },

  [DnbDrumPatterns.EXTENDED_3]: {
    snare: {
      when: [[5, 13], [5, 11]],
    },
    kick: {
      when: [[1, 11], [1, 7, 9]],
    },
    numberOfBars: 2,
  },

  [DnbDrumPatterns.BREAKOUT_1]: {
    snare: {
      when: [5, 8, 10, 13],
    },
    kick: {
      when: [1, 11],
    },
  },

  [DnbDrumPatterns.BREAKOUT_2]: {
    // # 9
    snare: {
      when: [5, 8, 10, 15],
    },
    kick: {
      when: [1, 11],
    },
  },

  [DnbDrumPatterns.BREAKOUT_3]: {
    snare: {
      when: [1, 2, 7, 13],
    },
    kick: {
      when: [3, 9],
    },
  },

  [DnbDrumPatterns.BREAKOUT_4]: {
    snare: {
      when: [13, 16],
    },
    kick: {
      when: [1, 7, 9],
    },
  },

  [DnbDrumPatterns.BREAKOUT_5]: {
    // # 12
    snare: {
      when: [2, 5, 8, 11],
    },
    kick: {
      when: [3, 9, 13],
    },
  },

  [DnbDrumPatterns.EXTENDED_BREAKOUT_1]: {
    // # 13
    snare: {
      when: [[2, 5, 8, 11], [2, 5, 8, 11]],
    },
    kick: {
      when: [[3, 9, 13, 15], [3, 9]],
    },
    numberOfBars: 2,
  },
  // # 14, # 15 use timbre shifts - not sure which channel to add too
  [DnbDrumPatterns.BASIC_HIHAT_1]: {
    // 16
    hihat: {
      when: [1, 3, 5, 7, 9, 10, 11, 13, 15],
    },
  },
};

export function getPattern(
  pattern: DnbDrumPatterns
): DrumPatternCollection | undefined {
  let chosenPattern;

  if (Object.keys(patterns).includes(pattern)) {
    chosenPattern = patterns[pattern];
  }

  if (!chosenPattern) return undefined;
  const {
    kick,
    snare,
    hihat,
    numberOfBars = 1,
    subdivisions = 16,
  } = chosenPattern;

  return {
    hihat: hihat
      ? new DrumPattern(`${genre}_${pattern}_hihat`, {
          numberOfBars,
          subdivisions,
          ...hihat,
        })
      : undefined,
    snare: snare
      ? new DrumPattern(`${genre}_${pattern}_snare`, {
          numberOfBars,
          subdivisions,
          ...snare,
        })
      : undefined,
    kick: kick
      ? new DrumPattern(`${genre}_${pattern}_kick`, {
          numberOfBars,
          subdivisions,
          ...kick,
        })
      : undefined,
  };
}

export default {
  getPattern,
  DnbDrumPatterns,
};
