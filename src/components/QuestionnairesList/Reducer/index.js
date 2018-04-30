import TYPES from '../Actions/types'

const InitialState = {
    isFetching: false,
    questionnaires: null,
    selectedQuestionnaire: null,
    tags: null
};

export default function QuestionnairesListReducer(state = InitialState, {type = '', payload = {}} = {type:'', payload: {}}){
    switch (type){
        case TYPES.REQUEST:
            return {
                ...state,
                isFetching: true
            };
        case TYPES.REQUEST_SUCCESS:
            return {
                ...state,
                questionnaires: payload.questionnaires,
                isFetching: false,
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
        case TYPES.SET_SELECTED_QUESTIONNAIRE:
            return {
                ...state,
                selectedQuestionnaire: payload.questionnaire,
            };
        case TYPES.REQUEST_FAILURE:
            return {
                ...state,
                questionnaires: payload.questionnaires,
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
        default:
            return state
    }
}