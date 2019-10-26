
# Music generator
## About
A place to store snippets of musical knowledge and to more easily be able to explore ideas. I currently use this project to generate midis to import into DAWs.
## Components
### Drum Patterns
So far it contains 3 components (will reword later),
- DnbPatternCollection (a collection of actual patterns that can be mixed and merged) (TODO: Explain how it uses subdivisions, number of bars, and an array of numbers for each bar for each instrument)
```
// adapted from: https://music.tutsplus.com/tutorials/making-the-beat-drum-n-bass-drums--audio-8697
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
 ...
 ...
  [DnbDrumPatterns.EXTENDED_2]: {
    snare: {
        when: [[5, 11],[3, 11]],
    },
    kick: {
        when: [[1,7,13],[7,3]],
    },
    numberOfBars: 2,
  },
...
...
  [DnbDrumPatterns.BASIC_HIHAT_1]: { // 16
    hihat: {
        when: [1,3,5,7,9,10,11,13,15],            
    },
  }
}

```
- DrumPatternCollection utilities - This is main a utility for operation on all of the instruments of a track (concating, displaying tabs, and providing the track building utility - uses an array of 2-tuples, with the 2-tuple consisting of the Drum Pattern Collection and the number of times it needs to be repeat). The track building utility will concatenate each of the 2-tuple tracks and generate a full track, add empty spaces where it needs to be for instruments that are missing. By making tracks from the DnbPatternCollection, it is simple to switch the tracks. More work will be done later.

```
import { getPattern, DnbDrumPatterns } from './DnbPatternCollection';
import { showDrumPatternCollection, saveDrumPatternCollection, trackBuilder } from "./DrumPatternCollection";

const ext2 = getPattern(DnbDrumPatterns.EXTENDED_1);
const hh1 = getPattern(DnbDrumPatterns.BASIC_HIHAT_1);
const bb1 = getPattern(DnbDrumPatterns.BREAKBEAT_3);
const eb2 = getPattern(DnbDrumPatterns.EXTENDED_BREAKOUT_1);
const b1 = getPattern(DnbDrumPatterns.BASIC_2);
  
if (ext2 && hh1 && eb2 && bb1 && b1) {    
    console.log(DnbDrumPatterns.EXTENDED_1);
    showDrumPatternCollection(ext2);

    console.log(DnbDrumPatterns.BASIC_HIHAT_1);
    showDrumPatternCollection(hh1);
    
    console.log(DnbDrumPatterns.BREAKBEAT_3);
    showDrumPatternCollection(bb1);
    
    console.log(DnbDrumPatterns.EXTENDED_BREAKOUT_1);
    showDrumPatternCollection(eb2);

    console.log(DnbDrumPatterns.BASIC_2);
    showDrumPatternCollection(b1);

    const track1 = trackBuilder([ [b1, 2], [ext2, 1], [bb1, 2], [eb2,1] ],'track1');
    const track2 = trackBuilder([ [b1, 2], [b1,   1], [hh1, 1], [b1, 3], [hh1,1] ], 'track2');
    const track3 = {
        hihat: track2.hihat,
        snare: track1.snare,
        kick: track1.kick,
    }
    console.log('track 1');
    showDrumPatternCollection(track1);
    console.log('track 1');
    showDrumPatternCollection(track2);
    console.log('track 3');
    showDrumPatternCollection(track3);
    saveDrumPatternCollection(track3, 'track3');
    // basic - extended - break
}
```
generates:

```
extended1
----x---------x-------x-----x---
x---------x-------x-----x-------
basichithat1
x-x-x-x-xxx-x-x-
break3
x-x-x-x-x-x-x-x-
------------x---
x-x---x-x-------
extendedbreakout1
-x--x--x--x------x--x--x--x-----
--x-----x---x-x---x-----x-------
basic2
x-x-x-x-x-x-x-x-
----x-----x-----
x-----x-----x---
track 1
x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x---------------------------------x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x---------------------------------
----x-----x---------x-----x---------x---------x-------x-----x---------------x---------------x----x--x--x--x------x--x--x--x-----
x-----x-----x---x-----x-----x---x---------x-------x-----x-------x-x---x-x-------x-x---x-x---------x-----x---x-x---x-----x-------
track 1
x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xxx-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xxx-x-x-
----x-----x---------x-----x---------x-----x-------------------------x-----x---------x-----x---------x-----x---------------------
x-----x-----x---x-----x-----x---x-----x-----x-------------------x-----x-----x---x-----x-----x---x-----x-----x-------------------
track 3
x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xxx-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-xxx-x-x-
----x-----x---------x-----x---------x---------x-------x-----x---------------x---------------x----x--x--x--x------x--x--x--x-----
x-----x-----x---x-----x-----x---x---------x-------x-----x-------x-x---x-x-------x-x---x-x---------x-----x---x-x---x-----x-------
```


- DrumPattern - A Drum Pattern Collection consists of a Drum Pattern for each instrument, this encapsulates the repeat, number of bars subdivisions and notes, so you can pass it an array of numbers defining when the beats will be hit, or pass it an array of number arrays, so you only have to enter the numbers for a give bar.
