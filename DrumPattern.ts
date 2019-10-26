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
    hihat?: DrumPattern;
    kick?: DrumPattern;
    snare?: DrumPattern;
};

interface MutableObj<T> {
    exists: boolean;
    obj: T | undefined;
} 
export default class DrumPattern {

    public static mergePattern(pattern1: DrumPattern, pattern2: DrumPattern, name: string) {
        // console.log(JSON.stringify(pattern1));
        // console.log(JSON.stringify(pattern2));
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
        if (patternCollection1.hihat)
            console.log(patternCollection1.hihat.show())
        if (patternCollection1.snare)
            console.log(patternCollection1.snare.show())
          if (patternCollection1.kick)
            console.log(patternCollection1.kick.show())

        return;
    }
    public static updateDrumPatternCollectionRepeat(patternCollection: DrumPatternCollection, repeat: number): void {
        patternCollection.hihat!.repeat = repeat;
        patternCollection.kick!.repeat = repeat;
        patternCollection.snare!.repeat = repeat;
        return;
    }

    public static saveDrumPatternCollection(patternCollection: DrumPatternCollection, collectionName?: string) {
        if (patternCollection.hihat)
            patternCollection.hihat.save(collectionName ? collectionName + '_hihat' : undefined);
        if (patternCollection.snare)
            patternCollection.snare.save(collectionName ? collectionName + '_snare' : undefined);
        if (patternCollection.kick)
            patternCollection.kick.save(collectionName ? collectionName + '_kick' : undefined);
    }

    public static mergeDrumPatternCollection(patternCollection1: DrumPatternCollection, patternCollection2: DrumPatternCollection, name: string = 'unnamed_collection'): DrumPatternCollection {
        if (!patternCollection1 || !patternCollection2) {
            throw new Error("No collection provided");
        }
        
        let { hihat: hihat1, snare: snare1, kick: kick1 } = patternCollection1;
        let { hihat: hihat2, snare: snare2, kick: kick2 } = patternCollection2;
        // TODO: renormalize
        const collection1 = [hihat1, snare1, kick1];
        const collection2 = [hihat2, snare2, kick2];
        
        const removeEmptyFilter = (value: DrumPattern | undefined ): value is DrumPattern => !!value;
  
        /////////////
        let collection1NumBars = Math.max.apply(this, collection1.filter(removeEmptyFilter).map(instrument => instrument.numberOfBars));
        let collection2NumBars = Math.max.apply(this, collection2.filter(removeEmptyFilter).map(instrument => instrument.numberOfBars));
        // TODO: re-calculate later
        let collection1Subdivisions = Math.max.apply(this, collection1.filter(removeEmptyFilter).map(instrument => instrument.subdivisions));
        let collection2Subdivisions = Math.max.apply(this, collection2.filter(removeEmptyFilter).map(instrument => instrument.subdivisions));

        const measuresOfCollection1 = collection1.filter(removeEmptyFilter).map(instrument => (instrument.repeat * instrument.numberOfBars * instrument.subdivisions));
        if (measuresOfCollection1.filter(value => value !== Math.max.apply(this, measuresOfCollection1)).length !== 0){
            throw new Error("Unequal measures of drums in same collection not currently supported for merge " + JSON.stringify(measuresOfCollection1));
        }

     
        // TODO: renormalize
 
        const measuresOfCollection2 = collection2.filter(removeEmptyFilter).map(instrument => instrument.repeat * instrument.numberOfBars * instrument.subdivisions);
        if (measuresOfCollection2.filter(value => value !== Math.max.apply(this, measuresOfCollection2)).length > 0){
            throw new Error("Unequal measures of drums in same collection not currently supported for merge" + JSON.stringify(measuresOfCollection2));
        }

        /* if a track exists on one of the objects but not the other,
            initialise it so the tracks line up */

        // Refactor into a reducer for extensibility
        const isAvailable = (obj: DrumPattern | undefined) => !!obj;
        let mutableObjs: { [idx: string] : MutableObj<DrumPattern>} = {
            hihat1: {
                obj: hihat1,
                exists: isAvailable(hihat1),
            } ,
            hihat2: {
                obj: hihat2,
                exists: isAvailable(hihat2),
            },
            snare1: {
                obj: snare1,
                exists: isAvailable(snare1),
            },
            snare2: {
                obj: snare2,
                exists: isAvailable(snare2),
            },
            kick1: {
                obj: kick1,
                exists: isAvailable(kick1),
            },
            kick2: {
                obj: kick2,
                exists: isAvailable(kick2),
            },
        };
        let pairs = [[mutableObjs.hihat1, mutableObjs.hihat2], [mutableObjs.snare1, mutableObjs.snare2], [mutableObjs.kick1, mutableObjs.kick2]];

        pairs.forEach(
            (pair: MutableObj<DrumPattern>[], idx: number, arr: MutableObj<DrumPattern>[][] ) => {
                //console.log(pair[0].exists, pair[1].exists)
                if (!(pair[0].exists) && (pair[1].exists)){
                    arr[idx][0].obj = new DrumPattern(
                        name,
                        {
                          when: [],
                          subdivisions: collection1Subdivisions,
                          numberOfBars: collection1NumBars,
                          
                        }
                    );
                } else if (!(pair[1].exists) && (pair[0].exists)){
                    arr[idx][1].obj = new DrumPattern(
                        name,
                        {
                          when: [],
                          subdivisions: collection2Subdivisions,
                          numberOfBars: collection2NumBars,
                        }
                    );
                }
            }, this
        )
        // console.log(JSON.stringify(pairs, null, 2));

        // sub division error conditions is in the merge function
        // const maxRepeatsForPatternCollection1 = Math.max(hithat1.repeat, snare1.repeat, kick1.repeat);
        // const maxRepeatsForPatternCollection2 = Math.max(hithat2.repeat, snare2.repeat, kick2.repeat);
        // console.log(mutableObjs);
        return {
            hihat: mutableObjs.hihat1.exists ? DrumPattern.mergePattern(<DrumPattern> mutableObjs.hihat1.obj, <DrumPattern> mutableObjs.hihat2.obj, name+'_hihat') : undefined, 
            kick: mutableObjs.kick1.exists ? DrumPattern.mergePattern(<DrumPattern> mutableObjs.kick1.obj, <DrumPattern> mutableObjs.kick2.obj, name+'_kick') : undefined,
            snare: mutableObjs.snare1.exists ? DrumPattern.mergePattern(<DrumPattern> mutableObjs.snare1.obj, <DrumPattern> mutableObjs.snare2.obj, name+'_snare') : undefined,  
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

    save(name? : string){
        let filename = name || this.filename;
        midi(clip({
            notes: 'c4',
            pattern: this.show(),
            subdiv: `${this.subdivisions}n`,
        }), (filename.endsWith('.mid') ? filename : filename + '.mid'))
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
