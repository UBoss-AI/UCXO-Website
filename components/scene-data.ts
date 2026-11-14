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

// Workflow labels and routes verified against the UCXO Engine Planner reference.
export const workflowScenes:WorkflowScene[] = [
  {
    "title": "Mission & Objectives, Work Planner and Engine Planner",
    "nodes": [
      {
        "name": "Mission & Objectives",
        "status": "PRODUCTION READINESS",
        "symbol": "objective",
        "position": [
          -3,
          1.5,
          0
        ],
        "mobile": [
          -2.55,
          1.5,
          0
        ],
        "explanation": "Start with an accepted objective: prepare next week’s production plan.",
        "core": true,
        "size": 1.45
      },
      {
        "name": "HR Master",
        "status": "PEOPLE AND OWNERSHIP",
        "symbol": "human",
        "position": [
          0,
          2.5,
          0
        ],
        "mobile": [
          0,
          2.5,
          0
        ],
        "explanation": "People and ownership provide context for committed work."
      },
      {
        "name": "Engine Planner",
        "status": "DRAFT WORKFLOW",
        "symbol": "agent",
        "position": [
          0,
          -0.4,
          0
        ],
        "mobile": [
          0,
          -0.4,
          0
        ],
        "explanation": "Bind the objective, committed work and resources to a versioned workflow.",
        "core": true,
        "size": 1.45
      },
      {
        "name": "UForms",
        "status": "READINESS CHECKLIST",
        "symbol": "inputs",
        "position": [
          -3,
          -1.6,
          0
        ],
        "mobile": [
          -2.55,
          -1.6,
          0
        ],
        "explanation": "Capture the readiness checklist using the form / input step."
      },
      {
        "name": "UApprove",
        "status": "NAMED HUMAN REVIEW",
        "symbol": "approval",
        "position": [
          3,
          1.7,
          0
        ],
        "mobile": [
          2.55,
          1.7,
          0
        ],
        "explanation": "A named person must approve the revision before it can be activated."
      },
      {
        "name": "Work Planner",
        "status": "COMMITTED WORK",
        "symbol": "tools",
        "position": [
          3,
          -1.6,
          0
        ],
        "mobile": [
          2.55,
          -1.6,
          0
        ],
        "explanation": "Commit the work and resources that the plan will coordinate."
      }
    ],
    "edges": [
      {
        "from": 0,
        "to": 2
      },
      {
        "from": 1,
        "to": 2
      },
      {
        "from": 3,
        "to": 2
      },
      {
        "from": 5,
        "to": 2
      },
      {
        "from": 2,
        "to": 4,
        "kind": "blocked"
      }
    ]
  },
  {
    "title": "Engine Planner typed workflow",
    "nodes": [
      {
        "name": "Agent action",
        "status": "AI AGENT · CAPACITY SUMMARY",
        "symbol": "agent",
        "position": [
          0,
          0.1,
          0
        ],
        "mobile": [
          0,
          0.1,
          0
        ],
        "explanation": "The capacity summary runs after the line-clearance condition passes.",
        "core": true,
        "size": 1.45
      },
      {
        "name": "Form / input",
        "status": "HUMAN · READINESS CHECKLIST",
        "symbol": "inputs",
        "position": [
          -3,
          1.7,
          0
        ],
        "mobile": [
          -2.55,
          1.7,
          0
        ],
        "explanation": "A person completes the readiness checklist in UForms."
      },
      {
        "name": "Condition",
        "status": "CONTROL · LINE CLEARANCE?",
        "symbol": "dependency",
        "position": [
          0,
          2.8,
          0
        ],
        "mobile": [
          0,
          2.8,
          0
        ],
        "explanation": "Yes continues to the AI action. No routes to a human task for resolution."
      },
      {
        "name": "Human task",
        "status": "HUMAN · RESOLVE DEVIATION",
        "symbol": "human",
        "position": [
          -3,
          -1.4,
          0
        ],
        "mobile": [
          -2.55,
          -1.4,
          0
        ],
        "explanation": "Resolve the clearance deviation in UDO, then re-check the form, up to three times."
      },
      {
        "name": "Integration",
        "status": "SYSTEM · ERP SCHEDULE",
        "symbol": "tools",
        "position": [
          3,
          1.8,
          0
        ],
        "mobile": [
          2.55,
          1.8,
          0
        ],
        "explanation": "Update the ERP schedule after the capacity summary. A sync failure follows the notification path."
      },
      {
        "name": "Approval",
        "status": "HUMAN · RELEASE REVIEW",
        "symbol": "approval",
        "position": [
          1,
          -2,
          0
        ],
        "mobile": [
          0.85,
          -2,
          0
        ],
        "explanation": "A named operations lead approves the release in UApprove."
      },
      {
        "name": "Record output",
        "status": "SYSTEM · APPROVED PLAN",
        "symbol": "evidence",
        "position": [
          3,
          -1.6,
          0
        ],
        "mobile": [
          2.55,
          -1.6,
          0
        ],
        "explanation": "The approved production plan is retained through URecords."
      },
      {
        "name": "End",
        "status": "CONTROL",
        "symbol": "result",
        "position": [
          4.5,
          0.1,
          0
        ],
        "mobile": [
          3.8249999999999997,
          0.1,
          0
        ],
        "explanation": "Complete the configured workflow path."
      }
    ],
    "edges": [
      {
        "from": 1,
        "to": 2
      },
      {
        "from": 2,
        "to": 0
      },
      {
        "from": 2,
        "to": 3,
        "kind": "exception"
      },
      {
        "from": 3,
        "to": 1,
        "kind": "exception"
      },
      {
        "from": 0,
        "to": 4
      },
      {
        "from": 4,
        "to": 5
      },
      {
        "from": 5,
        "to": 6,
        "kind": "blocked"
      },
      {
        "from": 6,
        "to": 7,
        "kind": "blocked"
      }
    ]
  },
  {
    "title": "U-Engine execution and human recovery in UDO",
    "nodes": [
      {
        "name": "UDO",
        "status": "HUMAN · RESOLVE DEVIATION",
        "symbol": "human",
        "position": [
          -3,
          1.7,
          0
        ],
        "mobile": [
          -2.55,
          1.7,
          0
        ],
        "explanation": "The responsible person receives and completes the assigned recovery task in UDO."
      },
      {
        "name": "Agent action",
        "status": "AI AGENT · CAPACITY SUMMARY",
        "symbol": "agent",
        "position": [
          0,
          -0.7,
          0
        ],
        "mobile": [
          0,
          -0.7,
          0
        ],
        "explanation": "The capacity summary can run only when the line-clearance condition passes.",
        "core": true,
        "size": 1.45
      },
      {
        "name": "UApprove",
        "status": "HUMAN · RELEASE REVIEW",
        "symbol": "approval",
        "position": [
          3.2,
          1.7,
          0
        ],
        "mobile": [
          2.72,
          1.7,
          0
        ],
        "explanation": "Release waits for the named approver; U-Engine cannot make this decision."
      },
      {
        "name": "Condition",
        "status": "CONTROL · LINE CLEARANCE?",
        "symbol": "dependency",
        "position": [
          -3,
          -1.1,
          0
        ],
        "mobile": [
          -2.55,
          -1.1,
          0
        ],
        "explanation": "No routes to UDO and back to the readiness checklist. Yes continues to the AI action."
      },
      {
        "name": "Integration",
        "status": "SYSTEM · ERP SCHEDULE",
        "symbol": "tools",
        "position": [
          3.2,
          -1,
          0
        ],
        "mobile": [
          2.72,
          -1,
          0
        ],
        "explanation": "The integration updates the ERP schedule before release approval."
      }
    ],
    "edges": [
      {
        "from": 3,
        "to": 0,
        "kind": "exception"
      },
      {
        "from": 0,
        "to": 3,
        "kind": "exception"
      },
      {
        "from": 3,
        "to": 1
      },
      {
        "from": 1,
        "to": 4
      },
      {
        "from": 4,
        "to": 2,
        "kind": "blocked"
      }
    ]
  },
  {
    "title": "UApprove, URecords and notification recovery",
    "nodes": [
      {
        "name": "UApprove",
        "status": "HUMAN · RELEASE REVIEW",
        "symbol": "approval",
        "position": [
          0,
          0.1,
          0
        ],
        "mobile": [
          0,
          0.1,
          0
        ],
        "explanation": "The named operations lead reviews the evidence and decides whether to approve release.",
        "core": true,
        "size": 1.45
      },
      {
        "name": "URecords",
        "status": "SYSTEM · RECORD OUTPUT",
        "symbol": "evidence",
        "position": [
          -3.2,
          1,
          0
        ],
        "mobile": [
          -2.72,
          1,
          0
        ],
        "explanation": "Retain the approved production plan and its supporting record."
      },
      {
        "name": "U-Engine",
        "status": "APPROVED ACTIVE REVISION",
        "symbol": "monitor",
        "position": [
          0.1,
          2.8,
          0
        ],
        "mobile": [
          0.085,
          2.8,
          0
        ],
        "explanation": "Only a tested, reviewed, approved and activated revision can start a run."
      },
      {
        "name": "Integration",
        "status": "SYSTEM · SYNC FAILED",
        "symbol": "exception",
        "position": [
          -3.1,
          -1.8,
          0
        ],
        "mobile": [
          -2.635,
          -1.8,
          0
        ],
        "explanation": "A failed ERP sync follows the configured notification route."
      },
      {
        "name": "Notification",
        "status": "SYSTEM · NOTIFY PLANNER",
        "symbol": "chat",
        "position": [
          0,
          -2.5,
          0
        ],
        "mobile": [
          0,
          -2.5,
          0
        ],
        "explanation": "Notify the responsible planner of the ERP sync failure. UPingme connects the conversation."
      },
      {
        "name": "End",
        "status": "CONTROL",
        "symbol": "result",
        "position": [
          3.2,
          0.5,
          0
        ],
        "mobile": [
          2.72,
          0.5,
          0
        ],
        "explanation": "The approved record path and notification recovery path each reach End."
      },
      {
        "name": "UPingme",
        "status": "CHAT · REMIND · ESCALATE",
        "symbol": "chat",
        "position": [
          3.3,
          -1.9,
          0
        ],
        "mobile": [
          2.8049999999999997,
          -1.9,
          0
        ],
        "explanation": "Conversations, reminders and escalations reach the responsible person here; approval remains in UApprove."
      }
    ],
    "edges": [
      {
        "from": 2,
        "to": 0,
        "kind": "monitor"
      },
      {
        "from": 0,
        "to": 1,
        "kind": "blocked"
      },
      {
        "from": 1,
        "to": 5,
        "kind": "blocked"
      },
      {
        "from": 3,
        "to": 4,
        "kind": "exception"
      },
      {
        "from": 4,
        "to": 5,
        "kind": "exception"
      },
      {
        "from": 4,
        "to": 6,
        "kind": "monitor"
      }
    ]
  }
];
