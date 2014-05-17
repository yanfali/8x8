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

        function buildTableBody() {
            var $tbody = $('tbody');
            var trTemplate = _.template($('#tr-template').text());
            var markup = _.reduce([0, 8, 16, 24, 32, 40, 48, 56], function(result, value, index) {
                result.push(trTemplate({
                    row: index,
                    offset: value
                }));
                return result;
            }, []);
            $tbody.append(markup);
        }

        buildTableBody();

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

        function calcPos(x, y) {
            return y * 8 + x;
        }

        $('.rotate').bind('click', _.debounce(function(evt) {
            evt.preventDefault();
            var newModel = [];
            var p1 = 0,
                p2 = 0,
                p3 = 0,
                p4 = 0;
            for (var o = 0; o < 4; o++) {
                var x, y, x1, y1, x2, y2, x3, y3;
                x = y = y1 = x3 = o;
	       	x1 = x2 = y2 = y3 = 7 - o;
                for (var i = 0; i < (8 - o); i++) {
                    p1 = calcPos(x + i, y);
                    p2 = calcPos(x1, y1 + i);
                    p3 = calcPos(x2 - i, y2);
                    p4 = calcPos(x3, y3 - i);
                    newModel[p1] = model[p4];
                    newModel[p2] = model[p1];
                    newModel[p3] = model[p2];
                    newModel[p4] = model[p3];
                }
            }
            model = newModel;
            render(model);
        }, 50));
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
