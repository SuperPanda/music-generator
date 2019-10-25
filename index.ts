import * as scribble from 'scribbletune';

const myChords = 'Am F Dm E Am F Dm E F'
// const myChords = 'Am F Dm E Am F Dm E Am'
const myArpOrder = ['1535','6535','1535','1654'];
  //const clips = ['1032', '2032', '4021', '3052'].map(order =>
  const clips = myArpOrder.map(order =>
    // chane ti 3
    scribble.clip({
      pattern: '[xx][xR]'.repeat(4),
      notes: scribble.arp({
        //chords: 'Dm BbM Am FM BbM FM CM Gm',
        chords: myChords,
        count: 8,
        order,
      }),
      accent: 'x-xx--xx',
    })
  );


  const removeNonStringFilter = (value: string | null): value is string => typeof value === 'string';
  
  let bass1 = scribble.clip({
    notes: 'A2',
    pattern: '[-xRx][-xRR][-xRx][-xxR]'.repeat(1),
    randomNotes: scribble.scale('A2 minor').filter<string>(removeNonStringFilter).slice(1), 
    //scribble.scale('A2 minor').slice(1),
    accent: '--x-',
  });

  let bass2 = scribble.clip({
    notes: 'F2',
    pattern: '[-xRx][-xRR][-xRx][-xxR]'.repeat(1),
    randomNotes: scribble.scale('F2 major').filter<string>(removeNonStringFilter).slice(2,5),
    accent: '--x-',
  });
  let bass3 = scribble.clip({
    notes: 'D2',
    pattern: '[-xRx][-xRR][-xRx][-xxR]'.repeat(1),
    randomNotes: scribble.scale('D2 minor').filter<string>(removeNonStringFilter).slice(2,5),
    accent: '--x-',
  });
  let bass4 = scribble.clip({
    notes: 'E2',
    pattern: '[-xRx][-xRR][-xRx][-xxR]'.repeat(1),
    randomNotes: scribble.scale('E2 major').filter<string>(removeNonStringFilter).slice(2,5),
    accent: '--x-',
  });
  console.log(bass1);
  scribble.midi([...bass1, ...bass2, ...bass3, ...bass4], 'bass.mid');

  const chordsClip = scribble.clip({
	// Use chord names directly in the notes array
	// M stands for Major, m stands for minor
    //notes: 'Dm BbM Am FM BbM FM CM Gm',
    notes: myChords,
    pattern: 'x___'.repeat(8),
});

  scribble.midi([].concat(...clips), 'arp.mid');

  scribble.midi(chordsClip, 'chords.mid');
// https://github.com/dinchak/node-easymidi

// kick
const multiple = 8
const kick = scribble.clip({
    notes: 'c4',
    pattern: 'xxxxxxx[xR]xxxxxxx[x[RR]]'.repeat(4 * multiple),
  });
  
  scribble.midi(kick, 'kick.mid');
  
  // closed hats
  const ch = scribble.clip({
    notes: 'c4',
    pattern: '[xR][x[xR]]'.repeat(8  * multiple),
    subdiv: '8n',
    accentLow: 60,
  });
  
  scribble.midi(ch, 'ch.mid');
  
  // open hats
  const oh = scribble.clip({
    notes: 'c4',
    pattern: '[-x][Rx][Rx][Rx]'.repeat(8 * multiple),
  });
  scribble.midi(oh, 'oh.mid');
  
  // snare
const D = '-x-x'; // base pattern
const E = '-[xR]-[Rx]'; // variation
const snare = scribble.clip({
  notes: 'c4',
  pattern: (D + D + E + D + D + E + D + D).repeat(4),
});
  
  scribble.midi(snare, 'snare.mid');
  
