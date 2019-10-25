import DrumPattern from "./generateDrumPatterns";
import wu from "wu";

// mergePattern
// find the lowest common denominator of subdivisions
export default function mergePattern(pattern1: DrumPattern, pattern2: DrumPattern, name: string){
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
        const _thisWhenpatternForThisRepeat = pattern1Info.when.map(value => value + subdivisions * curr);
        return [...acc, ..._thisWhenpatternForThisRepeat]; 
    }, []);

    const newWhenPattern2 = wu(Array.from(Array(pattern2Info.repeat).keys())).reduce((acc: number[], curr) => {
        // console.log(curr);
        // curr will be the time it is being repeated
        const _thisWhenpatternForThisRepeat = pattern2Info.when.map(value => value + subdivisions * curr + offset);
        return [...acc, ..._thisWhenpatternForThisRepeat]; 
    }, []);
    // console.log(pattern1.show());
    // console.log(pattern2.show());
    return new DrumPattern(name, {
        numberOfBars,
        subdivisions,
        repeat: 1, 
        when: [...newWhenPattern1, ...newWhenPattern2],
    })
    // merge when
    // merge bars
}
