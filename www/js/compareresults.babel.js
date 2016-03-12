app.CompareResults = React.createClass({
    getInitialState: function() {
        return {results: []};
    },
    componentDidMount : function() {
        var el = this.getDOMNode();
        var results = [
            {
                "metadata": {
                    "toolchain" : "3.4.5.1522"
                },
                "elfsizes": [
                    {"filename": "foo.elf", "text":20, "bss": 40},
                    {"filename": "bar.elf", "text":24, "bss": 44},
                    {"filename": "baz.elf", "text":10, "bss": 22},
                    
                ]
            },
            {
                "metadata": {
                    "toolchain" : "3.4.4.102"
                },
                "elfsizes": [
                    {"filename": "foo.elf", "text":10, "bss": 20},
                    {"filename": "bar.elf", "text":14, "bss": 24},
                    {"filename": "baz.elf", "text":90, "bss": 92},
                    
                ]
            }
        ];
        var parts = this.props.ids.split("/");
        var el = this.getDOMNode();
        for (var i = 0; i<parts.length; ++i) {
            var part = parts[i];
            $.ajax({
                url: '/v0/result/' + part,
                dataType: 'json',
                success: function(data) {
                    //data.elfsizes.sort(function(r1,r2) { return r1.filename.localeCompare(r2.filename)});
                    this.state.results.push(data);
                    this.state.results = this.state.results.sort(function(x1,x2){x2.metadata.toolchain.localeCompare(x1.metadata.toolchain)});
                    this.setState({results: this.state.results});
                    /*
                    if (this.state.results.length == parts.length) {
                        app.d3chart.create(el,  this.state.results);
                    }
                    */
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    },
    getFileNodes: function (elfdata) {
        var toolchainCount = this.state.results.length;
        var baseToolchain = toolchainCount > 1 ? this.state.results[0].metadata.toolchain : "";
        var samesize = function(arr) {
            for(var i = 1; i<arr.length && i<toolchainCount; ++i) {
                if (arr[i] != arr[i-1])
                    return false;
            }
            return true;
        }

        var nodes = elfdata.map(function (d){
            return (
                samesize(d.sizes)
                ? null
                :
                (<tr>
                <td> {d.filename} </td>
                {d.sizes.map(function (text, i){
                    return (i >= toolchainCount ?
                            <td className={text > 0 ? "danger" : "" }>{text.toFixed(2)}%</td>
                            :
                            <td> {text} </td>);
                })}
                </tr>)
            );
        });

        return (
                <table className="table table-striped">
                <tbody>
                <tr>
                <th> File </th>
            {this.state.results.map(function (r){
                return (<th> {r.metadata.toolchain}</th>)
            })}
            {this.state.results.map(function (r, i){
                return (i != 0 ? <th> {baseToolchain} - {r.metadata.toolchain} </th> : null)
            })}
                </tr>
                {nodes}
            </tbody>
                </table>
        );},
    computeFileData: function(results, selector) {
        var toolchainCount = results.length;
        var elfdata = {}
        results.forEach(function(r, i) {
            selector(r).forEach(function (o, j) {
                var sizes = (elfdata[o.filename] || (elfdata[o.filename] = []));
                sizes[i] = o.text;
                if (sizes.length > 1) {
                    sizes[i + results.length - 1] = ((sizes[0] - sizes[i])/sizes[0])*100;
                 }
            });
        });

        var retval = [];
        for (var key in elfdata) {
            var sizes = elfdata[key];
            // Ignore if not all toolchains produced a result
            if (sizes.length >= toolchainCount) {
                retval.push({ filename: key, sizes: sizes});
            }
        }
        retval.sort(function(e1,e2) {
            var f1 = parseFloat(e2.sizes[toolchainCount]);
            var f2 = parseFloat(e1.sizes[toolchainCount]);
            if (f1 > f2)
                return 1;
            if (f1 < f2)
                return -1;
            return 0;
        });
        return retval;
    },
    /*
    componentDidUpdate: function() {
        var el = this.getDOMNode();
        app.d3chart.update(el, this.state.results);
    },
    */
    render: function() {
        var elfdata = this.computeFileData(this.state.results, function(f) { return f.elfsizes});
        var objdata = this.computeFileData(this.state.results, function(f) { return f.objsizes});
        var elfnodes = this.getFileNodes(elfdata);
        var objnodes = this.getFileNodes(objdata);
        return (
                <div className="comparisonTable">
                <h3> Object files </h3>
                {objnodes}
                <h3> ELF Files </h3>
                {elfnodes}
                </div>
        );
    }
});
