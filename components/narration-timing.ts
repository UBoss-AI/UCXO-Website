// Kokoro Heart, official hexgrad demo, speed 1.0. Original Chief Engine script.
export const narrationTiming=[
  {
    "duration": 18,
    "points": [
      {
        "at": 0,
        "storyAt": 0
      },
      {
        "at": 3.38,
        "storyAt": 4
      },
      {
        "at": 5.34,
        "storyAt": 9
      },
      {
        "at": 8.98,
        "storyAt": 14
      },
      {
        "at": 12.675,
        "storyAt": 18
      }
    ]
  },
  {
    "duration": 18,
    "points": [
      {
        "at": 0,
        "storyAt": 0
      },
      {
        "at": 2.97,
        "storyAt": 4
      },
      {
        "at": 6.63,
        "storyAt": 8
      },
      {
        "at": 10.65,
        "storyAt": 13
      },
      {
        "at": 15.325,
        "storyAt": 18
      }
    ]
  },
  {
    "duration": 18,
    "points": [
      {
        "at": 0,
        "storyAt": 0
      },
      {
        "at": 4.15,
        "storyAt": 4
      },
      {
        "at": 7.22,
        "storyAt": 8
      },
      {
        "at": 10.3,
        "storyAt": 12
      },
      {
        "at": 13.71,
        "storyAt": 15
      },
      {
        "at": 17.25,
        "storyAt": 18
      }
    ]
  },
  {
    "duration": 21,
    "points": [
      {
        "at": 0,
        "storyAt": 0
      },
      {
        "at": 4.63,
        "storyAt": 4
      },
      {
        "at": 8.11,
        "storyAt": 9
      },
      {
        "at": 11.59,
        "storyAt": 13
      },
      {
        "at": 17.07,
        "storyAt": 17
      },
      {
        "at": 19.975,
        "storyAt": 21
      }
    ]
  }
] as const;
export function narrationStoryTime(chapter:number,time:number){const points=narrationTiming[chapter].points;for(let i=1;i<points.length;i++){if(time<points[i].at){const a=points[i-1],b=points[i];return a.storyAt+(b.storyAt-a.storyAt)*Math.max(0,(time-a.at)/(b.at-a.at));}}return points[points.length-1].storyAt;}
