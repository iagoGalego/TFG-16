import TYPES from '../Actions/types'

const InitialState = {
    isFetching: false,
    games: null,
    selectedQuestionnaire: null,
    designers: null,
    tags: null,
    loader: true
};

export default function GamesListReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    let loader = true;
    switch (type){
        case TYPES.REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case TYPES.REQUEST_SUCCESS:
            if(payload.games.length === 0 || payload.games.length < payload.pagesize) loader = false;
            return {
                ...state,
                games: payload.games,
                isFetching: false,
                loadeR: loader,
                err: null
            };
        case TYPES.ADD_REQUEST_SUCCESS:
            const newGames = [...state.games];
            payload.games.map(
                (game) => {
                    newGames.push(game);
                }
            );
            if(payload.games.length === 0 || payload.games.length < payload.pagesize) loader = false;
            return {
                ...state,
                games: newGames,
                isFetching: false,
                loader: loader,
                err: null
            };
        case TYPES.REQUEST_TAGS_SUCCESS:
            const tags = payload.tags.map(
                (tag) => {
                    return {
                        "displayName": tag.value.stringValue,
                        "uri": tag.value.stringValue
                    }
                }
            );
            return {
                ...state,
                tags: tags,
                isFetching: false,
                err: null
            };
        case TYPES.REQUEST_DESIGNERS_SUCCESS:
            const designers = payload.designers.map(
                (designer) => {
                    return {
                        "displayName": designer.completeName,
                        "uri": designer.name
                    }
                }
            );
            return {
                ...state,
                designers: designers,
                isFetching: false,
                err: null
            };
        case TYPES.SET_SELECTED_QUESTIONNAIRE:
            return {
                ...state,
                selectedQuestionnaire: payload.questionnaire,
            };
        case TYPES.SELECTED_QUESTIONNAIRE_REQUEST_FAILURE:
            return {
                ...state,
                selectedQuestionnaire: payload.questionnaire,
                isFetching: false,
                err: payload.err
            };
        case TYPES.REQUEST_FAILURE:
            return {
                ...state,
                games: payload.games,
                isFetching: false,
                err: payload.err
            };
        case TYPES.REQUEST_TAGS_FAILURE:
            return {
                ...state,
                tags: payload.tags,
                isFetching: false,
                err: payload.err
            };
        case TYPES.REQUEST_DESIGNERS_FAILURE:
            return {
                ...state,
                designers: payload.designers,
                isFetching: false,
                err: payload.err
            };
        default:
            return state
    }
}