import {getChordsByProgression, clip, midi } from "scribbletune"

/* 
 * DRUMS
 * 
 */

function _generateDrumPattern(numberOfBars: number, subdivisions: number, when: number[]){
    const patternTemplate = '-'.repeat(numberOfBars * subdivisions);
    const pattern = patternTemplate.split('');   

    return when.reduce((acc, curr) => {
        if (typeof curr === "number"){
            let next = acc;
            next[curr-1] = 'x';
            return next;
        }
        console.log('unsupported as yet');
        return acc;
    },
    pattern
    ).join('');
}

const numberOfBars = 1;
const subdivisions = 16;

const generateDrumPattern = (when: number[]) => _generateDrumPattern(numberOfBars, subdivisions, when);


// basic dnb pattern
const hihat = [1,3,5,7,9,11,13,15];
const snare = [5,13];
const kick = [1,11];
const hihatPattern = generateDrumPattern(hihat);
const snarePattern = generateDrumPattern(snare);
const kickPattern = generateDrumPattern(kick);

console.log(hihatPattern);
console.log(snarePattern);
console.log(kickPattern);

const repeat = 4;

const generateMidi = (pattern: string, filename: string, opts?: any) => midi(clip({
    notes: 'c4',
    pattern: pattern,
    subdiv: `${subdivisions}n`,
    accentLow: opts && opts.accentLow,
}), filename)

generateMidi(kickPattern, 'test-kick.mid');
generateMidi(snarePattern, 'test-snare.mid');
generateMidi(hihatPattern, 'test-hihat.mid');

// const something = getChordsByProgression("C3 major", "I vi V VI")
//console.log(something);

