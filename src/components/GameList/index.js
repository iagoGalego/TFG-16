import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

import ReactDOM from "react-dom";
import styles from './styles.scss'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import Chip from 'react-toolbox/lib/chip'
import Input from 'react-toolbox/lib/input';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import { autobind } from 'core-decorators'
import {Button, IconButton} from 'react-toolbox/lib/button';
import { Route } from "react-router-dom";
import QuestionnaireDialog from '../QuestionnaireDialog'
import ProgressBar from 'react-toolbox/lib/progress_bar';

import {
    getAllGames, saveQuestionnaire, deleteGame, getQuestionnairesByName,
    setSelectedQuestionnaire, getAllDesigners, getTagsByName, getGamesByQuery, addGamesByQuery
} from "./Actions";
import {setTitle} from "../Layout/Actions";

const messages = defineMessages({
    title : {
        id : 'games.title',
        description : 'Games page title',
        defaultMessage : 'Game List'
    },
    mandatory: {
        id: 'questionnaires.input.isMandatory',
        description : 'Message to show when a mandatory input is not fulfilled',
        defaultMessage: 'This input is mandatory'
    },
    created: {
        id: 'questionnaires.input.isCreated',
        description : 'Message to show when a tag is already created',
        defaultMessage: 'This tag is already created'
    }
});

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles, {allowMultiple: true})
@autobind class GameList extends Component {
    constructor(props){
        super(props);

        this.state = {
            designer: '',
            page: 0,
            pagesize: 10,
            designersAllowed: [],
            metadataTag: '',
            metadata: [],
            isDisabled: false,
            activeDialog: false,
            provider: '',
            loading: true,
            games: [],
            showMetadataMandatory: false,
            showMetadataCreated: false
        }
    }

    componentWillReceiveProps(props){
        if(props.games !== null){
            this.setState({
                loading: false,
                games: [...props.games]
            })
        }
    }

    componentDidMount(){
        this.props.getAllDesigners();
        this.props.getAllGames(this.state.page, this.state.pagesize);
        this.setState(prevState => ({...prevState, loading: false}));
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title));
        document.addEventListener('scroll', this.trackScrolling, true);
    }

    handleToggleDialog() {
        this.setState(prevState => ({...prevState, activeDialog: !this.state.activeDialog}));
    };

    handleDelete(value){
        this.setState(prevState => ({...prevState, loading: true}), () =>{
            this.forceUpdate();
            this.props.deleteGame(value);
        });
    }

    handleDesignerChange(value){
        if(value !== "all"){
            this.setState(prevState => ({...prevState, designer: value}));
            this.searchGames(value, this.state.metadata, this.state.provider);
        } else {
            this.setState(prevState => ({...prevState, designer: ''}));
            this.searchGames('', this.state.metadata, this.state.provider);
        }

    }

    providerChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                provider: value,
            }
        });
        this.searchGames(this.state.designer, this.state.metadata, value);
    }

    metadataTagChange(value) {
        this.setState((previousState) => {
            return {
                ...previousState,
                metadataTag: value,
                showMetadataMandatory: false,
                showMetadataCreated: false
            }
        });
    }

    addMetadataTag() {
        if(this.state.metadataTag.length === 0)
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showMetadataMandatory: true
                }
            });
        else{
            if(this.state.metadata.find(tag => tag === this.state.metadataTag) === undefined){
                let newMetadata = [...this.state.metadata, this.state.metadataTag];
                this.setState(prevState => ({...prevState, metadataTag: '', metadata: newMetadata}))
                this.searchGames(this.state.designer, newMetadata, this.state.provider);
            } else {
                this.setState((previousState) => {
                    return {
                        ...previousState,
                        showMetadataCreated: true
                    }
                });
            }
        }

    }

    renderMetadataAndActions(game){
        let response = [];
        for(let i = 0; i < game.metadata.length; i++){
            if(game.metadata[i].name === 'tag'){
                response.push(
                    <Chip
                        key = { `${game.metadata[i].metadataValue}-chip` }>
                        { game.metadata[i].metadataValue }
                    </Chip>
                )
            }
        }
        response.push(
            <Route
                key = { `${game.uri}-route` }
                render={({ history}) => (
                <IconButton
                    icon="edit"
                    key = { `${game.uri}-edit` }
                    onClick={ () => {
                        this.setState(prevState => ({...prevState, loading: true}));
                        history.push(`/app/games/${game.uri}/editor`);
                    }}
                />
            )}/>
        );
        response.push(
            <IconButton
                icon="delete"
                key = { `${game.uri}-delete` }
                onClick={() => this.handleDelete(game.uri)}
            />);
        return response
    }

    handleSave(questionnaire){
        this.setState(prevState => ({...prevState, loading: true, activeDialog: !this.state.activeDialog}),() =>{
            this.forceUpdate();
            this.props.saveQuestionnaire(questionnaire);
            this.setState(prevState => ({...prevState, provider: '', designer: []}));
        })
    }

    isBottom() {
        const element = ReactDOM.findDOMNode(this.__gameList);
        return element.scrollHeight - element.scrollTop === element.clientHeight;
    }

    trackScrolling = () => {
        if (this.isBottom()) {
            console.log('header bottom reached');
            let page = this.state.page;
            page +=1;
            this.setState(prevState => ({...prevState, page: page}), () =>{
                this.forceUpdate();
                this.props.addGamesByQuery(page, this.state.pagesize, this.state.designer, this.state.metadata, this.state.provider);
                this.setState(prevState => ({...prevState}))
            });
            document.removeEventListener('scroll', this.trackScrolling);
        }
    };

    renderList(){
        if(this.state.games.length === 0){
            return <div styleName = 'empty'>
                <p>No game was found</p>
            </div>
        } else {
            return <List selectable ripple styleName = 'list'
                         ref = { element => this.__gameList = element}>
                <ListSubHeader caption='Games' />
                {
                    this.state.games.map(
                        (game) => {
                            return <ListItem
                                key={game.uri}
                                caption= {game.translation[0].name}
                                legend={game.translation[0].description}
                                ripple={false}
                                rightActions={ this.renderMetadataAndActions(game) }
                            />
                        }
                    )
                }
                {
                    this.props.loader && this.state.page !== 0?
                        <div styleName="miniLoader">
                            <ProgressBar type='circular' mode='indeterminate'/>
                        </div>
                        :
                        null
                }

            </List>
        }

    }

    getAutocompleteSource(){
        if(this.props.designers !== null){
            return this.props.designers.map(
                ({uri, displayName}) => {
                    return [uri, displayName]
                }).concat([["all", "All"]])
        } else return []
    }

    handleMetadataTagChange(selectedTag){
        let newMetadata = this.state.metadata.filter(id => id !== selectedTag.id);
        this.setState(prevState => ({...prevState, metadata: newMetadata}));
        this.searchGames(this.state.designer, newMetadata, this.state.provider)
    }

    searchGames(designer, metadata, provider){
        let metadataQuery = metadata.map(
            (m) => "tag="+m
        );
        this.setState(prevState => ({...prevState, loading: true}), () =>{
            this.forceUpdate();
            this.props.getGamesByQuery(this.state.page, this.state.pagesize, designer, metadataQuery, provider);
            this.setState(prevState => ({...prevState}))
        })
    }

    render() {

        let { intl: {formatMessage} } = this.props;
        return (
            <div styleName = 'mainContainer'>
                <section styleName = 'multiSelector' >
                    <div>
                        <h1>
                            <FormattedMessage
                                id = 'games.editor.taskDialog.form.inputs.labels.tags'
                                defaultMessage = 'Search Games'
                                description = 'Graph editor - Tasks Dialog - Form Inputs - Labels - Tags'
                            />
                        </h1>
                        <div styleName='columns'>
                            <Input styleName = 'input' type='text' label='Provider'
                                   value={this.state.provider}
                                   onChange = { this.providerChange }
                            />
                            <div
                                styleName = 'autocomplete'
                                ref = { element => this.__autocomplete = element }
                            >
                                <Autocomplete
                                    styleName = 'ac'
                                    direction="down"
                                    multiple={false}
                                    onChange={this.handleDesignerChange}
                                    label="Choose Designer"
                                    suggestionMatch='anywhere'
                                    selectedPosition='below'
                                    source={this.getAutocompleteSource()}
                                    onQueryChange={this.handleQueryChange}
                                    onFocus={(value) => this.handleAutocompleteFocus(value)}
                                    value={this.state.designer}
                                />
                            </div>
                            <div className={styles['metadata']}>
                                <Input
                                    type='text'
                                    label='Metadata tag'
                                    value={this.state.metadataTag}
                                    error = { this.state.showMetadataMandatory && formatMessage(messages.mandatory) || this.state.showMetadataCreated && formatMessage(messages.created) || ''}
                                    onChange = { this.metadataTagChange }
                                />
                                <Button
                                    icon='add'
                                    floating accent mini
                                    className={styles['button']}
                                    onClick={this.addMetadataTag}
                                />
                            </div>
                        </div>
                    </div>
                    <section styleName="chips">
                        {
                            this.state.metadata.map((id) =>
                                <Chip
                                    key = { `${id}-chip` }
                                    deletable
                                    onDeleteClick={() => this.handleMetadataTagChange({id})}>
                                    { id }
                                </Chip>
                            )
                        }
                    </section>
                </section>
                {
                    this.props.games === null || this.state.loading ?
                        <div styleName="loader">
                            <ProgressBar type='circular' mode='indeterminate'/>
                        </div>
                        :
                        this.renderList()
                }
                <div>
                    <Route
                        render={({ history}) => (
                            <Button
                                className = { styles['fullWidth']}
                                label='Add Game'
                                onClick={ () => {
                                    this.setState(prevState => ({...prevState, loading: true}));
                                    history.push(`/app/games/editor`);
                                }}
                                raised
                                accent
                            />
                        )}
                    />
                </div>

                <QuestionnaireDialog
                    active={this.state.activeDialog}
                    onCancel = { this.handleToggleDialog }
                    onSave = { this.handleSave }
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        games: state.GamesState.games,
        designers: state.GamesState.designers,
        loader: state.GamesState.loader
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveQuestionnaire: bindActionCreators(saveQuestionnaire, dispatch),
        selectQuestionnaire: bindActionCreators(setSelectedQuestionnaire, dispatch),
        getQuestionnairesByName: bindActionCreators(getQuestionnairesByName, dispatch),
        getAllGames: bindActionCreators(getAllGames, dispatch),
        getGamesByQuery: bindActionCreators(getGamesByQuery, dispatch),
        addGamesByQuery: bindActionCreators(addGamesByQuery, dispatch),
        setAppTitle: bindActionCreators(setTitle, dispatch),
        deleteGame: bindActionCreators(deleteGame, dispatch),
        getAllDesigners: bindActionCreators(getAllDesigners, dispatch),
        getTagsByName: bindActionCreators(getTagsByName, dispatch),
    }
}

export default injectIntl(GameList)