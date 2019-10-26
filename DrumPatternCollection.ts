import { DrumPattern } from './DrumPattern';

export interface DrumPatternCollection {
  hihat?: DrumPattern;
  kick?: DrumPattern;
  snare?: DrumPattern;
}

interface MutableObj<T> {
  exists: boolean;
  obj: T | undefined;
}

export function showDrumPatternCollection(
  patternCollection1: DrumPatternCollection
): void {
  if (patternCollection1.hihat) console.log(patternCollection1.hihat.show());
  if (patternCollection1.snare) console.log(patternCollection1.snare.show());
  if (patternCollection1.kick) console.log(patternCollection1.kick.show());

  return;
}
export function repeatDrumPatternCollection(
  patternCollection: DrumPatternCollection,
  repeat: number
): DrumPatternCollection {
  const { hihat, kick, snare } = patternCollection;
  const newCollection: DrumPatternCollection = {
    hihat: hihat ? hihat.clone() : undefined,
    kick: kick ? kick.clone() : undefined,
    snare: snare ? snare.clone() : undefined,
  };

  if (newCollection.hihat) newCollection.hihat.repeat = repeat;
  if (newCollection.kick) newCollection.kick.repeat = repeat;
  if (newCollection.snare) newCollection.snare.repeat = repeat;
  return newCollection;
}

export function saveDrumPatternCollection(
  patternCollection: DrumPatternCollection,
  collectionName?: string
): void {
  if (patternCollection.hihat)
    patternCollection.hihat.save(
      collectionName ? collectionName + '_hihat' : undefined
    );
  if (patternCollection.snare)
    patternCollection.snare.save(
      collectionName ? collectionName + '_snare' : undefined
    );
  if (patternCollection.kick)
    patternCollection.kick.save(
      collectionName ? collectionName + '_kick' : undefined
    );
}

export function mergeDrumPatternCollection(
  patternCollection1: DrumPatternCollection,
  patternCollection2: DrumPatternCollection,
  name = 'unnamed_collection'
): DrumPatternCollection {
  if (!patternCollection1 || !patternCollection2) {
    throw new Error('No collection provided');
  }

  const { hihat: hihat1, snare: snare1, kick: kick1 } = patternCollection1;
  const { hihat: hihat2, snare: snare2, kick: kick2 } = patternCollection2;

  const collection1 = [hihat1, snare1, kick1];
  const collection2 = [hihat2, snare2, kick2];

  const removeEmptyFilter = (
    value: DrumPattern | undefined
  ): value is DrumPattern => !!value;
  // TODO: SHOULD ADD ADD CHECK FOR SUBDIVISIONS
  const collection1NumBars = Math.max(
    ...collection1
      .filter(removeEmptyFilter)
      .map(instrument => instrument.numberOfBars * instrument.repeat)
  );
  const collection2NumBars = Math.max(
    ...collection2
      .filter(removeEmptyFilter)
      .map(instrument => instrument.numberOfBars * instrument.repeat)
  );
  const collection1Subdivisions = Math.max(
    ...collection1
      .filter(removeEmptyFilter)
      .map(instrument => instrument.subdivisions)
  );
  const collection2Subdivisions = Math.max(
    ...collection2
      .filter(removeEmptyFilter)
      .map(instrument => instrument.subdivisions)
  );

  const measuresOfCollection1 = collection1
    .filter(removeEmptyFilter)
    .map(
      instrument =>
        instrument.repeat * instrument.numberOfBars * instrument.subdivisions
    );
  if (
    measuresOfCollection1.filter(
      value => value !== Math.max(...measuresOfCollection1)
    ).length !== 0
  ) {
    throw new Error(
      'Unequal measures of drums in same collection not currently supported for merge ' +
        JSON.stringify(measuresOfCollection1)
    );
  }

  // TODO: RENORMALIZE THE BEATS WHEN MERGING DIFFERENT SUBDIVISIONS

  const measuresOfCollection2 = collection2
    .filter(removeEmptyFilter)
    .map(instrument => instrument.numberOfBars * instrument.subdivisions);
  if (
    measuresOfCollection2.filter(
      value => value !== Math.max(...measuresOfCollection2)
    ).length > 0
  ) {
    throw new Error(
      'Unequal measures of drums in same collection not currently supported for merge' +
        JSON.stringify(measuresOfCollection2)
    );
  }

  /* if a track exists on one of the objects but not the other,
            initialise it so the tracks line up */

  // Refactor into a reducer for extensibility
  const isAvailable = (obj: DrumPattern | undefined): boolean => !!obj;
  const mutableObjs: { [idx: string]: MutableObj<DrumPattern> } = {
    hihat1: {
      obj: hihat1,
      exists: isAvailable(hihat1),
    },
    hihat2: {
      obj: hihat2,
      exists: isAvailable(hihat2),
    },
    snare1: {
      obj: snare1,
      exists: isAvailable(snare1),
    },
    snare2: {
      obj: snare2,
      exists: isAvailable(snare2),
    },
    kick1: {
      obj: kick1,
      exists: isAvailable(kick1),
    },
    kick2: {
      obj: kick2,
      exists: isAvailable(kick2),
    },
  };
  const pairs = [
    [mutableObjs.hihat1, mutableObjs.hihat2],
    [mutableObjs.snare1, mutableObjs.snare2],
    [mutableObjs.kick1, mutableObjs.kick2],
  ];

  pairs.forEach(
    (
      pair: MutableObj<DrumPattern>[],
      idx: number,
      arr: MutableObj<DrumPattern>[][]
    ) => {
      if (!pair[0].exists && pair[1].exists) {
        arr[idx][0].obj = new DrumPattern(name, {
          when: [],
          subdivisions: collection1Subdivisions,
          numberOfBars: collection1NumBars,
        });
      } else if (!pair[1].exists && pair[0].exists) {
        arr[idx][1].obj = new DrumPattern(name, {
          when: [],
          subdivisions: collection2Subdivisions,
          numberOfBars: collection2NumBars,
        });
      }
    }
  );

  // sub division error conditions is in the merge function
  return {
    hihat: mutableObjs.hihat1.exists
      ? DrumPattern.mergePattern(
          mutableObjs.hihat1.obj as DrumPattern,
          mutableObjs.hihat2.obj as DrumPattern,
          name + '_hihat'
        )
      : undefined,
    kick: mutableObjs.kick1.exists
      ? DrumPattern.mergePattern(
          mutableObjs.kick1.obj as DrumPattern,
          mutableObjs.kick2.obj as DrumPattern,
          name + '_kick'
        )
      : undefined,
    snare: mutableObjs.snare1.exists
      ? DrumPattern.mergePattern(
          mutableObjs.snare1.obj as DrumPattern,
          mutableObjs.snare2.obj as DrumPattern,
          name + '_snare'
        )
      : undefined,
  };
}

type MergeFunction = (
  arrayOfDrumPatterns: DrumPatternCollection[],
  name: string
) => DrumPatternCollection;
type RepeatFunction = (
  patternAndRepeat: [DrumPatternCollection, number?]
) => DrumPatternCollection;
type InputArray = [DrumPatternCollection, number?][];
type Result = DrumPatternCollection;
type Curry = (inputArr: InputArray, name: string) => Result;
function curry(mergeFunc: MergeFunction, repeatFunc: RepeatFunction): Curry {
  return function(inputArr: InputArray, name: string): Result {
    return mergeFunc(
      inputArr.map(
        (element: [DrumPatternCollection, number?]): DrumPatternCollection =>
          repeatFunc(element)
      ),
      name
    );
  };
}

function merge(
  arrayOfDrumPatterns: DrumPatternCollection[],
  name: string
): DrumPatternCollection {
  const [firstDrumPattern, ...restOfDrumPatterns] = arrayOfDrumPatterns;
  if (restOfDrumPatterns.length === 0) return firstDrumPattern;

  return restOfDrumPatterns.reduce(function(
    acc: DrumPatternCollection,
    curr: DrumPatternCollection
  ): DrumPatternCollection {
    return mergeDrumPatternCollection(acc, curr, name);
  },
  firstDrumPattern);
}

const repeat = (
  element: [DrumPatternCollection, number?]
): DrumPatternCollection => {
  return repeatDrumPatternCollection(element[0], element[1] || 1);
};

export type TrackBuilder = (
  inputArr: InputArray,
  name: string
) => DrumPatternCollection;
export const trackBuilder: TrackBuilder = curry(merge, repeat);

export default {
  mergeDrumPatternCollection,
  showDrumPatternCollection,
  saveDrumPatternCollection,
  repeatDrumPatternCollection,
  trackBuilder,
};
