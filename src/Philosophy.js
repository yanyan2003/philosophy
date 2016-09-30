import React from 'react';
import rp from 'request-promise';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import {insertPage} from './Database';

const philosophyUrl = 'https://en.wikipedia.org/wiki/Philosophy';

class Philosophy extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getPagesToPhilsophy = this.getPagesToPhilsophy.bind(this);
        this.httpRequest = this.httpRequest.bind(this);
        this.renderList = this.renderList.bind(this);
        this.renderTextField = this.renderTextField.bind(this);
        this.renderButton = this.renderButton.bind(this);

        this.state = ({
            pages: []
        });
    }

    onChange(e) {
        this.setState({
            url: e.target.value
        });
    }

    getTitle(html) {
        return html.match(/<title>(.*?) - .*?<\/title>/)[1];
    }

    getFirstLink(html) {
        var matches = html.match(/ id="bodyContent" [\s\S]*?<p>(?!<\/p>)[\s\S]*?<a href="(\/wiki\/[\s\S]*?)"/i);
        var firstLink = matches && matches.length && matches[1];

        if (firstLink) {
            return 'https://en.wikipedia.org' + firstLink;
        } else {
            return undefined;
        }
    }


    getPagesToPhilsophy(firstUrl) {
        const pages = [];
        const _this = this;

        return new Promise((resolve, reject) => {
            const getPagesRecursive = url => {
                _this.httpRequest(url).then(page => {
                    insertPage(page);
                    return page;
                }).then(page => {
                    var isDuplicate = pages.find(p => p.url === url);
                    var isPhilosophy = page.url === philosophyUrl;

                    if (isDuplicate || isPhilosophy) {
                        pages.push(page);
                        return resolve(pages);
                    } else {
                        pages.push(page);
                        getPagesRecursive(page.firstLink);
                    }
                });
            };

            getPagesRecursive(firstUrl);
        });
    }

    httpRequest(url) {
        const options = {
            method: 'GET',
            uri: url,
            withCredentials: false
        };

        return rp.get(options)
            .then(response => {
                var title = this.getTitle(response);
                var firstLink = this.getFirstLink(response);

                return {
                    title: title,
                    url: url,
                    firstLink: firstLink
                };
            })
            .catch(error => {

            })
    }

    onSubmit() {
        this.getPagesToPhilsophy(this.state.url).then(pages => {
            this.setState({
                pages: pages
            })
        });
    }

    renderList() {
        return this.state.pages.map((page, index) => {
            return <ListItem
                key={page.url}
                primaryText={`${index}. ${page.title}`}
            />
        })
    }

    renderTextField() {
        return <div>
            <TextField
                id="text-field-default"
                hintText="https://en.wikipedia.org/wiki/..."
                onChange={this.onChange}/>
        </div>
    }

    renderButton() {
        return <div>
            <RaisedButton
                className="button"
                label="To Philosophy"
                onMouseDown={this.onSubmit}/>
        </div>
    }

    render() {
        return (
            <div>
                <p className="App-intro">
                    Enter a Wikipedia url below:
                </p>
                {this.renderTextField()}
                {this.renderButton()}
                <div>
                    <List>
                        {this.renderList()}
                    </List>
                </div>
            </div>
        )
    }
}

export default Philosophy;
