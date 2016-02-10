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
    render: function() {
        var nodes = 
            this.state.results.map(function (r){
                return (
                        <tr>
                        <td> {r.metadata.date} </td>
                        <td> {r.metadata.title} </td>
                        <td> {r.metadata.toolchain} </td>
                        <td> <a href={"#result/" + r.id}> View </a></td>
                        </tr>
                );
            });
        return (
                <div className="resultsTable">
                <table className="table table-striped">
                <tbody>
                <tr>
                <th> Date </th>
                <th> Title </th>
                <th> Toolchain </th>
                <th> Result </th>
                </tr>
                {nodes}
            </tbody>
                </table>
                </div>
        );
    }
});
