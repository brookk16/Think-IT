queue()
    .defer(d3.csv, "data/sales-data.csv")
    .await(makeGraphs);


function makeGraphs(error, salesData) {
    var ndx = crossfilter(salesData);

    salesData.forEach(function(d){
        d.earned = parseInt(d.earned);
        d.lost = parseInt(d.lost);
    })
    
    show_store_location_selector(ndx);
    //show_top_ten(ndx);
    show_amount_earned_per_store(ndx);
    show_leads_and_appts_per_store(ndx);
    

    dc.renderAll();
    
}

function show_store_location_selector(ndx) {
    var stateDim = ndx.dimension(dc.pluck("store_location"));
    var stateSelect = stateDim.group();

    dc.selectMenu("#store-location-selector")
        .dimension(stateDim)
        .group(stateSelect);
}

function show_top_ten(ndx) {
    
}


function show_amount_earned_per_store(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));
    
    var amount_earned = ndx.dimension(dc.pluck("earned"));
    
    var total_amount_earned = amount_earned.group();
    
    var amount_lost = ndx.dimension(dc.pluck("lost"));
    
    var total_amount_lost = amount_lost.group();

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
            p.total -= v.earned - v.lost; 
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
        .colors(['red'])
        .y(d3.scale.linear().domain([5000, 26000]))
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .renderHorizontalGridLines(true)
        .xAxisLabel("State")
        .yAxisLabel("Average amount earned and lost")
        .yAxis().tickFormat(function (v) {
            return "$" + v;
        })
        
   
   dc.numberDisplay("#total-amount-earned")
        .formatNumber(d3.format(".2"))
        .valueAccessor(function(d) { return d.value.total.toFixed(2); })
        .group(average_earn_by_state);
   
    dc.numberDisplay("#average-amount-earned")
        .formatNumber(d3.format(".2"))
        .valueAccessor(function (d) {
            return d.value.average.toFixed(2);
        })
        .group(average_earn_by_state);
        
     /*dc.numberDisplay("#percent-loss")
        .formatNumber(d3.format(".2"))
        .valueAccessor(function (d) {
            
        })
        .group();
        
      (total_amount_earned / 100) = val
      
      (total_amount_lost / val) = %target val
        
        */
        
}

function show_leads_and_appts_per_store(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var totalLeadsPerState = stateDim.group().reduceSum(dc.pluck("leads_generated"));

    var totalApptsPerState = stateDim.group().reduceSum(dc.pluck("appointments_generated"));
    
    var leads = ndx.dimension(dc.pluck("leads_generated"));
    
    var totalLeads = leads.group();
    
    var appts = ndx.dimension(dc.pluck("appointments_generated"));
    
    var totalAppts = appts.group();


    dc.barChart("#leads-and-appts-per-store")
        .width(800)
        .height(500)
        .margins({ top: 30, right: 160, bottom: 50, left: 50 })
        .dimension(stateDim)
        .group(totalLeadsPerState, "Total leads")
        .stack(totalApptsPerState, "Total appointments")
        .legend(dc.legend().x(670).y(280).itemHeight(10).gap(5))
        .transitionDuration(1000)
        .x(d3.scale.ordinal())
        .ordinalColors(['red','green'])
        .y(d3.scale.linear().domain([5000, 26000]))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .xAxisLabel("State")
        .yAxisLabel("Total amount of leads and appointments generated")
        .yAxis().tickFormat(function (v) {
            return  v;
        });
        
    dc.numberDisplay("#total-leads")
        .formatNumber(d3.format(".2"))
        .group(totalLeads);
   
    dc.numberDisplay("#total-appts")
        .formatNumber(d3.format(".2"))
        .group(totalAppts);
        
     /*dc.numberDisplay("#leads-to-appts")
        .formatNumber(d3.format(".2"))
        .valueAccessor(function (d) {
            
        })
        .group();
        
        
        (totalLeads /100) = val
        
        (totalAppts/ val) = %taregt val
        
        */
}
