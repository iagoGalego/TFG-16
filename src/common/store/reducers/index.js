import UIReducer from '../../../components/Layout/Reducer'
import AuthReducer from '../../../components/Login/Reducer'
import GameEditorReducer from '../../../components/GameEditor/Reducer'
import QuestionnairesState from '../../../components/QuestionnairesList/Reducer'
import QuestionnairesAuthState from '../../../components/Questionnaires/Reducer'


const reducers = {
    UIState: UIReducer,
    AuthState: AuthReducer,
    GameEditorState: GameEditorReducer,
    QuestionnairesState: QuestionnairesState,
    QuestionnairesAuthState: QuestionnairesAuthState
};

export default reducers;