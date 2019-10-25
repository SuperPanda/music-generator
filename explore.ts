import {getChordsByProgression, clip, midi } from "scribbletune"
import DrumPattern from './generateDrumPatterns';
import { getPattern, DnbDrumPatterns } from './dnbPatternCollection';
import mergePattern from "./mergeDrumPatterns";

/* 
 * DRUMS
 * 
 */
console.log('hi');
// basic dnb pattern
const hihat = [1,3,5,7,9,11,13,15];
const snare = [5,13];
const kick = [1,11];


/*const hihatPattern = new DrumPattern('demo-hihat', { when: hihat } );
const snarePattern = new DrumPattern('demo-snare', { when: snare } );
const kickPattern = new DrumPattern('demo-kick', { when: kick } );
*/
/*
const drum = getPattern(DnbDrumPatterns.BASIC_2);

if (drum){
    console.log(drum.hihat!.show());
    console.log(drum.snare!.show());
    console.log(drum.kick!.show());

    drum.hihat!.save();
    drum.snare!.save();
    drum.kick!.save();
}
*/
const p1 = getPattern(DnbDrumPatterns.BASIC_1);
const p2 = getPattern(DnbDrumPatterns.BASIC_2);
// console.log(p1!.hihat!.show());

if (p1 && p1.kick && p2 && p2.kick)  {
    const newPattern = mergePattern(p1.kick, p2.kick, 'test');
    console.log(newPattern.show());
}



// Next... have a few patterns
// and be able to concat patterns
