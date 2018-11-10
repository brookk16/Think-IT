queue()
    .defer(d3.csv, "data/sales-data.csv")
    .await(makeGraphs);


function makeGraphs(error, salesData) {
    var ndx = crossfilter(salesData);

    salesData.forEach(function(d){
        d.earned = parseInt(d.earned)
        d.lost = parseInt(d.lost);
    })
    
    show_store_location_selector(ndx);
    show_amount_earned_per_store(ndx);
    show_leads_and_appts_per_store(ndx);
    //show_employees(ndx);

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
    
    var amount_earned = ndx.dimension(dc.pluck("earned"));

    function add_item(p, v) {
        p.count++;
        p.total += v.earned - v.lost;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
        p.count--;
        if (p.count == 0) {
            p.total = 0;
            p.average = 0;
        }
        else {
            p.total -= v.earned - v.lost; /*- v.lost*/
            p.average = p.total / p.count;
        }
        return p;
    }

    function initialise() {
        return { count: 0, total: 0, average: 0 };
    }

    var average_earn_by_state = stateDim.group().reduce(add_item, remove_item, initialise);
    
    

    dc.barChart("#amount-gained-lost-per-store")
        .width(800)
        .height(600)
        .margins({ top: 20, right: 20, bottom: 50, left: 60 })
        .dimension(stateDim)
        .group(average_earn_by_state)
        .valueAccessor(function(d) { return d.value.average.toFixed(2); })
        .transitionDuration(1000)
        .x(d3.scale.ordinal())
        .y(d3.scale.linear().domain([5000, 26000]))
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .renderHorizontalGridLines(true)
        .xAxisLabel("State")
        .yAxisLabel("Average amount earned and lost")
        .yAxis().tickFormat(function (v) {
            return "$" + v;
        })
        
        
}

function show_leads_and_appts_per_store(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var totalLeads = stateDim.group().reduceSum(dc.pluck("leads_generated"));

    var totalAppts = stateDim.group().reduceSum(dc.pluck("appointments_generated"));


    dc.barChart("#leads-and-appts-per-store")
        .width(800)
        .height(500)
        .margins({ top: 30, right: 150, bottom: 50, left: 50 })
        .dimension(stateDim)
        .group(totalLeads, "Total leads")
        .stack(totalAppts, "Total appointments generated")
        .legend(dc.legend().x(660).y(250).itemHeight(10).gap(5))
        .transitionDuration(1000)
        .x(d3.scale.ordinal())
        .y(d3.scale.linear().domain([5000, 26000]))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .xAxisLabel("State")
        .yAxisLabel("Total amount of leads and appointments generated")
        .ordinalColors(['red','green'])
        .yAxis().tickFormat(function (v) {
            return  v;
        })
        
}

/*function show_employees(ndx) {

    var amount_earned = ndx.dimension(dc.pluck("earned"));

    var total_earned = amount_earned.group();
    
    
    var employeeDim = ndx.dimension(dc.pluck("full_name"));

    dc.dataTable("#employee-table")
        .width(768)
        .height(480)
        .dimension(total_earned)
        .group(employeeDim)
        .order(d3.descending);

}*/


    
   
    
    
    
    
    
