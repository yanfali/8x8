/* global _ */
(function() {
    'use strict';
    $(function() {
        var width = 8,
            height = 8,
            debounceMs = 50,
            totalCells = width * height;

        function resetModel(totalCells) {
            return _.map(_.range(totalCells), function() {
                return 0;
            });
        }
        var colors = ['none', 'Chartreuse', 'red', 'yellow'];
        var model = resetModel(totalCells);

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

        function rotate(model, fn) {
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

        function shiftModel(model, fn) {
            var row;
            var newModel = [];
            for (var i = fn.startRow, j = 0; j < width; i++, j++) {
                row = fn(model, i);
                newModel.push(row);
            }
            return _.flatten(newModel);
        }

        function shiftUp(model, offset) {
            var start = (offset * width) % totalCells,
                end = start + width;
            return model.slice(start, end);
        }
        shiftUp.startRow = 1;

        function shiftDown(model, offset) {
            var start = (offset * width) % totalCells,
                end = start + width;
            return model.slice(start, end);
        }
        shiftDown.startRow = 7;

        function shiftLeft(model, offset) {
            var start = (offset * width) % totalCells,
                end = start + width;
            var row = model.slice(start + 1, end);
            row[7] = model.slice(start, start + 1);
            return row;
        }
        shiftLeft.startRow = 0;

        function shiftRight(model, offset) {
            var start = (offset * width) % totalCells,
                end = start + width;
            var row = model.slice(end - 1, end).concat(model.slice(start, end - 1));
            return row;
        }
        shiftRight.startRow = 0;

        function makeCommand(baseFn, actionFn) {
            return _.debounce(function(evt) {
                evt.preventDefault();
                model = baseFn(model, actionFn);
                render(model);
            }, debounceMs);
        }

        $('.erase').bind('click', makeCommand(_.partial(resetModel, totalCells)));

        $('.rotate-right').bind('click', makeCommand(rotate, clockwise));
        $('.rotate-left').bind('click', makeCommand(rotate, counterClockwise));

        $('.up').bind('click', makeCommand(shiftModel, shiftUp));
        $('.down').bind('click', makeCommand(shiftModel, shiftDown));
        $('.left').bind('click', makeCommand(shiftModel, shiftLeft));
        $('.right').bind('click', makeCommand(shiftModel, shiftRight));

        window.eightbyeight = {
            model: model
        };
        });
    })();
