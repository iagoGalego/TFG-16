import UIReducer from '../../../components/Layout/Reducer'
import AuthReducer from '../../../components/Login/Reducer'
import GameEditorReducer from '../../../components/GameEditor/Reducer'
import QuestionnairesState from '../../../components/QuestionnairesList/Reducer'


const reducers = {
    UIState: UIReducer,
    AuthState: AuthReducer,
    GameEditorState: GameEditorReducer,
    QuestionnairesState: QuestionnairesState
};

export default reducers;