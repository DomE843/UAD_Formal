function viewsInit() {
  activityOverview =
    $$(go.Overview, "myOverviewDiv", {
      observed: activityDiagram,
      contentAlignment: go.Spot.Center
    });
  
}