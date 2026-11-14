export type SymbolKind = 'objective' | 'human' | 'agent' | 'dependency' | 'approval' | 'result' | 'inputs' | 'skills' | 'tools' | 'run' | 'evidence' | 'monitor' | 'exception' | 'chat';
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

export const workflowScenes:WorkflowScene[] = [
  {
    "title": "Objective, UMaster context and UForms inputs",
    "nodes": [
      {
        "name": "Objective",
        "status": "PROPOSED PLAN",
        "position": [
          -3.1,
          0.5,
          0.5
        ],
        "mobile": [
          -2.8,
          0.5,
          0.3
        ],
        "symbol": "objective",
        "core": true,
        "explanation": "The business objective is the starting point for this illustrative draft. The proposed plan still needs human review."
      },
      {
        "name": "UMaster",
        "status": "PEOPLE AND RESOURCES",
        "position": [
          -0.2,
          2.2,
          -0.5
        ],
        "mobile": [
          0,
          2.2,
          -0.3
        ],
        "symbol": "tools",
        "explanation": "UMaster provides company people, skills, availability and resource context for the proposed plan."
      },
      {
        "name": "Engine Agent",
        "status": "PROPOSED AI STEP",
        "position": [
          0.1,
          -0.8,
          0.8
        ],
        "mobile": [
          0,
          -0.7,
          0.5
        ],
        "symbol": "agent",
        "explanation": "A reusable Engine Agent is proposed for work whose prerequisite is defined by the dependency."
      },
      {
        "name": "UForms",
        "status": "VALIDATED BUSINESS INPUT",
        "position": [
          -3,
          -1.9,
          0.3
        ],
        "mobile": [
          -2.8,
          -1.8,
          0.1
        ],
        "symbol": "inputs",
        "size": 1,
        "explanation": "UForms captures a validated business submission. Required inputs must be available before dependent work can proceed."
      },
      {
        "name": "UApprove",
        "status": "HUMAN DECISION",
        "position": [
          3,
          1.9,
          -0.1
        ],
        "mobile": [
          2.8,
          2,
          -0.1
        ],
        "symbol": "approval",
        "explanation": "UApprove holds the required human approval gate. The proposed workflow cannot bypass the named decision."
      },
      {
        "name": "Outcome",
        "status": "PLANNED OUTCOME",
        "position": [
          3.4,
          -1.1,
          0.2
        ],
        "mobile": [
          2.8,
          -1.6,
          0.1
        ],
        "symbol": "result",
        "explanation": "The intended outcome is connected to the approval gate. This is a plan, not completed execution."
      }
    ],
    "edges": [
      {
        "from": 0,
        "to": 1
      },
      {
        "from": 0,
        "to": 3
      },
      {
        "from": 3,
        "to": 2
      },
      {
        "from": 1,
        "to": 4
      },
      {
        "from": 2,
        "to": 4
      },
      {
        "from": 4,
        "to": 5
      }
    ]
  },
  {
    "title": "Reusable agents and separate execution Runs",
    "nodes": [
      {
        "name": "Engine Agent",
        "status": "REUSABLE AI WORKER",
        "position": [
          0,
          0.2,
          0.5
        ],
        "mobile": [
          0,
          0.1,
          0.4
        ],
        "symbol": "agent",
        "core": true,
        "size": 1.9,
        "explanation": "One reusable Engine Agent stays in place. Each execution creates a separate Run in the history branch."
      },
      {
        "name": "UForms",
        "status": "STRUCTURED INPUTS",
        "position": [
          -3.2,
          1.8,
          0.1
        ],
        "mobile": [
          -2.8,
          1.8,
          0
        ],
        "symbol": "inputs",
        "explanation": "A UForms response supplies structured context to the reusable agent for this illustrative execution."
      },
      {
        "name": "Approved Skills",
        "status": "GOVERNED CAPABILITIES",
        "position": [
          0.2,
          2.8,
          -0.8
        ],
        "mobile": [
          0,
          2.6,
          -0.5
        ],
        "symbol": "skills",
        "size": 1.1,
        "explanation": "The Engine Agent uses approved, reusable capabilities during execution."
      },
      {
        "name": "Tools",
        "status": "ILLUSTRATIVE MODULE",
        "position": [
          -3.1,
          -1.4,
          0.6
        ],
        "mobile": [
          -2.8,
          -0.8,
          0.1
        ],
        "symbol": "tools",
        "explanation": "A generic tool module illuminates when the illustrative execution uses it."
      },
      {
        "name": "Results",
        "status": "EXECUTION OUTPUT",
        "position": [
          3.2,
          1.8,
          -0.1
        ],
        "mobile": [
          2.8,
          1.8,
          0
        ],
        "symbol": "result",
        "explanation": "A result signal leaves the Engine Agent once the illustrative execution produces its output."
      },
      {
        "name": "Run 01",
        "status": "EXECUTION 01",
        "position": [
          1,
          -1.9,
          1.1
        ],
        "mobile": [
          -1.3,
          -2.5,
          0.6
        ],
        "symbol": "run",
        "size": 0.72,
        "explanation": "First in the illustrative execution history. Run 01 has its own identity; it is not a replacement for the Engine Agent."
      },
      {
        "name": "Run 02",
        "status": "EXECUTION 02",
        "position": [
          2.6,
          -1.7,
          0.2
        ],
        "mobile": [
          0.8,
          -2.5,
          0.3
        ],
        "symbol": "run",
        "size": 0.72,
        "explanation": "Second in the illustrative execution history. A subsequent execution creates Run 02."
      },
      {
        "name": "Run 03",
        "status": "EXECUTION 03",
        "position": [
          4.2,
          -1.3,
          -0.7
        ],
        "mobile": [
          2.9,
          -2.5,
          0
        ],
        "symbol": "run",
        "size": 0.72,
        "explanation": "Third in the illustrative execution history. The same reusable Engine Agent creates another distinct Run."
      }
    ],
    "edges": [
      {
        "from": 1,
        "to": 0
      },
      {
        "from": 2,
        "to": 0
      },
      {
        "from": 3,
        "to": 0
      },
      {
        "from": 0,
        "to": 4
      },
      {
        "from": 0,
        "to": 5,
        "kind": "history"
      },
      {
        "from": 5,
        "to": 6,
        "kind": "history"
      },
      {
        "from": 6,
        "to": 7,
        "kind": "history"
      }
    ]
  },
  {
    "title": "UEngine coordinates UDo assignments and agent work",
    "nodes": [
      {
        "name": "UDo",
        "status": "ASSIGNED HUMAN WORK",
        "position": [
          -3,
          1.7,
          0.3
        ],
        "mobile": [
          -2.6,
          1.6,
          0.2
        ],
        "symbol": "human",
        "explanation": "People receive and complete assigned tasks in UDo. Completion evidence unlocks the next eligible step."
      },
      {
        "name": "Engine Agent",
        "status": "WAITING",
        "position": [
          0,
          -0.7,
          0.6
        ],
        "mobile": [
          0,
          -0.5,
          0.4
        ],
        "symbol": "agent",
        "core": true,
        "size": 1.55,
        "explanation": "This Engine Agent changes from Waiting to Ready only after the human task and shared dependency are complete."
      },
      {
        "name": "UApprove",
        "status": "WAITING FOR EVIDENCE",
        "position": [
          3.2,
          1.7,
          -0.4
        ],
        "mobile": [
          2.6,
          1.6,
          -0.2
        ],
        "symbol": "approval",
        "explanation": "The human decision in UApprove waits for the required output and evidence. UEngine cannot decide on behalf of the approver."
      },
      {
        "name": "Dependency",
        "status": "SHARED PREREQUISITE",
        "position": [
          -3,
          -1.1,
          -0.3
        ],
        "mobile": [
          -2.6,
          -1.3,
          -0.2
        ],
        "symbol": "dependency",
        "size": 1,
        "explanation": "This shared prerequisite must be complete before the AI task is ready."
      },
      {
        "name": "Next Agent",
        "status": "WAITING FOR OUTPUT",
        "position": [
          3.2,
          -1,
          0.1
        ],
        "mobile": [
          2.6,
          -1.3,
          0.1
        ],
        "symbol": "agent",
        "explanation": "Downstream agent work remains waiting until the preceding task supplies its required output."
      }
    ],
    "edges": [
      {
        "from": 0,
        "to": 1,
        "start": 1,
        "end": 2.4
      },
      {
        "from": 3,
        "to": 1,
        "start": 1.3,
        "end": 2.4
      },
      {
        "from": 1,
        "to": 2,
        "kind": "blocked"
      },
      {
        "from": 1,
        "to": 4,
        "kind": "blocked"
      }
    ]
  },
  {
    "title": "UApprove decisions, UPingMe conversations and URecords evidence",
    "nodes": [
      {
        "name": "UApprove",
        "status": "AWAITING HUMAN APPROVAL",
        "position": [
          0,
          0.1,
          0.7
        ],
        "mobile": [
          0,
          0.1,
          0.5
        ],
        "symbol": "approval",
        "core": true,
        "size": 1.7,
        "explanation": "The named approver reviews exact evidence in UApprove. Only their explicit decision can open the configured path."
      },
      {
        "name": "URecords",
        "status": "SUPPORTING EVIDENCE",
        "position": [
          -3.2,
          1,
          0.2
        ],
        "mobile": [
          -2.7,
          1.1,
          0.1
        ],
        "symbol": "evidence",
        "explanation": "URecords / RIS retains supporting evidence and links it to the objective, workflow and execution history."
      },
      {
        "name": "Executor Agent",
        "status": "MONITORING ONLY",
        "position": [
          0.1,
          2.8,
          -0.7
        ],
        "mobile": [
          0,
          2.6,
          -0.5
        ],
        "symbol": "monitor",
        "size": 1.05,
        "explanation": "The Executor Agent monitors the connected workflow and escalates exceptions. Mandatory human approval remains pending."
      },
      {
        "name": "Exception",
        "status": "ESCALATED",
        "position": [
          -3.1,
          -1.8,
          0.4
        ],
        "mobile": [
          -2.7,
          -1.7,
          0.2
        ],
        "symbol": "exception",
        "amber": true,
        "size": 0.95,
        "explanation": "An exception is escalated through UPingMe to the responsible person. Escalation does not approve the work."
      },
      {
        "name": "UPingMe",
        "status": "CHAT · REMIND · ESCALATE",
        "position": [
          0,
          -2.5,
          0.6
        ],
        "mobile": [
          0,
          -2.4,
          0.4
        ],
        "symbol": "chat",
        "amber": false,
        "size": 1,
        "explanation": "UPingMe is the conversation area for chat, notifications, reminders and escalations. People discuss the issue here; the approval decision remains in UApprove."
      },
      {
        "name": "Outcome",
        "status": "WAITING FOR APPROVAL",
        "position": [
          3.2,
          0.5,
          -0.3
        ],
        "mobile": [
          2.7,
          0.9,
          -0.1
        ],
        "symbol": "result",
        "explanation": "The outcome remains waiting. No execution signal is allowed to pass the closed approval gate."
      },
      {
        "name": "Run History",
        "status": "EXECUTION RECORD",
        "position": [
          3.3,
          -1.9,
          -0.5
        ],
        "mobile": [
          2.7,
          -1.7,
          -0.3
        ],
        "symbol": "run",
        "size": 0.95,
        "explanation": "Execution history remains available to the monitoring layer while approval is pending."
      }
    ],
    "edges": [
      {
        "from": 1,
        "to": 0,
        "start": 0.9,
        "end": 2.1
      },
      {
        "from": 0,
        "to": 5,
        "kind": "blocked"
      },
      {
        "from": 5,
        "to": 6,
        "kind": "blocked"
      },
      {
        "from": 2,
        "to": 1,
        "kind": "monitor"
      },
      {
        "from": 2,
        "to": 0,
        "kind": "monitor"
      },
      {
        "from": 2,
        "to": 6,
        "kind": "monitor"
      },
      {
        "from": 3,
        "to": 4,
        "kind": "exception",
        "start": 2.2,
        "end": 4.4
      }
    ]
  }
];
