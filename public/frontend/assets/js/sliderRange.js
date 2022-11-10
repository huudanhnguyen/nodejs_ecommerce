$(function() {
    let urlParams = new URLSearchParams(window.location.search);
    let paramMinPrice = parseInt(urlParams.get('minPrice'))
    let paramMaxPrice = parseInt(urlParams.get('maxPrice'))
    let paramSort     = urlParams.get('sort')
    if(paramSort) {
        $('#filterForm').append(`<input type="hidden" name="sort" value=${paramSort}>`)
        $('#showSortText').text($(`li > a[data-type='${paramSort}']`).text());
    }
    let minPrice      = 0
    let maxPrice      = 500000
    if(paramMinPrice && paramMaxPrice && (paramMinPrice < paramMaxPrice)){
        $("input[name='minPrice']").val(paramMinPrice)
        $("input[name='maxPrice']").val(paramMaxPrice)
        minPrice      = paramMinPrice
        maxPrice      = paramMaxPrice
    }
    $( "#slider-range" ).slider({
        range: true,
        step: 50000,
        min: 50000,
        max: 5000000,
        values: [ minPrice, maxPrice ],
        slide: function( event, ui ) {
            $( "#amount" ).html(ui.values[ 0 ].toLocaleString() + " ₫ - " + ui.values[ 1 ].toLocaleString() + " ₫" );
    $( "#amount1" ).val(ui.values[ 0 ]);
    $( "#amount2" ).val(ui.values[ 1 ]);
        }
    });
    $( "#amount" ).html($( "#slider-range" ).slider( "values", 0 ).toLocaleString() +
    " ₫ - " + $( "#slider-range" ).slider( "values", 1 ).toLocaleString() +" ₫");

    $( "#amount1" ).val($( "#slider-range" ).slider( "values", 0 ));
    $( "#amount2" ).val($( "#slider-range" ).slider( "values", 1 ));
});