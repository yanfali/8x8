/* global _ */
(function() {
    'use strict';
    $(function() {
        var width = 8,
            height = 8;

        function resetModel(width, height) {
            return _.map(_.range(width * height), function() {
                return 0;
            });
        }
        var colors = ['none', 'Chartreuse', 'red', 'yellow'];
        var model = resetModel(width, height);

        function buildTableBody(width, height) {
            var $tbody = $('table.image tbody');
            var trTemplate = _.template($('#tr-template').text());
            var markup = _.reduce(_.range(0, (width * height) - 1, width), function(result, value, index) {
                result.push(trTemplate({
                    row: index,
                    offset: value
                }));
                return result;
            }, []);
            $tbody.append(markup);
        }

        buildTableBody(width, height);

        function render(model) {
            var row, col, color;
            for (row = 0; row < width; row++) {
                var $row = $('tr[data-row="' + row + '"]');
                for (col = 0; col < height; col++) {
                    var $el = $row.find('td[data-col="' + col + '"]');
                    color = colors[model[row * width + col]];
                    $el.css('background', color);
                }
            }
        }

        $('table.image td').bind('click', function(evt) {
            var $target = $(evt.target);
            var row = parseInt($target.closest('tr').attr('data-row'), 10);
            var col = parseInt($target.attr('data-col'), 10);
            var item = (row * width + col);
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
            return y * width + x;
        }

        function rotate(fn) {
            var newModel = [];
            var x, y, x1, y1, x2, y2, x3, y3, p1, p2, p3, p4;
            var rowEnd = width - 1;
            for (var o = 0; o < width / 2; o++) {
                x = y = y1 = x3 = o;
                x1 = x2 = y2 = y3 = rowEnd - o;
                for (var i = 0; i < (width - o); i++) {
                    p1 = calcPos(x + i, y);
                    p2 = calcPos(x1, y1 + i);
                    p3 = calcPos(x2 - i, y2);
                    p4 = calcPos(x3, y3 - i);
                    fn(newModel, model, [p1, p2, p3, p4]);
                }
            }
            return newModel;
        }

        function clockwise(newModel, oldModel, pos) {
            newModel[pos[0]] = oldModel[pos[3]];
            newModel[pos[1]] = oldModel[pos[0]];
            newModel[pos[2]] = oldModel[pos[1]];
            newModel[pos[3]] = oldModel[pos[2]];
        }

        function counterClockwise(newModel, oldModel, pos) {
            newModel[pos[0]] = oldModel[pos[1]];
            newModel[pos[1]] = oldModel[pos[2]];
            newModel[pos[2]] = oldModel[pos[3]];
            newModel[pos[3]] = oldModel[pos[0]];
        }

        $('.rotate-right').bind('click', _.debounce(function(evt) {
            evt.preventDefault();
            model = rotate(clockwise);
            render(model);
        }, 50));

        $('.rotate-left').bind('click', _.debounce(function(evt) {
            evt.preventDefault();
            model = rotate(counterClockwise);
            render(model);
        }, 50));

        $('.erase').bind('click', _.debounce(function(evt) {
            evt.preventDefault();
            model = resetModel(width, height);
            render(model);
        }, 50));

        $('.arrows').bind('click', function(evt) {
            evt.preventDefault();
        });

        window.eightbyeight = {
            model: model
        };
    });
})();
