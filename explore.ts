import {getChordsByProgression, clip, midi } from "scribbletune"
import DrumPattern from './DrumPattern';
import { getPattern, DnbDrumPatterns } from './DnbPatternCollection';
import { showDrumPatternCollection, saveDrumPatternCollection, trackBuilder } from "./DrumPatternCollection";



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
// const p1 = getPattern(DnbDrumPatterns.BREAKBEAT_1);
// const p2 = getPattern(DnbDrumPatterns.BASIC_HIHAT_1);
//const newPattern = DrumPattern.mergePattern(p1.kick, p2.kick, 'test');
// need a mix function
// if (p1 && p2) {
    // p1
    // -----------------
    // ---x----x---x----
    // --x-x-x--x-x---x-
    // p2 
    // ---x-x--x---x-x--
    // ----------------
    // ----------------
    // p3 = mix p1 , p2
    // --x-x-x--x--x-x-x-
    // --x-x-x-x--x-x-x--
    // ---x-x-x-x-x-x-x--
    // should change name to concat
    // p4 = merge p1, p2
    // -------------------x---x-x--x-x-x---x-
    // ---x-x---x--x-x-x---------------------
    // ---x-x--x-x-x-x-x--------------------
    //const p3 = {
    //    hihat: p2.hihat,
    //    kick: p1.kick,
    //    snare: p1.snare,
    //}
  //  DrumPattern.showDrumPatternCollection(p3);
   // const p4 = DrumPattern.mergeDrumPatternCollection(p1, p2, 'mix');
    //DrumPattern.showDrumPatternCollection(p4);

    //DrumPattern.saveDrumPatternCollection({...p1, ...p2}, 'mix');
//}


//const merge = (in1: DrumPattern, in2: DrumPattern) => DrumPattern.mergeDrumPatternCollection(in1, in2);

// (mergeFunc, [pattern, repeat]) =>
//       
// [pattern, repeat], [pattern, repeat], [pattern, repeat]
// 
//
// elementFunc will call repeatDrumPatternCollect(arg[0], arg[1])
// mergeFunc will reduce by mergeDrumPatternCollection(acc, curr, name)
//
/*
(mergeFunc, elementFunc, name) =>
    (inputArr) =>
        mergeFunc(inputArray.map(element => elementFunc(element)))
  */
 
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

    // basic hihat x 4
    //const basicHiHat4 = DrumPattern.repeatDrumPatternCollection(p2, 4);
    
    const track1 = trackBuilder([[b1, 2], [ext2, 1], [bb1, 2], [eb2,1]],'track1');
    const track2 = trackBuilder([[b1, 2], [b1, 1], [hh1, 1], [b1, 3], [hh1,1]], 'track2');
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