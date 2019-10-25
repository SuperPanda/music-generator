import {getChordsByProgression, clip, midi } from "scribbletune"
import DrumPattern from './generateDrumPatterns';

/* 
 * DRUMS
 * 
 */

// basic dnb pattern
const hihat = [1,3,5,7,9,11,13,15];
const snare = [5,13];
const kick = [1,11];


const hihatPattern = new DrumPattern('demo-hihat', { when: hihat } );
const snarePattern = new DrumPattern('demo-snare', { when: snare } );
const kickPattern = new DrumPattern('demo-kick', { when: kick } );

console.log(hihatPattern.show());
console.log(snarePattern.show());
console.log(kickPattern.show());

hihatPattern.save();
snarePattern.save();
kickPattern.save();

// Next... have a few patterns
// and be able to concat patterns
