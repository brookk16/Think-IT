queue()
    .defer(d3.csv, "data/sales-data.csv")
    .await(makeGraphs);


function makeGraphs(error, salesData) {
    var ndx = crossfilter(salesData);


    show_store_location_selector(ndx);
    

 dc.renderAll(); 
}

function show_store_location_selector(ndx) {
    var stateDim = ndx.dimension(dc.pluck('store_location'));
    var stateSelect = stateDim.group();

    dc.selectMenu("#store-location-selector")
        .dimension(stateDim)
        .group(stateSelect);

}

