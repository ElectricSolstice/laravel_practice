import React, {Component} from 'react';
import ReactDom from 'react-dom';

export default class InfiniteScroll extends Component {
    /*
     * props expected:
     *
     * containerName: name of what has the elements
     * elementName: name of the individual elements
     * lazyLoad: function to create react component from json
     * eagerLoad: function to create react component from html elements
     * dataKey (optional): json key to get the data of the components to be created
     * onCreate (optional): observer function to take in a callback to call when
     *  an element is created
     */
    constructor(props) {
        super(props);
        this.boundHandleScroll = this.handleScroll.bind(this);
        this.update = this.update.bind(this);
        this.state = {
            elements: [],
            ajaxUrl: "",
            loading: false,
            loadError: null,
            fullyLoaded: false
        };
        if (props.onCreate) {
            props.onCreate(this.update);
        }
    }

    render () {
        var loading = null;
        if (this.state.loadError != null) {
            loading = <p className='loading'>this.state.loadError</p>;
        } else if (this.state.loading) {
            loading = <p className='loading'>Loading...</p>;
        }
        return (<div className="infinite-scroll">
            {this.state.elements}
            {loading}
        </div>);
    }

    componentDidMount () {
        var lazyContainer = document.getElementById(this.props.elementName+'s');
        if (lazyContainer) {
            var containerId = lazyContainer.getAttribute("data-"+this.props.containerName+"-id");
            if (containerId) {
                var domElements = document.getElementsByClassName(this.props.elementName+'-container');
                var initialElements = [];
                for (var i=0;i<domElements.length;++i) {
                    var newElement = this.props.eagerLoad(domElements[i], this.removeElement.bind(this));
                    if (newElement) {
                        initialElements.push(newElement);
                    }
                }
                for (var i=domElements.length-1;i>=0;--i) {
                    domElements[i].remove();
                }
                this.setState({
                    elements: initialElements,
                    ajaxUrl : "/"+this.props.containerName+"/"+containerId+"/"+this.props.elementName+'s'+"/list"
                });
                window.addEventListener('scroll', this.boundHandleScroll);
                window.addEventListener('load', this.boundHandleScroll);
            }
        }
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.boundHandleScroll);
        window.removeEventListener('load', this.boundHandleScroll);
    }

    update(data) {
        this.setState({
            loading: false,
            fullyLoaded: false
        });
        this.handleScroll();
    }

    removeElement(data) {
        for (var i=0; i<this.state.elements.length; i++) {
            if (this.state.elements[i].props.id == data.props.id) {
                this.setState({
                    elements: this.state.elements.slice(0,i).concat(this.state.elements.slice(i+1)),
                    loading: false,
                    fullyLoaded: false
                });
                break;
            }
        }
    }

    addElement(data) {
        if (this.props.dataKey) {
            data = data[this.props.dataKey];
        }
        var newElems = [];
        for (var elem in data) {
            var newElem = this.props.lazyLoad(data[elem], this.removeElement.bind(this));
            newElems.push(newElem);
        }
        if (newElems.length > 0) {
            this.setState({
                elements: this.state.elements.concat(newElems),
                loading: false
            });
        } else {
            this.setState({
                loading: false,
                fullyLoaded: true
            });
        }
    }

    handleScroll (ev) {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && !this.state.loading && !this.state.fullyLoaded) {
            this.setState({
                loading: true,
                loadError: null
            });
            var url = this.state.ajaxUrl+"?offset="+String(this.state.elements.length);
            fetch(url).then(function (response) {
                response.json().then(function (data) {
                    this.addElement(data, true);
                }.bind(this), function (error) {
                    //TODO reattempt?
                    this.setState({
                        loading: false,
                        loadError: "Error processing server response."
                    });
                }.bind(this));
            }.bind(this), function (error) {
                //TODO reattempt to reach the server?
                this.setState({
                    loading: false,
                    loadError: "Error reaching server."
                });
            }.bind(this))
        }
    }
}
