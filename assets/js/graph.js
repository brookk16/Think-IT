queue()
    .defer(d3.csv, "data/sales-data.csv")
    .await(makeGraphs);


function makeGraphs(error, salesData) {
    var ndx = crossfilter(salesData);

    salesData.forEach(function(d) {
        d.earned = parseInt(d.earned);
        d.lost = parseInt(d.lost);
        d.leads = parseInt(d.leads);
        d.appointments = parseInt(d.appointments);
    })

    show_store_location_selector(ndx);
    show_amount_earned_per_store(ndx);
    show_earn_and_loss(ndx);
    show_leads_and_appts_per_store(ndx);
    show_number_display_leads_and_appts(ndx);


    dc.renderAll();

}

function show_store_location_selector(ndx) {
    var stateDim = ndx.dimension(dc.pluck("store_location"));
    var stateGroup = stateDim.group();

    dc.selectMenu("#store-location-selector")
        .dimension(stateDim)
        .group(stateGroup);
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

function show_earn_and_loss(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));
    var total_earned_by_state = stateDim.group().reduceSum(dc.pluck("earned")); //DO NOT DELETE! THIS IS THE ONE THAT SHOWS INDIVIDUAL VALUES WHEN CLICKED
    var total_lost_by_state = stateDim.group().reduceSum(dc.pluck("lost")); //DO NOT DELETE! THIS IS THE ONE THAT SHOWS INDIVIDUAL VALUES WHEN CLICKED

    var percent_lost = stateDim.group().reduce(
        function add_item(p, v) {
            p.count++;
            p.earned += v.earned;
            p.lost += v.lost;

            return p;
        },

        function remove_item(p, v) {
            p.count--;
            if (p.count == 0) {
                p.earned = 0;
                p.lost = 0;
            }
            else {
                p.earned -= v.earned;
                p.lost -= v.lost;

            }
            return p;
        },

        function initialise() {
            return { count: 0, earned: 0, lost: 0 };
        });



    dc.numberDisplay("#total-amount-earned")
        .formatNumber(d3.format(".2"))
        .group(total_earned_by_state)

    dc.numberDisplay("#total-amount-lost")
        .formatNumber(d3.format(".2"))
        .group(total_lost_by_state)

    dc.numberDisplay("#percent-lost")
        .formatNumber(d3.format(".0%"))
        .group(percent_lost)
        .valueAccessor(function(d) { //works! but get NaN for all other states appart from WASHINGTON (last)
            if (d.count == 0) {
                return 0;
            }
            else {
                return (((d.value.lost / d.value.earned) * 100).toFixed(0)) / 100; // need to /100, as formatNumber seems to add two"00" when % is added
            }
        });
}

function show_leads_and_appts_per_store(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var leadsPerState = stateDim.group().reduceSum(dc.pluck("leads"));

    var apptsPerState = stateDim.group().reduceSum(dc.pluck("appointments"));

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
            return ["Total generated in" + " " + p.key + " " + " is" + " " + p.value]
        })
        .xAxisLabel("State")
        .yAxisLabel("Total amount of leads and appointments generated")
        .yAxis().tickFormat(function(v) {
            return v;
        });
}

function show_number_display_leads_and_appts(ndx) {

    var stateDim = ndx.dimension(dc.pluck("store_location"));

    var monthDim = ndx.dimension(dc.pluck("month"));

    var leads_to_appts = stateDim.group().reduce(
        function add_item(p, v) {
            p.count++;
            p.leads += v.leads;
            p.appts += v.appointments;
            p.percent = (p.appts/p.leads)*100;
            return p;
        },

        function remove_item(p, v) {
            p.count--;
            if (p.count == 0) {
                p.leads = 0;
                p.appts = 0;
                p.percent = 0;
                
            }
            else {
                p.leads -= v.leads;
                p.appts -= v.appointments;
                p.percent = (p.appts/p.leads)*100;
            }
            return p;
        },

        function initialise() {
            return { count: 0, leads: 0, appts: 0, percent: 0 };
        });
    
    

    dc.pieChart("#leads-to-appts")
        .width(400)
        .height(400)
        .radius(100)
        .dimension(stateDim)
        .group(leads_to_appts)
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return d.value.percent; //(((d.value.appts / d.value.leads) * 100).toFixed(0)) / 100; // need to /100, as formatNumber seems to add two"00" when % is added
            }
        })
        .innerRadius(40)
        .externalLabels(50)
        .title(function(p) {
            return ["Average leads to appointments in" + " " + p.key + " " + " is" + " " + p.value.percent.toFixed(0) + "%"]
        })
        .transitionDuration(1000)
        .ordinalColors(['red', '#blue', 'green', 'yellow', 'black', 'pink'])
        ;
        
    
        
        



   
        




}
