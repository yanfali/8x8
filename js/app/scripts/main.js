/* global _ */
(function() {
    'use strict';
    $(function() {
        function resetModel() {
            return _.map(_.range(64), function() {
                return 0;
            });
        }
        var colors = ['none', 'Chartreuse', 'red', 'yellow'];
        var model = resetModel();

        function swap(model, row, col) {
            var a = model[row * 8 + col];
            model[row * 8 + col] = model[col * 8 + row];
            model[col * 8 + row] = a;
        }

        function render(model) {
            var row, col, color;
            for (row = 0; row < 8; row++) {
                var $row = $('tr[data-row="' + row + '"]');
                for (col = 0; col < 8; col++) {
                    var $el = $row.find('td[data-col="' + col + '"]');
                    color = colors[model[row * 8 + col]];
                    $el.css('background', color);
                }
            }
        }
        console.log(model);
        $('table td').bind('click', function(evt) {
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
        $('.rotate').bind('click', function(evt) {
	    evt.preventDefault();
            var row, col;
            for (row = 0; row <= 6; row++) {
                for (col = row + 1; col <= 7; col++) {
                    swap(model, row, col);
                }
            }
            render(model);
        });
        $('.clear').bind('click', function(evt) {
	    evt.preventDefault();
            console.log('reset');
            model = resetModel();
            render(model);
        });
        window.eightbyeight = {
            model: model
        };
    });
})();
