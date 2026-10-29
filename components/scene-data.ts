export type SymbolKind = 'objective' | 'human' | 'agent' | 'dependency' | 'approval' | 'result' | 'inputs' | 'skills' | 'tools' | 'run' | 'evidence' | 'monitor' | 'exception';
export type Position = [number, number, number];
export type WorkflowNode = {
  name: string;
  status: string;
  position: Position;
  mobile: Position;
  symbol: SymbolKind;
  explanation: string;
  core?: boolean;
  amber?: boolean;
  size?: number;
};
export type WorkflowEdge = { from: number; to: number; kind?: 'monitor' | 'blocked' | 'history' | 'exception'; start?: number; end?: number };
export type WorkflowScene = { title: string; nodes: WorkflowNode[]; edges: WorkflowEdge[] };

export const workflowScenes: WorkflowScene[] = [
  {
    title: 'Illustrative draft workflow',
    nodes: [
      { name: 'Objective', status: 'PROPOSED PLAN', position: [-3.1,.5,.5], mobile: [-2.8,.5,.3], symbol: 'objective', core: true, explanation: 'The business objective is the starting point for this illustrative draft. The proposed plan still needs human review.' },
      { name: 'Human Task', status: 'DEFINED OWNER', position: [-.2,2.2,-.5], mobile: [0,2.2,-.3], symbol: 'human', explanation: 'A human-owned task connects the objective to a required approval.' },
      { name: 'Engine Agent', status: 'PROPOSED AI STEP', position: [.1,-.8,.8], mobile: [0,-.7,.5], symbol: 'agent', explanation: 'A reusable Engine Agent is proposed for work whose prerequisite is defined by the dependency.' },
      { name: 'Dependency', status: 'PREREQUISITE', position: [-3,-1.9,.3], mobile: [-2.8,-1.8,.1], symbol: 'dependency', size: 1, explanation: 'This prerequisite connects the objective to the AI step. The draft makes the order of work explicit.' },
      { name: 'Approval', status: 'HUMAN REVIEW', position: [3,1.9,-.1], mobile: [2.8,2,-.1], symbol: 'approval', explanation: 'Both proposed work branches meet at a required human approval before the outcome.' },
      { name: 'Outcome', status: 'PLANNED OUTCOME', position: [3.4,-1.1,.2], mobile: [2.8,-1.6,.1], symbol: 'result', explanation: 'The intended outcome is connected to the approval gate. This is a plan, not completed execution.' },
    ],
    edges: [{from:0,to:1},{from:0,to:3},{from:3,to:2},{from:1,to:4},{from:2,to:4},{from:4,to:5}],
  },
  {
    title: 'One Engine Agent · three separate Runs',
    nodes: [
      { name: 'Engine Agent', status: 'REUSABLE AI WORKER', position: [0,.2,.5], mobile: [0,.1,.4], symbol: 'agent', core: true, size: 1.9, explanation: 'One reusable Engine Agent stays in place. Each execution creates a separate Run in the history branch.' },
      { name: 'Inputs', status: 'EXECUTION CONTEXT', position: [-3.2,1.8,.1], mobile: [-2.8,1.8,0], symbol: 'inputs', explanation: 'Input signals provide context to the Engine Agent at the beginning of an illustrative execution.' },
      { name: 'Approved Skills', status: 'GOVERNED CAPABILITIES', position: [.2,2.8,-.8], mobile: [0,2.6,-.5], symbol: 'skills', size: 1.1, explanation: 'The Engine Agent uses approved, reusable capabilities during execution.' },
      { name: 'Tools', status: 'ILLUSTRATIVE MODULE', position: [-3.1,-1.4,.6], mobile: [-2.8,-.8,.1], symbol: 'tools', explanation: 'A generic tool module illuminates when the illustrative execution uses it.' },
      { name: 'Results', status: 'EXECUTION OUTPUT', position: [3.2,1.8,-.1], mobile: [2.8,1.8,0], symbol: 'result', explanation: 'A result signal leaves the Engine Agent once the illustrative execution produces its output.' },
      { name: 'Run 01', status: 'EXECUTION 01', position: [1,-1.9,1.1], mobile: [-1.3,-2.5,.6], symbol: 'run', size: .72, explanation: 'First in the illustrative execution history. Run 01 has its own identity; it is not a replacement for the Engine Agent.' },
      { name: 'Run 02', status: 'EXECUTION 02', position: [2.6,-1.7,.2], mobile: [.8,-2.5,.3], symbol: 'run', size: .72, explanation: 'Second in the illustrative execution history. A subsequent execution creates Run 02.' },
      { name: 'Run 03', status: 'EXECUTION 03', position: [4.2,-1.3,-.7], mobile: [2.9,-2.5,0], symbol: 'run', size: .72, explanation: 'Third in the illustrative execution history. The same reusable Engine Agent creates another distinct Run.' },
    ],
    edges: [{from:1,to:0},{from:2,to:0},{from:3,to:0},{from:0,to:4},{from:0,to:5,kind:'history'},{from:5,to:6,kind:'history'},{from:6,to:7,kind:'history'}],
  },
  {
    title: 'Human-owned work / Engine Agent work',
    nodes: [
      { name: 'Human Task', status: 'PREREQUISITE COMPLETE', position: [-3,1.7,.3], mobile: [-2.6,1.6,.2], symbol: 'human', explanation: 'The human-owned prerequisite completes first. Its signal hands work to the next eligible Engine Agent.' },
      { name: 'Engine Agent', status: 'WAITING', position: [0,-.7,.6], mobile: [0,-.5,.4], symbol: 'agent', core: true, size: 1.55, explanation: 'This Engine Agent changes from Waiting to Ready only after the human task and shared dependency are complete.' },
      { name: 'Human Review', status: 'WAITING FOR OUTPUT', position: [3.2,1.7,-.4], mobile: [2.6,1.6,-.2], symbol: 'human', explanation: 'The downstream human review stays waiting: the ready AI task has not yet supplied its output.' },
      { name: 'Dependency', status: 'SHARED PREREQUISITE', position: [-3,-1.1,-.3], mobile: [-2.6,-1.3,-.2], symbol: 'dependency', size: 1, explanation: 'This shared prerequisite must be complete before the AI task is ready.' },
      { name: 'Next Agent', status: 'WAITING FOR OUTPUT', position: [3.2,-1,.1], mobile: [2.6,-1.3,.1], symbol: 'agent', explanation: 'Downstream agent work remains waiting until the preceding task supplies its required output.' },
    ],
    edges: [{from:0,to:1,start:1,end:2.4},{from:3,to:1,start:1.3,end:2.4},{from:1,to:2,kind:'blocked'},{from:1,to:4,kind:'blocked'}],
  },
  {
    title: 'Monitoring continues · approval stays with a human',
    nodes: [
      { name: 'Human Approval', status: 'AWAITING HUMAN APPROVAL', position: [0,.1,.7], mobile: [0,.1,.5], symbol: 'approval', core: true, size: 1.7, explanation: 'Evidence stops at this closed gate. Only the required human approver can authorize the next step; the Executor Agent cannot grant it.' },
      { name: 'Evidence', status: 'READY FOR REVIEW', position: [-3.2,1,.2], mobile: [-2.7,1.1,.1], symbol: 'evidence', explanation: 'A stack of supporting evidence arrives at the human approval gate for review.' },
      { name: 'Executor Agent', status: 'MONITORING ONLY', position: [.1,2.8,-.7], mobile: [0,2.6,-.5], symbol: 'monitor', size: 1.05, explanation: 'The Executor Agent monitors the connected workflow and escalates exceptions. Mandatory human approval remains pending.' },
      { name: 'Exception', status: 'ESCALATED', position: [-3.1,-1.8,.4], mobile: [-2.7,-1.7,.2], symbol: 'exception', amber: true, size: .95, explanation: 'An exception follows the amber branch to the responsible human reviewer.' },
      { name: 'Review', status: 'HUMAN DECISION', position: [0,-2.5,.6], mobile: [0,-2.4,.4], symbol: 'human', amber: true, size: 1, explanation: 'A human reviews the escalated exception. Escalation does not open the required approval gate.' },
      { name: 'Outcome', status: 'WAITING FOR APPROVAL', position: [3.2,.5,-.3], mobile: [2.7,.9,-.1], symbol: 'result', explanation: 'The outcome remains waiting. No execution signal is allowed to pass the closed approval gate.' },
      { name: 'Run History', status: 'EXECUTION RECORD', position: [3.3,-1.9,-.5], mobile: [2.7,-1.7,-.3], symbol: 'run', size: .95, explanation: 'Execution history remains available to the monitoring layer while approval is pending.' },
    ],
    edges: [{from:1,to:0,start:.9,end:2.1},{from:0,to:5,kind:'blocked'},{from:5,to:6,kind:'blocked'},{from:2,to:1,kind:'monitor'},{from:2,to:0,kind:'monitor'},{from:2,to:6,kind:'monitor'},{from:3,to:4,kind:'exception',start:2.2,end:4.4}],
  },
];



