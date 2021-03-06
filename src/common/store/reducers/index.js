import UIReducer from '../../../components/Layout/Reducer'
import AuthQuestionnairesReducer from '../../../components/Questionnaires/Reducer'
import AuthReducer from '../../../components/Login/Reducer'
import GameEditorReducer from '../../../components/GameEditor/Reducer'
import QuestionnairesListReducer from '../../../components/QuestionnairesList/Reducer'
import GamesState from '../../../components/GameList/Reducer'
import QuestionnairesAuthState from '../../../components/Questionnaires/Reducer'


const reducers = {
    UIState: UIReducer,
    AuthState: AuthReducer,
    AuthQuestionnairesState: AuthQuestionnairesReducer,
    GameEditorState: GameEditorReducer,
    QuestionnairesState: QuestionnairesListReducer,
    GamesState: GamesState
};

export default reducers;