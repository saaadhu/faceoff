app.Result = React.createClass({
    render: function() {
        var getFileNodes = function (fileresults) {
            var nodes = fileresults.map(function (result){
                return (
                        <tr>
                        <td> {result.filename} </td>
                        <td> {result.text} </td>
                        <td> {result.data} </td>
                        <td> {result.bss} </td>
                        </tr>
                );
            });
            return (
                    <table className="table table-striped">
                    <tbody>
                    <tr>
                    <th> File </th>
                    <th> Text Size </th>
                    <th> Data Size </th>
                    <th> Bss Size </th>
                    </tr>
                        {nodes}
                    </tbody>
                    </table>
            );};
        var objnodes = getFileNodes(this.props.result.objsizes);      
        var elfnodes = getFileNodes(this.props.result.elfsizes);      
        return (
                <div className="resultTable">
                <h3> Metadata </h3>
                <div> <label> Title: </label> {this.props.result.metadata.title} </div>
                <div> <label> Toolchain: </label> {this.props.result.metadata.toolchain} </div>
                <div> <label> Date: </label> {this.props.result.metadata.date} </div>
                <h3> Object Files </h3>
                {objnodes}
                <h3> ELF Files </h3>
                {elfnodes}
                </div>
        );
    }
});
