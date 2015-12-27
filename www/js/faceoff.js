    app.Router = Backbone.Router.extend({
        routes : {
            "home" : "home",
            "result/:id" : "result"
        },
        home: function() {
            var mets = [ { 'date': '2015-12-11', 'title' : 'jenkins-othersw-benchmark-282', 'toolchain' : '3.5.0.1667', 'id' : '4334sdfadsf' },
                         { 'date': '2015-12-12', 'title' : 'jenkins-othersw-benchmark-283', 'toolchain' : '3.5.0.1663', 'id' : '883939'}
                       ];
            ReactDOM.render(
                    <app.AllResultsTable resultsmeta={mets} />,
                document.getElementById('content')
            );
        },
        result: function(id) {
            var res = { 'metadata' : { 'date': '2015-12-11', 'title' : 'jenkins-othersw-benchmark-282', 'toolchain' : '3.5.0.1667', 'id' : '4334sdfadsf' }, 'objsizes' : [ {'filename' : './foo.o', 'text' : 200, 'bss' : 400, 'data' : 50 }, {'filename' : './blah.o', 'text' : 400, 'bss' : 200, 'data' : 10 }], 'elfsizes' : [{'filename' : './test1.elf', 'text' : 800, 'bss' : 500, 'data' : 90 }] };
            ReactDOM.render(
                    <app.Result result={res} />,
                document.getElementById('content')
            );
        }
    });

    var router = new app.Router();
    router.navigate('home', {trigger : true});
    Backbone.history.start();
