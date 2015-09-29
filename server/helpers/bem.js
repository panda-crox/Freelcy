(function () {
    var Bem = function () {};

    Bem.prototype.generateAttrs = function (name, params) {
        var attrs = params.attrs || {};

        attrs.class = [name];

        if (params.mods instanceof Object) {
            for (var i in params.mods) {
                if (params.mods[i] !== false) {
                    attrs.class.push(name + '_' + i + (params.mods[i] === true ? '' : '_' + params.mods[i]));
                }
            }
        }

        if (params.mix instanceof Array) {
            attrs.class = attrs.class.concat(params.mix);
        }

        attrs.class = attrs.class.join(' ');

        for (var i in attrs) {
            if (typeof attrs[i] == 'object') {
                attrs[i] = JSON.stringify(attrs[i]);
            }
        }

        return attrs;
    };


    module.exports = new Bem();
});
