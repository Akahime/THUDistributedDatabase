/**
 * Created by manu on 1/1/18.
 */
var options = [
    {selector: '#staggered-test', offset: 0, callback: function(el) {
        Materialize.toast("This is our ScrollFire Demo!", 1500 );
    } }
];


$(document).ready(function(){
    $('ul.tabs').tabs('select_tab', 'daily');

    Materialize.showStaggeredList("#users");
    Materialize.scrollFire(options);

    if($(".flash-message").length) {
        Materialize.toast($(".flash-message").text(), 3000)
    }
});