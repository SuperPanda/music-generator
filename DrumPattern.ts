import {clip, midi } from "scribbletune"
import wu from "wu";
import { DnbDrumPatterns } from './DnbPatternCollection';

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
    when?: number[] | number[][];
    repeat?: number;
    name?: string;
};

export interface DrumPatternCollection {
    hihat: DrumPattern;
    kick: DrumPattern;
    snare: DrumPattern;
};

export default class DrumPattern {

    public static mergePattern(pattern1: DrumPattern, pattern2: DrumPattern, name: string) {
        const pattern1Info = pattern1._mergeInfo();
        const pattern2Info = pattern2._mergeInfo();
        if (pattern1Info.subdivisions !== pattern2Info.subdivisions){
            console.log("Need to implement LCM and readjust subdivisions");
            throw new Error("not implemented");
        }
        // if no sub division renormalization needed
        const subdivisions = pattern1Info.subdivisions;
        const numberOfBars = pattern1Info.numberOfBars * pattern1Info.repeat + pattern2Info.numberOfBars * pattern2Info.repeat;
        const offset = pattern1Info.numberOfBars * pattern1Info.repeat * pattern1Info.subdivisions;  // adjust this when different subdivisions
          const newWhenPattern1 = wu(Array.from(Array(pattern1Info.repeat).keys())).reduce((acc: number[], curr) => {

            const _thisWhenpatternForThisRepeat = pattern1Info.when.map(value => value + subdivisions * curr);
            return [...acc, ..._thisWhenpatternForThisRepeat]; 
        }, []);
    
        const newWhenPattern2 = wu(Array.from(Array(pattern2Info.repeat).keys())).reduce((acc: number[], curr) => {
            const _thisWhenpatternForThisRepeat = pattern2Info.when.map(value => value + subdivisions * curr + offset);
            return [...acc, ..._thisWhenpatternForThisRepeat]; 
        }, []);

        return new DrumPattern(name, {
            numberOfBars,
            subdivisions,
            repeat: 1, 
            when: [...newWhenPattern1, ...newWhenPattern2],
        });

    }
    public static showDrumPatternCollection(patternCollection1: DrumPatternCollection): void{
        console.log(patternCollection1.hihat.show())
        console.log(patternCollection1.kick.show())
        console.log(patternCollection1.snare.show())
        return;
    }
    public static updateDrumPatternCollectionRepeat(patternCollection: DrumPatternCollection, repeat: number): void {
        patternCollection.hihat.repeat = repeat;
        patternCollection.kick.repeat = repeat;
        patternCollection.snare.repeat = repeat;
        return;
    }

    public static saveDrumPatternCollection(patternCollection: DrumPatternCollection) {
        patternCollection.hihat.save();
        patternCollection.snare.save();
        patternCollection.kick.save();
    }

    public static mergeDrumPatternCollection(patternCollection1: DrumPatternCollection, patternCollection2: DrumPatternCollection, name: string = 'unnamed_collection'): DrumPatternCollection {
        if (!patternCollection1 || !patternCollection2) {
            throw new Error("No collection provided");
        }
        
        let { hihat: hithat1, snare: snare1, kick: kick1 } = patternCollection1;
        // TODO: renormalize
        const collection1 = [hithat1, snare1, kick1];
        const measuresOfCollection1 = collection1.map(instrument => (instrument.repeat * instrument.numberOfBars * instrument.subdivisions));
        if (measuresOfCollection1.filter(value => value !== Math.max.apply(this, measuresOfCollection1)).length !== 0){
            throw new Error("Unequal measures of drums in same collection not currently supported for merge " + JSON.stringify(measuresOfCollection1));
        }

        let { hihat: hithat2, snare: snare2, kick: kick2 } = patternCollection2;
        // TODO: renormalize
        const collection2 = [hithat2, snare2, kick2];
        const measuresOfCollection2 = collection2.map(instrument => instrument.repeat * instrument.numberOfBars * instrument.subdivisions);
        if (measuresOfCollection2.filter(value => value !== Math.max.apply(this, measuresOfCollection2)).length > 0){
            throw new Error("Unequal measures of drums in same collection not currently supported for merge" + JSON.stringify(measuresOfCollection2));
        }

        // sub division error conditions is in the merge function
        // const maxRepeatsForPatternCollection1 = Math.max(hithat1.repeat, snare1.repeat, kick1.repeat);
        // const maxRepeatsForPatternCollection2 = Math.max(hithat2.repeat, snare2.repeat, kick2.repeat);
        
        return {
            hihat: DrumPattern.mergePattern(hithat1, hithat2, name+'_hihat'), 
            kick: DrumPattern.mergePattern(kick1, kick2, name+'_kick'),
            snare: DrumPattern.mergePattern(snare1, snare2, name+'_snare'),         
        }
    }


    private numberOfBars: number;
    private subdivisions: number;
    //private pattern: string[];
    private when: number[];
    private filename: string;
    public repeat: number;
    
    constructor(name: string = 'emptydrums', drumPatternOpts?: DrumPatternOpts){
        this.numberOfBars = drumPatternOpts!.numberOfBars || 1;
        this.subdivisions = drumPatternOpts!.subdivisions || 16;
        this.filename = drumPatternOpts!.name || name;
        
        // should add some checks
        if (drumPatternOpts && Array.isArray(drumPatternOpts.when) && Array.isArray(drumPatternOpts.when[0])){
            const _when = drumPatternOpts.when as number[][];
            this.when = _when.map(
                (whenPart: number[], idx: number): number[] => whenPart.map((value: number): number => value + this.subdivisions * idx)).reduce(
                (acc: number[], curr: number[]) => [...acc, ...curr], [])
            
        } else {
            const _when = drumPatternOpts!.when as number[] | undefined;
            this.when = _when || []
        };
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
