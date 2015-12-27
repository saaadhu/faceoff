app.AllResultsTable = React.createClass({
    render: function() {
        var nodes = 
            this.props.resultsmeta.map(function (metadata){
                return (
                        <tr>
                        <td> {metadata.date} </td>
                        <td> {metadata.title} </td>
                        <td> {metadata.toolchain} </td>
                        <td> <a href={"#result/" + metadata.id}> View </a></td>
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
