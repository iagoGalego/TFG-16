import UIReducer from '../../../components/Layout/Reducer'
import AuthReducer from '../../../components/Login/Reducer'
import GameEditorReducer from '../../../components/GameEditor/Reducer'

//Import reducers here:
//      import XXReducer from '../../../components/XX/Reducer'

const reducers = {
    UIState: UIReducer,
    AuthState: AuthReducer,
    GameEditorState: GameEditorReducer,
    //Include reducers here:
    //      XXState : XXReducer
};

export default reducers;