import {clip, midi } from "scribbletune"

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
    );
}

export interface DrumPatternOpts {
    numberOfBars?: number;
    subdivisions?: number;
    when?: number[];
}

export default class DrumPattern {
    private numberOfBars: number;
    private subdivisions: number;
    private pattern: string[];
    private filename: string;

    
    constructor(name: string = 'emptydrums', drumPatternOpts?: DrumPatternOpts){
        this.numberOfBars = drumPatternOpts!.numberOfBars || 1;
        this.subdivisions = drumPatternOpts!.subdivisions || 16;
        this.filename = name;
        this.pattern = _generateDrumPattern(this.numberOfBars, this.subdivisions, drumPatternOpts!.when || [])
    }

    show(){
        return this.pattern.join('');
    }

    save(repeat = 1){
        midi(clip({
            notes: 'c4',
            pattern: this.pattern.join('').repeat(repeat),
            subdiv: `${this.subdivisions}n`,
        }), (this.filename.endsWith('.mid') ? this.filename : this.filename + '.mid'))
    }

    generate(when: number[]){
        this.pattern = _generateDrumPattern(this.numberOfBars, this.subdivisions, when);
    }
}