app.AllResultsTable = React.createClass({
    getInitialState: function() {
        return { results: [] };
    },
    componentDidMount : function() {
        $.ajax({
            url: '/v0/resultmetadata',
            dataType: 'json',
            success: function(data) {
                if (this.isMounted)
                {
                    this.setState({results: data});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCompare: function(e){
        var children = e.target.parentNode.parentNode.getElementsByTagName("input");

        var resultids = [];
        for (var i = 0; i<children.length; ++i) {
            var child = children[i];
            if (child.checked)
                resultids.push(child.name);
        }
        window.location.href="#compare/" + resultids.join("/");
    },
    render: function() {
        var nodes = 
            this.state.results.map(function (r){
                return (
                    <tr>
                    <td>
                    <input type="checkbox"
                    name={r.id} />
                    </td>
                    <td> {r.metadata.date} </td>
                    <td> {r.metadata.title} </td>
                    <td> {r.metadata.toolchain} </td>
                    <td> <a href={"#result/" + r.id}> View </a></td>
                    </tr>
                );
            });
        return (
            <div>
            <div class="btn-group">
            <button type="button" class="btn btn-primary" onClick={this.handleCompare}>Compare</button>
            </div>
            <div className="resultsTable">
            <table className="table table-striped">
            <tbody>
            <tr>
            <th> Select </th>
            <th> Date </th>
            <th> Title </th>
            <th> Toolchain </th>
            <th> Result </th>
            </tr>
            {nodes}
            </tbody>
            </table>
            </div>
            </div>
        );
    }
});
