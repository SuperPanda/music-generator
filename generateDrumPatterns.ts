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

// mergePattern
// find the lowest common denominator of subdivisions
export function mergePattern(pattern1: DrumPattern, pattern2: DrumPattern, name: string){
    const pattern1Info = pattern1._mergeInfo();
    const pattern2Info = pattern2._mergeInfo();
    if (pattern1Info.subdivisions !== pattern2Info.subdivisions){
        console.log("Need to implement LCM and readjust subdivisions");
        throw new Error("not implemented");
    }
    // else
    const subdivisions = pattern1Info.subdivisions;
    const numberOfBars = pattern1Info.numberOfBars * pattern1Info.repeat + pattern2Info.numberOfBars * pattern2Info.repeat;
    const offset = pattern1Info.numberOfBars * pattern1Info.repeat * pattern1Info.subdivisions;  // adjust this when different subdivisions
    //const pattern2WithOffset = pattern2Info.pattern.map(when => when + offset);
    const newWhenPattern1 = wu(Array.from(Array(pattern1Info.repeat).keys())).reduce((acc: number[], curr) => {
        // curr will be the time it is being repeated
        const _thisWhenpatternForThisRepeat = pattern1Info.when.map(value => value + subdivisions * (curr-1));
        return [...acc, ..._thisWhenpatternForThisRepeat]; 
    }, []);

    const newWhenPattern2 = wu(Array.from(Array(pattern2Info.repeat).keys())).reduce((acc: number[], curr) => {
        // curr will be the time it is being repeated
        const _thisWhenpatternForThisRepeat = pattern2Info.when.map(value => value + subdivisions * (curr-1) + offset);
        return [...acc, ..._thisWhenpatternForThisRepeat]; 
    }, []);

    return new DrumPattern(name, {
        numberOfBars,
        subdivisions,
        repeat: 1, 
        when: [...newWhenPattern1, ...newWhenPattern2],
    })
    // merge when
    // merge bars
}

