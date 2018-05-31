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
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import { autobind } from 'core-decorators'
import {Button, IconButton} from 'react-toolbox/lib/button';
import { Route } from "react-router-dom";
import QuestionnaireDialog from '../QuestionnaireDialog'
import ProgressBar from 'react-toolbox/lib/progress_bar';
import WorkFlowDialog from '../WorkFlowDialog'


import {
    getAllGames, saveQuestionnaire, deleteGame, getQuestionnairesByName,
    setSelectedQuestionnaire, getAllDesigners, getTagsByName, getGamesByQuery, addGamesByQuery
} from "./Actions";
import {setTitle} from "../Layout/Actions";
import {Metadata, ParameterValue, WorkflowTranslation} from "../../common/lib/model";
import Translator from "../../common/lib/model/translator";
import TYPES from "../GameEditor/Actions/types";
import {edit, save} from "../GameEditor/Actions";

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
            pagesize: 9,
            designersAllowed: [],
            metadataTag: '',
            metadata: [],
            isDisabled: false,
            activeDialog: false,
            provider: '',
            loading: true,
            games: [],
            showMetadataMandatory: false,
            showMetadataCreated: false,
            showDialog: false,
            selectedWorkflow: null
        }
    }

    componentWillReceiveProps(props){
        if(props.games !== null){
            if(props.games.length === 0){
                let page = this.state.page;
                page -= 1;
                this.setState({
                    loading: false,
                    page: page
                })
            } else {
                this.setState({
                    loading: false,
                    games: [...props.games]
                })
            }

        }
    }

    componentDidMount(){
        this.props.getAllDesigners();
        this.props.getAllGames(this.state.page, this.state.pagesize);
        this.setState(prevState => ({...prevState, loading: true}));
        this.props.setAppTitle(this.props.intl.formatMessage(messages.title));
        document.addEventListener('scroll', this.trackScrolling, true);
    }

    handleWorkflowDialog(value){
        this.setState(prevState => ({...prevState, showDialog: !this.state.showDialog}))
    }

    handleDelete(value){
        this.setState(prevState => ({...prevState, loading: true}), () =>{
            this.forceUpdate();
            this.props.deleteGame(value);
        });
    }

    handleDesignerChange(value){
        if(value !== "all"){
            this.setState(prevState => ({...prevState, designer: value, page: 0}), () => {
                this.searchGames(value, this.state.metadata, this.state.provider);
            });
        } else {
            this.setState(prevState => ({...prevState, designer: '', page: 0}), () => {
                this.searchGames('', this.state.metadata, this.state.provider);
            });
        }

    }

    providerChange(value) {
        this.setState((previousState) => {return {...previousState, provider: value, page: 0}}, () => {
            this.searchGames(this.state.designer, this.state.metadata, value);
        });
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

    handleSave(payload){
        let { language } = this.props;

        let workflow = {
            executionId: 0,
            executionStatus: 0,
            isSubWorkflow: false,
            name: "",
            description: "",
            startDate: null,
            expiryDate: null,
            metadata: [],
            modificationDate: null,
            provider: "",
            translation: [],
            element: [],
            sequenceFlow: [],
            trigger: null,
            versionNumber: 0,
            isDesignFinished: false,
            isValidated: false,
            designer: ""
        };
        let metadata = payload.metadata.map(
            (m) => {
                let md = new Metadata();
                md.name = "tag";
                md.metadataValue = m.metadataValue;
                return md;
            }
        );

        let translation = new WorkflowTranslation();
        translation.description = payload.description;
        translation.name = payload.name;
        translation.longDescription = payload.longDescription;
        translation.languageCode = language;
        translation.imageUrl = null;
        let newWorkFlow = {
            ...workflow,
            uri: payload.uri,
            translation: translation,
            startDate: payload.startDate,
            expiryDate: payload.expiryDate,
            metadata: metadata,
            modificationDate: payload.modificationDate,
            provider: payload.provider,
            designer: this.props.loggedUser
        };

        let newGraph = {
            nodes: [
                {
                    id: 'start',
                    type: 'start',
                    isInitial: true,
                    isDisabled: false,
                    isRequired: true,
                    x: 100,
                    y: 250
                }, {
                    id: 'end',
                    type: 'end',
                    isFinal: true,
                    isDisabled: false,
                    isRequired: true,
                    x: 400,
                    y: 250
                }
            ],
                links: [
                {
                    from: 'start',
                    fromLevel: 0,
                    to: 'end',
                    toLevel: 0,
                }
            ]
        };
        newGraph.nodes.map(
            (node) => {
                if(!node.operator) node.operator = null;
                else {
                    node.operator = this.props.operators.find(({uri}) => uri === node.operator);
                    let param = new ParameterValue();
                    param.namedParameterValue = node.parameters;
                    param.genURI();
                    param.namedParameter = null;
                    node.parameterValue = [param]
                }
            }
        );

        if(newWorkFlow.uri === ''){
            this.props.save(Translator.toOpenetFormat({workflow: newWorkFlow, graph: newGraph})).then(
                (response) => {
                    if(response.type === TYPES.REQUEST_FAILURE)
                        alert("FAIL");
                    else if(response.type === TYPES.REQUEST_SUCCESS){
                        this.props.getAllDesigners();
                        this.props.getAllGames(0, this.state.pagesize);
                        this.setState(prevState => ({...prevState, loading: true, showDialog: false, page: 0}));
                    }
                }
            );
        } else {
            this.props.edit(Translator.toOpenetFormat({workflow: newWorkFlow, graph: newGraph})).then(
                (response) => {
                    if(response.type === TYPES.REQUEST_FAILURE)
                        alert("FAIL");
                    else if(response.type === TYPES.REQUEST_SUCCESS){
                        this.props.getAllDesigners();
                        this.props.getAllGames(0, this.state.pagesize);
                        this.setState(prevState => ({...prevState, loading: true, showDialog: false, page: 0}));
                    }
                }
            );
        }

    }

    addMetadataTag() {
        if(this.state.metadataTag.length === 0){
            alert("case1")
            this.setState((previousState) => {
                return {
                    ...previousState,
                    showMetadataMandatory: true
                }
            });
        }
        else{
            if(this.state.metadata.find(tag => tag === this.state.metadataTag) === undefined){
                let newMetadata = [...this.state.metadata, this.state.metadataTag];
                this.setState(prevState => ({...prevState, metadataTag: '', metadata: newMetadata, page: 0}), () => {
                    this.searchGames(this.state.designer, newMetadata, this.state.provider);
                });
            } else {
                alert("case2")
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
            let elements = [];
            for(let i = 0; i < this.state.games.length; i += 3){
                let subelements = this.state.games.slice(i, i + 3);
                elements.push(<div styleName="cards">
                    {
                        subelements.map(
                            (game) => {
                                return <Card styleName="card" key= {game.uri} >
                                    <div styleName="columns2">
                                        <CardTitle styleName="cardTitle"
                                                   title= {game.translation[0].name}
                                                   subtitle= {game.provider}
                                        />
                                        <div styleName="tags">
                                            <Chip styleName="designer" key = { `${game.designer}-chip` }>
                                                { game.designer }
                                            </Chip>
                                        </div>
                                    </div>
                                    <CardText styleName="cardText">{game.translation[0].description}</CardText>
                                    {
                                        game.metadata.length !== 0 ?
                                            <div styleName="tags">
                                                {
                                                    game.metadata.map(
                                                        (tag) => {
                                                            if(tag.name === 'tag'){
                                                                return <Chip styleName="chip"
                                                                    key = { `${tag.metadataValue}-chip` }>
                                                                    { tag.metadataValue }
                                                                </Chip>
                                                            }
                                                        })
                                                }
                                            </div>
                                            :
                                            null
                                    }
                                    <CardActions styleName="cardActions">
                                        <Route
                                            key = { `${game.uri}-route` }
                                            render={({ history}) => (
                                                <Button
                                                    className = { styles['fullWidth']}
                                                    label="Go to Editor"
                                                    key = { `${game.uri}-edit` }
                                                    onClick={ () => {
                                                        this.setState(prevState => ({...prevState, loading: true}));
                                                        history.push(`/app/games/${game.uri}/editor`);
                                                    }}
                                                    raised
                                                    accent
                                                />
                                            )}/>
                                        <div>
                                            <Button
                                                label="Edit"
                                                key = { `${game.uri}-edit` }
                                                onClick={ () => {
                                                    this.setState(prevState => ({...prevState, showDialog: true, selectedWorkflow: game.uri}));
                                                }}
                                            />
                                            <Button
                                                label="Delete"
                                                key = { `${game.uri}-delete` }
                                                onClick={() => this.handleDelete(game.uri)}
                                            />
                                        </div>

                                    </CardActions>
                                </Card>
                            }
                        )
                    }
                </div>)
            }

            return <List selectable ripple styleName = 'list'
                         ref = { element => this.__gameList = element}>
                <ListSubHeader caption='Games' />
                {elements}
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
        this.setState(prevState => ({...prevState, metadata: newMetadata, page: 0}), () => {
            this.searchGames(this.state.designer, newMetadata, this.state.provider)
        });
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
                    <Button
                        className = { styles['fullWidth']}
                        label='Add Game'
                        onClick={ () => {
                            this.setState(prevState => ({...prevState, showDialog: true, selectedWorkflow: null}));
                        }}
                        raised
                        accent
                    />
                </div>
                <WorkFlowDialog
                    active={this.state.showDialog}
                    onCancel={this.handleWorkflowDialog}
                    workflowUri={this.state.selectedWorkflow}
                    onSave={this.handleSave}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        games: state.GamesState.games,
        designers: state.GamesState.designers,
        loader: state.GamesState.loader,
        loggedUser: state.AuthState.loggedUser,
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
        edit: bindActionCreators(edit, dispatch),
        save: bindActionCreators(save, dispatch)
    }
}

export default injectIntl(GameList)