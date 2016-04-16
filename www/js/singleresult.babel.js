app.Result = React.createClass({
    getInitialState: function() {
        return { result: { metadata:{}, objsizes:[], elfsizes:[] } }; 
    },
    componentDidMount: function() {
        $.ajax({
            url: '/v0/result/' + this.props.id,
            dataType: 'json',
            success: function(data) {
                if (this.isMounted)
                {
                    this.setState({result: data});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleSortByTextSize: function(arr) {
        arr.sort(function(r1, r2) { return r2.text - r1.text; });
        this.setState( {result : this.state.result });
    },
    getFileNodes: function (fileresults) {
        var nodes = fileresults.map(function (result){
            return (
                    <tr>
                    <td> {result.benchmark} </td>
                    <td> {result.filename} </td>
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
                <th> Benchmark </th>
                <th> File </th>
                <th> <a href="#" onClick={this.handleSortByTextSize.bind(this, fileresults)}> Text Size </a> </th>
                <th> Data Size </th>
                <th> Bss Size </th>
                </tr>
                {nodes}
            </tbody>
                </table>
        );},
    render: function() {
        var objnodes = this.getFileNodes(this.state.result.objsizes);      
        var elfnodes = this.getFileNodes(this.state.result.elfsizes);      
        return (
                <div className="resultTable">
                <h3> Metadata </h3>
                <div> <label> Title: </label> {this.state.result.metadata.title} </div>
                <div> <label> Toolchain: </label> {this.state.result.metadata.toolchain} </div>
                <div> <label> Date: </label> {this.state.result.metadata.date} </div>
                <h3> Object Files </h3>
                {objnodes}
                <h3> ELF Files </h3>
                {elfnodes}
                </div>
        );
    }
});
