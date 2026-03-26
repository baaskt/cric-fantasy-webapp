// TODO: Replace this export with an API call when the backend endpoint is ready.
// e.g. export async function fetchDefaultRules() { return fetch('/api/rule-config').then(r => r.json()); }
export const DEFAULT_RULES = {
  match: {
    batting: {
      basePoints: {"type":"scored_segments","segments":[{"label":"Base run points","when":[],"score":{"operation":"multiply","field":"runs","factor":2},"thresholds":[],"default":{"operation":"as_is"}}]},
      milestonePoints: {"type":"scored_segments","segments":[{"label":"Batting milestone","when":[],"score":{"operation":"field","field":"runs"},"thresholds":[{"operator":"gte","value":100,"points":100},{"operator":"gte","value":75,"points":75},{"operator":"gte","value":50,"points":50},{"operator":"gte","value":25,"points":25}],"default":0}]},
      strikeRatePoints: {"type":"scored_segments","segments":[{"label":"High strike rate bonus","when":[{"field":"ballsFaced","operator":"gte","value":10}],"score":{"operation":"ratio","numerator":"runs","denominator":"ballsFaced","factor":100},"thresholds":[{"operator":"gte","value":170,"points":25},{"operator":"gte","value":150,"points":15},{"operator":"gte","value":130,"points":5}],"default":0},{"label":"Low strike rate penalty","when":[{"field":"ballsFaced","operator":"gte","value":10}],"score":{"operation":"ratio","numerator":"runs","denominator":"ballsFaced","factor":100},"thresholds":[{"operator":"lt","value":50,"points":-20},{"operator":"lt","value":70,"points":-10}],"default":0},{"label":"Minimum balls not met — no penalty","when":[],"score":{"operation":"fixed","value":0},"thresholds":[],"default":0}]},
      impact: {"type":"group","rules":{"four":{"type":"scored_segments","segments":[{"label":"Four boundary bonus","when":[],"score":{"operation":"multiply","field":"fours","factor":2},"thresholds":[],"default":{"operation":"as_is"}}]},"six":{"type":"scored_segments","segments":[{"label":"Six boundary bonus","when":[],"score":{"operation":"multiply","field":"sixes","factor":6},"thresholds":[],"default":{"operation":"as_is"}}]},"duck":{"type":"scored_segments","segments":[{"label":"Duck penalty","when":[],"score":{"operation":"multiply","field":"duck","factor":-10},"thresholds":[],"default":{"operation":"as_is"}}]}}},
    },
    bowling: {
      basePoints: {"type":"scored_segments","segments":[{"label":"Base wicket points","when":[],"score":{"operation":"multiply","field":"wickets","factor":25},"thresholds":[],"default":{"operation":"as_is"}}]},
      milestonePoints: {"type":"scored_segments","segments":[{"label":"Bowling milestone","when":[],"score":{"operation":"field","field":"wickets"},"thresholds":[{"operator":"gte","value":6,"points":150},{"operator":"gte","value":5,"points":100},{"operator":"gte","value":4,"points":60},{"operator":"gte","value":3,"points":30},{"operator":"gte","value":2,"points":20}],"default":0}]},
      impact: {"type":"group","rules":{"dotBall":{"type":"scored_segments","segments":[{"label":"Dot ball bonus","when":[],"score":{"operation":"multiply","field":"dots","factor":1},"thresholds":[],"default":{"operation":"as_is"}}]},"maiden":{"type":"scored_segments","segments":[{"label":"Maiden over bonus","when":[],"score":{"operation":"multiply","field":"maidens","factor":25},"thresholds":[],"default":{"operation":"as_is"}}]},"noBall":{"type":"scored_segments","segments":[{"label":"No ball penalty","when":[],"score":{"operation":"multiply","field":"noBalls","factor":-5},"thresholds":[],"default":{"operation":"as_is"}}]}}},
    },
    fielding: {
      basePoints: {"type":"scored_segments","segments":[{"label":"Fielding base points","when":[],"score":{"operation":"weighted_sum","fields":["catches","runouts","stumpings"],"weights":[10,15,15]},"thresholds":[],"default":{"operation":"as_is"}}]},
      milestonePoints: {"type":"scored_segments","segments":[{"label":"Keeper with stumpings","when":[{"field":"isKeeper","operator":"eq","value":true},{"field":"stumpings","operator":"gt","value":0}],"score":{"operation":"sum","fields":["catches","runouts","stumpings"]},"thresholds":[{"operator":"gte","value":20,"points":125},{"operator":"gte","value":15,"points":100}],"default":0},{"label":"Non-keeper fielder","when":[],"score":{"operation":"sum","fields":["catches","runouts"]},"thresholds":[{"operator":"gte","value":15,"points":125},{"operator":"gte","value":10,"points":75}],"default":0}]},
    },
    bonus: {},
  },
  tournament: {
    batting: {
      battingMilestone: {"type":"scored_segments","segments":[{"label":"Tour batting milestone","when":[],"score":{"operation":"field","field":"runs"},"thresholds":[{"operator":"gte","value":700,"points":450},{"operator":"gte","value":600,"points":300},{"operator":"gte","value":450,"points":150},{"operator":"gte","value":300,"points":75}],"default":0}]},
    },
    bowling: {
      bowlingMilestone: {"type":"scored_segments","segments":[{"label":"Tour bowling milestone","when":[],"score":{"operation":"field","field":"wickets"},"thresholds":[{"operator":"gte","value":30,"points":450},{"operator":"gte","value":25,"points":300},{"operator":"gte","value":20,"points":150},{"operator":"gte","value":15,"points":75}],"default":0}]},
    },
    allRounder: {
      milestonePoints: {"type":"scored_segments","segments":[{"label":"Elite all-rounder","when":[{"field":"runs","operator":"gte","value":275},{"field":"wickets","operator":"gte","value":12}],"score":{"operation":"fixed","value":300},"thresholds":[],"default":300},{"label":"Senior all-rounder","when":[{"field":"runs","operator":"gte","value":225},{"field":"wickets","operator":"gte","value":7}],"score":{"operation":"fixed","value":150},"thresholds":[],"default":150},{"label":"Default","when":[],"score":{"operation":"fixed","value":0},"thresholds":[],"default":0}]},
    },
    fielding: {
      fieldingMilestone: {"type":"scored_segments","segments":[{"label":"Tour keeper with stumpings","when":[{"field":"isKeeper","operator":"eq","value":true},{"field":"stumpings","operator":"gt","value":0}],"score":{"operation":"sum","fields":["catches","runouts","stumpings"]},"thresholds":[{"operator":"gte","value":20,"points":125},{"operator":"gte","value":15,"points":100}],"default":0},{"label":"Tour non-keeper fielder","when":[],"score":{"operation":"sum","fields":["catches","runouts"]},"thresholds":[{"operator":"gte","value":15,"points":125},{"operator":"gte","value":10,"points":75}],"default":0}]},
    },
  },
};
