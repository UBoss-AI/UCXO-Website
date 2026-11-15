export type ProductScreen = { id: string; label: string; page: number; description: string };
export type ProductPreview = {
  id: string; label: string; kicker: string; heading: string; emphasis: string;
  copy: string; highlights: string[]; screens: ProductScreen[]; note?: string;
};

export const productPreviews: ProductPreview[] = [
  {
    id: 'udashview', label: 'UDashview', kicker: 'YOUR WORKSPACE, AT A GLANCE',
    heading: 'See your workspace.', emphasis: 'Know where to go.',
    copy: 'Start with a clear overview of your UCXO workspace. See your company and department context, explore the workspace map, and open the module you need.',
    highlights: ['Workspace overview', 'Department context', 'Connected modules'],
    screens: [{id:'udashview',label:'Workspace overview',page:1,description:'UCXO UDashview with company and department context, Overview and Activity tabs, and the visible workspace map.'}],
    note: 'The dashboard map continues below the PDF capture. This preview preserves the exact visible screen; it does not invent the missing portion.'
  },
  {
    id: 'u-and-me', label: 'U&Me', kicker: 'YOUR WORK. YOUR DECISIONS.',
    heading: 'Know what', emphasis: 'needs your action.',
    copy: 'Find the work assigned to you in UDO and the decisions waiting for you in UApprove. Keep responsibilities, task status, and required human approvals clear.',
    highlights: ['UDO · My Tasks', 'Assigned to me / by me', 'UApprove · Human decisions'],
    screens: [
      {id:'udo',label:'UDO · My Tasks',page:3,description:'UDO My Tasks with assignment tabs, task status filters, search and the original empty state.'},
      {id:'uapprove',label:'UApprove',page:4,description:'UApprove with Waiting on me, Requested by me, Exceptions and Decided filters, and the original empty state.'}
    ]
  },
  {
    id: 'uspace', label: 'USpace', kicker: 'WHERE EVERYDAY WORK MOVES FORWARD',
    heading: 'Do the work.', emphasis: 'Keep it connected.',
    copy: 'Fill published forms, find controlled records, follow workflow runs, and complete assigned learning. USpace brings the tools for everyday execution into one familiar workspace.',
    highlights: ['Forms & records', 'U-Engine · Workflow runs', 'Assigned learning'],
    screens: [
      {id:'uforms',label:'UForms',page:5,description:'UForms showing the published Production readiness checklist, its version, fields and linked workflow.'},
      {id:'urecords',label:'URecords',page:6,description:'URecords showing the released Packaging line changeover controlled SOP and its revision.'},
      {id:'uengine',label:'U-Engine',page:7,description:'The original UEngine Runs screen, preserving its exact UI label and No runs yet state.'},
      {id:'utraining',label:'UTraining',page:8,description:'UTraining showing the assigned Packaging line safety lesson, progress and assessment requirement.'}
    ]
  },
  {
    id: 'umasters', label: 'UMaster', kicker: 'THE FOUNDATION BEHIND EXECUTION',
    heading: 'Plan with context.', emphasis: 'Execute with clarity.',
    copy: 'Connect objectives and plans to the people, equipment, forms, and access behind them. Set up the resources and rules that support coordinated execution.',
    highlights: ['Objectives & planning', 'People & equipment', 'Templates & access'],
    screens: [
      {id:'engine-planner',label:'Engine Planner',page:11,description:'Engine Planner with the draft production readiness plan, readiness 4/8, named owner and approver, and Not active state.'},
      {id:'mission-objectives',label:'Mission & Objectives',page:9,description:'Mission and Objectives showing the Reliable, evidenced operations mission and objective filters.'},
      {id:'work-planner',label:'Work Planner',page:10,description:'Work Planner with scheduling counts, the production readiness work item and the week timeline.'},
      {id:'hr-master',label:'HR Master',page:12,description:'HR Master with people, roles, skills, working calendars and commitments.'},
      {id:'machine-master',label:'Machine Master',page:13,description:'Machine Master with equipment availability, capacity, working hours and reservations.'},
      {id:'forms-master',label:'Forms Master',page:14,description:'Forms Master with the published, immutable version of the Production readiness checklist.'},
      {id:'delegation-master',label:'Delegation Master',page:15,description:'Delegation Master with its original decision-needed notice and scheduled approval substitution.'},
      {id:'uusers',label:'UUsers',page:16,description:'UUsers with platform identities, account states and administrator access context.'}
    ]
  },
  {
    id: 'upingme', label: 'UPingme', kicker: 'CONVERSATIONS WITH WORK IN CONTEXT',
    heading: 'Keep conversations', emphasis: 'close to the work.',
    copy: 'Find your conversations, coordinate in team channels, and keep discussions linked to the work they concern. Reviewed and submitted task proposals connect back to UDO.',
    highlights: ['Inbox & mentions', 'Team channels', 'Work-linked conversations'],
    screens: [
      {id:'inbox',label:'Inbox',page:17,description:'UPingme Inbox with conversation filters and the original ops-planning unread conversation.'},
      {id:'team-channels',label:'Team channels',page:19,description:'UPingme Team channels showing ops-planning and the company-wide plant-announcements channel.'},
      {id:'work-conversations',label:'Work conversations',page:20,description:'UPingme Work conversations with its original empty state and explanation of work-object links.'},
      {id:'upingme-dashboard',label:'Conversation overview',page:2,description:'UPingme UDashview with unread conversation, mentions, tasks and unsubmitted proposal counts.'}
    ]
  }
];
