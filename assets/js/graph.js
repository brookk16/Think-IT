queue()
    .defer(d3.csv, "data/sales-data.csv")
    .await(makeGraphs);


function makeGraphs(error, salesData) {
    var ndx = crossfilter(salesData);

    salesData.forEach(function(d) {
        d.leads_generated = parseInt(d.leads_generated);
        d.appointments_generated = parseInt(d.appointments_generated);
        d.total_amount_earned = parseInt(d.total_amount_earned);
        d.Total_amount_lost = parseInt(d.Total_amount_lost);
        
    })
    
    

    show_store_location_selector(ndx);
    show_amount_earned_per_store(ndx);
    
console.log(salesData);
    dc.renderAll();
}

function show_store_location_selector(ndx) {
    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var stateSelect = stateDim.group();


    dc.selectMenu("#store-location-selector")
        .dimension(stateDim)
        .group(stateSelect);

}















function show_amount_earned_per_store(ndx) {
    var stateDim = ndx.dimension(dc.pluck("store_location"));
    
    var amount_earned = ndx.dimension(dc.pluck("total_amount_earned"))
    
    var total_amount_earned = stateDim.group().reduceSum(dc.pluck("total_amount_earned"));
    
    var amount_lost = ndx.dimension((dc.pluck("Total_amount_lost")))
    
    var total_amount_lost = stateDim.group().reduceSum(dc.pluck("Total_amount_lost"));



    
    dc.barChart("#amount-gained-lost-per-store")
        .width(800)
        .height(400)
        .margins({top: 50, right: 50, bottom: 50, left: 70})
        .dimension(stateDim)
        .group(total_amount_earned, "Total amount earned")
        .stack(total_amount_lost, "Total amount lost")
        .transitionDuration(1000)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .label(function (d) { return d.key })
        .elasticY(true)
        .xAxisLabel("State")
        .yAxisLabel("Total amount earned and lost")
        .yAxis().ticks(23)
        
        
}
    



