app.CompareResults = React.createClass({

    getInitialState: function() {
        return {results: []};
    },
    componentDidMount : function() {
        var el = this.getDOMNode();
        var parts = this.props.ids.split("/");
        var el = this.getDOMNode();
        for (var i = 0; i<parts.length; ++i) {
            var part = parts[i];
            $.ajax({
                url: '/v0/result/' + part,
                dataType: 'json',
                success: function(data) {
                    var results = this.state.results;
                    results.push(data);

                    if (this.state.results.length == parts.length) {
		        results.sort(function(x1,x2){ return x1.metadata.toolchain.localeCompare(x2.metadata.toolchain);});
                    }
                    this.setState({results: results});

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
        var results = this.state.results;
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
                <td> {d.benchmark} </td>
                <td> {d.filename} </td>
                {d.sizes.map(function (text, i){
                    return (i >= toolchainCount ?
                            <td className={text > 0 ? "danger" + Math.min(Math.ceil(text/10), 10) : "" }>{text.toFixed(2)}%</td>
                            :
                            <td> {text} </td>);
                })}
                </tr>)
            );
        });
	var diffHeaderNodes = function(i) {
	        if (i == 0)
	            return null;

		var elements = [];
		for (var j = 0; j<i; j++) {
		     elements.push(<th> {results[j].metadata.toolchain} vs {results[i].metadata.toolchain}</th>);
		}
		return elements;
	     };

        return (
                <table className="table table-striped">
                <tbody>
                <tr>
                <th> Benchmark </th>
                <th> File </th>
            {this.state.results.map(function (r){
                return (<th> {r.metadata.toolchain}</th>)
            })}
            {this.state.results.map(function (r, i){
                return diffHeaderNodes(i);
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

                var data = (elfdata[o.filename] || (elfdata[o.filename] = {}));
                data.benchmark = o.benchmark;
                var sizes = (data.sizes || (data.sizes = []));

		// Ignore if not all toolchains produced a result
                if (i != 0 && sizes[i-1] == null) {
                    return;
                }

                sizes[i] = o.text;
                if (sizes.length > 1 && i != 0) {
                    var count = results.length;
                    for (var k = 0; k<(count - 1); k++)
                        sizes[i + k + results.length - 1] = ((sizes[i] - sizes[k])/sizes[k])*100;
                 }
            });
        });

        var retval = [];
        for (var key in elfdata) {
            var sizes = elfdata[key].sizes;
            // Ignore if not all toolchains produced a result
            if (sizes.length >= toolchainCount) {
                retval.push({ filename: key, benchmark: elfdata[key].benchmark, sizes: sizes});
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
    computeSummaryData: function(results, selector, elfdata) {
        var computeArithmeticMean = function(data) {
            var totalSize = 0;
            for (var i = 0; i<data.length; ++i) {
               totalSize += data[i].text;
            }
            return totalSize / data.length;
        };
        var computeGeometricMean = function(data) {
            var totalSize = 1;
            for (var i = 0; i<data.length; ++i) {
               if (data[i].text != 0 && !isNaN(data[i].text)) {
                 totalSize += Math.log(data[i].text);
               }
            }
            return Math.exp(totalSize/data.length);
        };
        var computeStandardDeviation = function(data) {
            var totalSize = 0;
            for (var i = 0; i<data.length; ++i) {
               totalSize += data[i].text;
            }
            var mean = totalSize / data.length;
            var variance = 0;
            for (var i = 0; i<data.length; ++i) {
               variance += Math.pow(data[i].text - mean, 2);
            }
            return Math.pow(variance/data.length, 0.5);
        };
        var computeImprovementsAndRegressions = function (results, elfdata) {
           var summary = [];
           // One data item per toolchain, except for the baseline
           for (var i = 0; i<results.length - 1; ++i) {
	      summary.push({improvements: 0, regressions: 0, nochanges: 0});
           }
           for (var i = 0; i<elfdata.length; ++i) {
              for (var j = 1; j<results.length; j++) {
                 if (elfdata[i].sizes[j] > elfdata[i].sizes[0])
                   summary[j-1].regressions++;
                 else if (elfdata[i].sizes[j] < elfdata[i].sizes[0])
                   summary[j-1].improvements++;
                 else
                   summary[j-1].nochanges++;
              }
           }
           return summary;
        };
        var getImprovementsRegressionsNodes = function (results) {
	  var elements = [];
	  for (var j = 0; j<results.length; j++) {
	    elements.push((<td> {results[j].regressions} / {results[j].improvements} / {results[j].nochanges} </td>));
	  }
	  return elements;
        }
	return (
        	<table className="table table-striped table-condensed">
                <tbody>
                   <tr>
                     <th> Statistics </th>
                     { results.map(function (r){
                        return (<th> {r.metadata.toolchain} </th>)})
                     }
                   </tr>
                   <tr>
                      <td> Arithmetic Mean </td>
                      { results.map(function (r) {
                           return (<td> {computeArithmeticMean(selector(r)).toFixed(2)} </td>) })
                      }
                   </tr>
		   <tr>
		     <td> Geometric Mean </td>
		     { results.map(function (r) {
			   return (<td> {computeGeometricMean(selector(r)).toFixed(2)} </td>) })
                     }
		   </tr>
		   <tr>
		     <td> Standard Deviation </td>
		     { results.map(function (r) {
			   return (<td> {computeStandardDeviation(selector(r)).toFixed(2)} </td>) })
                     }
		   </tr>
		   <tr>
		     <td> Regressions/Improvements/NoChange</td>
                     <td> NA </td>
		     { 
			getImprovementsRegressionsNodes(computeImprovementsAndRegressions(results, elfdata))
                     }
		   </tr>

                </tbody>
                </table>
        );
    },
    /*
    componentDidUpdate: function() {
        var el = this.getDOMNode();
        app.d3chart.update(el, this.state.results);
    },
    */
    render: function() {
        /* Compute everything only once we have sizes for all toolchains */
        if (this.props.ids.split('/').length != this.state.results.length)
           return null;

        var elfdata = this.computeFileData(this.state.results, function(f) { return f.elfsizes});
        var objdata = this.computeFileData(this.state.results, function(f) { return f.objsizes});
        var elfsummaryNodes = this.computeSummaryData(this.state.results, function(f) { return f.elfsizes}, elfdata);
        var objsummaryNodes = this.computeSummaryData(this.state.results, function(f) { return f.objsizes}, objdata);
        var elfnodes = this.getFileNodes(elfdata);
        var objnodes = this.getFileNodes(objdata);
        return (
                <div className="comparisonTable">
                <h3> ELF Summary </h3>
                {elfsummaryNodes}
                <h3> Object Summary </h3>
                {objsummaryNodes}
                <h3> ELF Files </h3>
                {elfnodes}
                <h3> Object files </h3>
                {objnodes}
                </div>
        );
    }
});
