$(function() {
    app.Router = Backbone.Router.extend({
        routes : {
            "home" : "home",
            "result/:id" : "result",
            "compare/*ids" : "compare",
            "*path": "home"
        },
        home: function() {
            ReactDOM.render(
                    <app.AllResultsTable />,
                document.getElementById('content')
            );
        },
        result: function(id) {
            ReactDOM.render(
                    <app.Result id={id} />,
                document.getElementById('content')
            );
        },
        compare: function(ids) {
            ReactDOM.render(
                    <app.CompareResults ids={ids} />,
                document.getElementById('content')
            );
        }
    });


    var router = new app.Router();
    Backbone.history.start();

    //router.navigate('home', {trigger : true});
});
