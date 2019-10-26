import {getChordsByProgression, clip, midi } from "scribbletune"
import DrumPattern from './DrumPattern';
import { getPattern, DnbDrumPatterns } from './DnbPatternCollection';
import { DrumPatternCollection } from './DrumPattern';


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
/*
const p1 = getPattern(DnbDrumPatterns.BREAKBEAT_1);
const p2 = getPattern(DnbDrumPatterns.BREAKBEAT_2);
// console.log(p1!.hihat!.show());
if (p1 && p2){
    DrumPattern.updateDrumPatternCollectionRepeat(p1 as DrumPatternCollection, 3);
    const p3: DrumPatternCollection = DrumPattern.mergeDrumPatternCollection(p1, p2, 'merged');
    DrumPattern.saveDrumPatternCollection(p3);
}*/
//const p1 = getPattern(DnbDrumPatterns.)
/*
if (p1 && p1.kick && p2 && p2.kick)  {
    const newPattern = DrumPattern.mergePattern(p1.kick, p2.kick, 'test');
    console.log(newPattern.show());
}*/
const p1 = getPattern(DnbDrumPatterns.BREAKBEAT_1);
const p2 = getPattern(DnbDrumPatterns.BREAKBEAT_2);
const p3 = getPattern(DnbDrumPatterns.EXTENDED_1);
//const newPattern = DrumPattern.mergePattern(p1.kick, p2.kick, 'test');
if (p1 && p2 && p3) {
    const a = DrumPattern.mergeDrumPatternCollection(p1, p2);
    const b = DrumPattern.mergeDrumPatternCollection(a, p3);
    DrumPattern.saveDrumPatternCollection(b);
}