queue()
    .defer(d3.csv, "data/sales-data.csv")
    .await(makeGraphs);


function makeGraphs(error, salesData) {
    var ndx = crossfilter(salesData);

    salesData.forEach(function(d) {
        d.earned = parseInt(d.earned);
        d.lost = parseInt(d.lost);
        d.leads = parseInt(d.leads_generated);
        d.appointments_generated = parseInt(d.appointments_generated);
    })

    show_store_location_selector(ndx);
    show_amount_earned_per_store(ndx);
    show_total_earn_and_loss(ndx);
    show_leads_and_appts_per_store(ndx);
    show_number_display_leads_and_appts(ndx);


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

    var average_earn_by_state = stateDim.group().reduce(
        function add_item(p, v) {
            p.count++;
            p.total += v.earned - v.lost;
            p.average = p.total / p.count;
            return p;
        },

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
        },

        function initialise() {
            return { count: 0, total: 0, average: 0 };
        });



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
        .renderTitle(true)
        .title(function(p) {
            return ["Total earnt per person in" + " " + p.key + " " + " is" + " " + "$" + p.value.average.toFixed(2)]
        })
        .xAxisLabel("State")
        .yAxisLabel("Average amount earned per person")
        .yAxis().tickFormat(function(v) {
            return "$" + v;
        })
        

}

function show_total_earn_and_loss(ndx, location, element) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));
    var total_earned_by_state = stateDim.group().reduceSum(dc.pluck("earned")); //DO NOT DELETE! THIS IS THE ONE THAT SHOWS INDIVIDUAL VALUES WHEN CLICKED
    var total_lost_by_state = stateDim.group().reduceSum(dc.pluck("lost"));//DO NOT DELETE! THIS IS THE ONE THAT SHOWS INDIVIDUAL VALUES WHEN CLICKED

    var percent_lost = 


    dc.numberDisplay("#total-amount-earned")
        .formatNumber(d3.format(".2"))
        .group(total_earned_by_state)

    dc.numberDisplay("#total-amount-lost")
        .formatNumber(d3.format(".2"))
        .group(total_lost_by_state)

   // dc.numberDisplay("#percent-loss")
       // .formatNumber(d3.format(".2"))
       // .group(percent_lost)
       // .valueAccessor(function(d) { return d.value.total.toFixed(2); })




}

function show_leads_and_appts_per_store(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var leadsPerState = stateDim.group().reduceSum(dc.pluck("leads_generated"));

    var apptsPerState = stateDim.group().reduceSum(dc.pluck("appointments_generated"));




    dc.barChart("#leads-and-appts-per-store")
        .width(800)
        .height(500)
        .margins({ top: 30, right: 160, bottom: 50, left: 50 })
        .dimension(stateDim)
        .group(leadsPerState, "Total leads")
        .stack(apptsPerState, "Total appointments")
        .legend(dc.legend().x(670).y(280).itemHeight(10).gap(5))
        .transitionDuration(1000)
        .x(d3.scale.ordinal())
        .ordinalColors(['red', 'green'])
        .y(d3.scale.linear().domain([5000, 26000]))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .title(function(p) {
            return ["Total generated in" + " " + p.key + " " + " is" + " " + p.value]})
        .xAxisLabel("State")
        .yAxisLabel("Total amount of leads and appointments generated")
        .yAxis().tickFormat(function(v) {
            return v;
        });
}

function show_number_display_leads_and_appts(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var leadsPerState = stateDim.group().reduceSum(dc.pluck("leads_generated"));

    var apptsPerState = stateDim.group().reduceSum(dc.pluck("appointments_generated"));

    dc.numberDisplay("#total-leads")
        .formatNumber(d3.format(".2")) //Showing same info as graph! should change to leads to appts %
        .group(leadsPerState);


    dc.numberDisplay("#total-appts")
        .formatNumber(d3.format(".2")) 
        .group(apptsPerState);
}
