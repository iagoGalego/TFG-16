import UIReducer from '../../../components/Layout/Reducer'
import AuthReducer from '../../../components/Login/Reducer'
import GameEditorReducer from '../../../components/GameEditor/Reducer'

const reducers = {
    UIState: UIReducer,
    AuthState: AuthReducer,
    GameEditorState: GameEditorReducer,
};

export default reducers;