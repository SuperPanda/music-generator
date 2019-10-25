import {clip, midi } from "scribbletune"
import wu from "wu";

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
    repeat?: number;
}

export default class DrumPattern {
    private numberOfBars: number;
    private subdivisions: number;
    //private pattern: string[];
    private when: number[];
    private filename: string;
    private repeat: number;
    
    constructor(name: string = 'emptydrums', drumPatternOpts?: DrumPatternOpts){
        this.numberOfBars = drumPatternOpts!.numberOfBars || 1;
        this.subdivisions = drumPatternOpts!.subdivisions || 16;
        this.filename = name;
        this.when = drumPatternOpts!.when || [];
        //this.pattern = _generateDrumPattern(this.numberOfBars, this.subdivisions, drumPatternOpts!.when || [])
        this.repeat = drumPatternOpts!.repeat || 1;
    }

    show(){
        return this.pattern.join('').repeat(this.repeat);
    }

    get pattern() {
        return _generateDrumPattern(this.numberOfBars, this.subdivisions, this.when)        
    }

    save(){
        midi(clip({
            notes: 'c4',
            pattern: this.show(),
            subdiv: `${this.subdivisions}n`,
        }), (this.filename.endsWith('.mid') ? this.filename : this.filename + '.mid'))
    }

    generate(when: number[]){
        this.when = when;//_generateDrumPattern(this.numberOfBars, this.subdivisions, when);
    }

    _mergeInfo(){
        return {
            numberOfBars: this.numberOfBars,
            pattern: this.pattern,
            subdivisions: this.subdivisions,
            repeat: this.repeat,
            when: this.when,
        }
    }
}
