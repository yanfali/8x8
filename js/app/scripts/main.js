/* global _ */
(function() {
    'use strict';
    $(function() {
        var colors = ['none', 'Chartreuse', 'red', 'yellow'];
        var model = _.map(_.range(64), function() {
            return 0;
        });
        console.log(model);
        $('table td').click(function(evt) {
            var $target = $(evt.target);
            var row = parseInt($target.closest('tr').attr('data-row'), 10);
            var col = parseInt($target.attr('data-col'), 10);
            var item = (row * 8 + col);
            var color = 'none';
            switch (model[item]) {
            case 0:
                color = 1;
                break;
            case 1:
                color = 2;
                break;
            case 2:
                color = 3;
                break;
            default:
                color = 0;
            }
	    model[item] = color;
            $target.css('background', colors[model[item]]);
            console.log('row: ' + row + ' col: ' + col + ' item: ' + item);
        });
        window.eightbyeight = {
            model: model
        };
    });
})();
