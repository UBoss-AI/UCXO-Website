import type {SymbolKind} from './scene-data';

// One role palette for homepage cards, the narrated story, and their labels.
export const nodePalette:Record<SymbolKind,number>={
 objective:0xfff4d6,
 human:0x69c8ff,
 agent:0x00e5c4,
 dependency:0xf4f269,
 inputs:0xffbc80,
 skills:0xff79b0,
 tools:0xdce8f2,
 approval:0xffd166,
 exception:0xff665c,
 evidence:0xff9b45,
 monitor:0xc7f464,
 result:0x58e58a,
 run:0xa5f3fc,
 chat:0xff79b0,
};

export function nodeColor(node:{name:string;symbol:SymbolKind}):number{
 if(/evidence/i.test(node.name))return nodePalette.evidence;
 if(/review/i.test(node.name))return nodePalette.approval;
 return nodePalette[node.symbol];
}

export function nodeColorHex(node:{name:string;symbol:SymbolKind}):string{
 return `#${nodeColor(node).toString(16).padStart(6,'0')}`;
}
