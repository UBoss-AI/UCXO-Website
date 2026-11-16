export type TourRect={x:number;y:number;w:number;h:number};
export type TourStep={id:string;screen:string;title:string;text:string;focus:TourRect;click?:[number,number]};
export type TourChapter={id:string;label:string;kicker:string;heading:string;emphasis:string;summary:string;steps:TourStep[]};
export const productTourIntro={
  "brand": "UCXO.AI",
  "heading": "AI-powered business execution",
  "description": "Turn SOPs into workflows. Assign responsibility. Track completion.",
  "promise": "Your business runs. You stay in control.",
  "narration": "UCXO.AI is AI-powered business execution. Turn SOPs into workflows. Assign responsibility. Track completion. Your business runs. You stay in control."
};
export const allTourChapters:TourChapter[]=[
  {
    "id": "udashview",
    "label": "UDashview",
    "kicker": "UDashview",
    "heading": "Your starting point.",
    "emphasis": "See the big picture.",
    "summary": "Company context, department scope, and workspace views.",
    "steps": [
      {
        "id": "workspace",
        "screen": "udashview",
        "title": "Your workspace overview",
        "text": "UDashview. Your starting point. See your company, choose a department, and open the module you need.",
        "focus": {
          "x": 34,
          "y": 19,
          "w": 62,
          "h": 29
        }
      },
      {
        "id": "views",
        "screen": "udashview",
        "title": "Views and department scope",
        "text": "Use Overview for a quick view, or Activity to follow updates. The view controls offer a map, cards, board, and list.",
        "focus": {
          "x": 34,
          "y": 10,
          "w": 62,
          "h": 9
        }
      }
    ]
  },
  {
    "id": "u-and-me",
    "label": "U&Me",
    "kicker": "U&Me",
    "heading": "Your tasks.",
    "emphasis": "Your decisions.",
    "summary": "Use UDO for assignments and UApprove for approval requests.",
    "steps": [
      {
        "id": "my-tasks",
        "screen": "udo",
        "title": "UDO · My Tasks",
        "text": "U&Me. Your tasks and approvals. UDO shows work assigned to you.",
        "focus": {
          "x": 34,
          "y": 10,
          "w": 62,
          "h": 26
        }
      },
      {
        "id": "task-status",
        "screen": "udo",
        "title": "Assignments, status and search",
        "text": "Filter by status, search for a task, or check work you assigned to someone else.",
        "focus": {
          "x": 34,
          "y": 40,
          "w": 62,
          "h": 30
        }
      },
      {
        "id": "approvals",
        "screen": "uapprove",
        "title": "UApprove · Your decision queue",
        "text": "Open UApprove to review requests waiting for your decision. Approve, return, or reject the work.",
        "click": [
          15.5,
          36.2
        ],
        "focus": {
          "x": 34,
          "y": 30,
          "w": 62,
          "h": 22
        }
      }
    ]
  },
  {
    "id": "uspace",
    "label": "USpace",
    "kicker": "USpace",
    "heading": "Everyday work.",
    "emphasis": "In one place.",
    "summary": "Forms, records, workflow runs, and training.",
    "steps": [
      {
        "id": "forms",
        "screen": "uforms",
        "title": "UForms · Published forms",
        "text": "USpace. Where you do the work. Fill published forms in UForms and track your submissions.",
        "focus": {
          "x": 34,
          "y": 45,
          "w": 62,
          "h": 50
        }
      },
      {
        "id": "records",
        "screen": "urecords",
        "title": "URecords · Evidence and documents",
        "text": "URecords stores documents and evidence, with their revision and approval details.",
        "click": [
          15.5,
          53.7
        ],
        "focus": {
          "x": 34,
          "y": 53,
          "w": 62,
          "h": 33
        }
      },
      {
        "id": "runs",
        "screen": "uengine",
        "title": "U-Engine · Workflow runs",
        "text": "U-Engine shows workflow runs, progress, and exceptions. This sample has no runs yet.",
        "click": [
          15.5,
          59.2
        ],
        "focus": {
          "x": 34,
          "y": 10,
          "w": 62,
          "h": 80
        }
      },
      {
        "id": "training",
        "screen": "utraining",
        "title": "UTraining · Assigned learning",
        "text": "UTraining brings together assigned lessons, due dates, and assessments.",
        "click": [
          15.5,
          64.9
        ],
        "focus": {
          "x": 34,
          "y": 43,
          "w": 62,
          "h": 34
        }
      }
    ]
  },
  {
    "id": "umasters",
    "label": "UMaster",
    "kicker": "UMaster",
    "heading": "Set up the business.",
    "emphasis": "Plan the work.",
    "summary": "Objectives, resources, workflow design, and access.",
    "steps": [
      {
        "id": "objectives",
        "screen": "mission-objectives",
        "title": "Mission & Objectives",
        "text": "UMaster. Set up how your business works. Start with Mission and Objectives to define the goal and its owner.",
        "focus": {
          "x": 34,
          "y": 27,
          "w": 62,
          "h": 43
        }
      },
      {
        "id": "work-planning",
        "screen": "work-planner",
        "title": "Work Planner",
        "text": "Work Planner schedules jobs with the people and equipment they need.",
        "click": [
          15.5,
          51.6
        ],
        "focus": {
          "x": 34,
          "y": 29,
          "w": 62,
          "h": 60
        }
      },
      {
        "id": "engine-planning",
        "screen": "engine-planner",
        "title": "Engine Planner",
        "text": "Engine Planner defines the workflow. Test it, get approval, and activate it before execution.",
        "click": [
          15.5,
          57.2
        ],
        "focus": {
          "x": 34,
          "y": 51,
          "w": 62,
          "h": 43
        }
      },
      {
        "id": "people",
        "screen": "hr-master",
        "title": "HR Master",
        "text": "HR Master manages roles, skills, and staff availability.",
        "click": [
          15.5,
          62.8
        ],
        "focus": {
          "x": 34,
          "y": 26,
          "w": 62,
          "h": 62
        }
      },
      {
        "id": "equipment",
        "screen": "machine-master",
        "title": "Machine Master",
        "text": "Machine Master manages equipment capacity, availability, and maintenance.",
        "click": [
          15.5,
          68.3
        ],
        "focus": {
          "x": 34,
          "y": 27,
          "w": 62,
          "h": 61
        }
      },
      {
        "id": "templates",
        "screen": "forms-master",
        "title": "Forms Master",
        "text": "Forms Master creates and publishes the templates your team fills in UForms.",
        "click": [
          15.5,
          74
        ],
        "focus": {
          "x": 34,
          "y": 43,
          "w": 62,
          "h": 31
        }
      },
      {
        "id": "delegation",
        "screen": "delegation-master",
        "title": "Delegation Master",
        "text": "Delegation Master defines who can take over a task or approval, and for how long.",
        "click": [
          15.5,
          79.6
        ],
        "focus": {
          "x": 34,
          "y": 10,
          "w": 62,
          "h": 38
        }
      },
      {
        "id": "access",
        "screen": "uusers",
        "title": "UUsers",
        "text": "UUsers manages user accounts, roles, and access permissions.",
        "click": [
          15.5,
          85.2
        ],
        "focus": {
          "x": 34,
          "y": 10,
          "w": 62,
          "h": 40
        }
      }
    ]
  },
  {
    "id": "upingme",
    "label": "UPingme",
    "kicker": "CONVERSATIONS WITH WORK IN CONTEXT",
    "heading": "Keep conversations",
    "emphasis": "close to the work.",
    "summary": "Explore the conversation overview, inbox, shared tasks, channels, people, and workspace settings.",
    "steps": [
      {
        "id": "conversation-overview",
        "screen": "upingme-dashboard",
        "title": "Your conversation overview",
        "text": "UPingme has its own conversation overview. It brings together unread mentions, unread conversations, open tasks from conversations, and unsubmitted proposals, with links back to the relevant work.",
        "focus": {
          "x": 34,
          "y": 35,
          "w": 62,
          "h": 46
        }
      },
      {
        "id": "inbox",
        "screen": "inbox",
        "title": "Inbox",
        "text": "Select Inbox to find conversations you belong to. Filters separate unread conversations, direct messages, mentions, and activity. The sample shows the ops-planning team channel and its unread conversation.",
        "click": [
          15.5,
          30.7
        ],
        "focus": {
          "x": 34,
          "y": 30,
          "w": 62,
          "h": 33
        }
      },
      {
        "id": "conversation-tasks",
        "screen": "upingme-udo",
        "title": "UDO · Shared tasks",
        "text": "Select UDO to see the same task store used by UCXO. Conversation tasks link back to their source. A message proposal becomes a task only after it is reviewed and submitted.",
        "click": [
          15.5,
          36.2
        ],
        "focus": {
          "x": 34,
          "y": 29,
          "w": 62,
          "h": 42
        }
      },
      {
        "id": "channels",
        "screen": "team-channels",
        "title": "Team channels",
        "text": "Select Team channels to see your channels, open channels you can join, and archived channels. Private channels are visible only to members. The sample separates ops-planning from company-wide plant announcements.",
        "click": [
          15.5,
          48
        ],
        "focus": {
          "x": 34,
          "y": 35,
          "w": 62,
          "h": 60
        }
      },
      {
        "id": "work-conversations",
        "screen": "work-conversations",
        "title": "Work conversations",
        "text": "Select Work conversations to keep a discussion bound to an objective, plan, task, form, record, or work item. Its status and version still come from the object’s own module.",
        "click": [
          15.5,
          53.7
        ],
        "focus": {
          "x": 34,
          "y": 36,
          "w": 62,
          "h": 44
        }
      },
      {
        "id": "calls",
        "screen": "calls",
        "title": "Calls & meetings · Current status",
        "text": "Calls and meetings is visible in the navigation, but the supplied build has no calling provider. This screen explains that calls, scheduling, recording, and transcripts are not currently available.",
        "click": [
          15.5,
          59.3
        ],
        "focus": {
          "x": 34,
          "y": 27,
          "w": 62,
          "h": 27
        }
      },
      {
        "id": "directory",
        "screen": "people-directory",
        "title": "People directory",
        "text": "Select People directory to find colleagues you can message, with teams and roles from UUsers. Active account status is shown; the reference does not provide real-time presence.",
        "click": [
          15.5,
          71.5
        ],
        "focus": {
          "x": 34,
          "y": 26,
          "w": 62,
          "h": 67
        }
      },
      {
        "id": "settings",
        "screen": "workspace-settings",
        "title": "Workspace settings",
        "text": "Select Workspace settings for channel topics, membership, reading and posting permissions, and policy history. The sample user has read-only access. Messages coordinate work; they do not approve or complete it.",
        "click": [
          15.5,
          76.9
        ],
        "focus": {
          "x": 34,
          "y": 25,
          "w": 62,
          "h": 67
        }
      }
    ]
  }
];
// UPingme remains available in source for a future return.
export const tourChapters=allTourChapters.filter(chapter=>chapter.id!=='upingme');
