/**
 * Created by victorjose.gallego on 7/21/16.
 */
import { Dialog } from 'react-toolbox/lib/dialog'
import { Dropdown } from 'react-toolbox/lib/dropdown'
import { injectIntl, defineMessages } from 'react-intl'
import CSSModules from 'react-css-modules'
import CONFIG from '../../common/config.json'

import styles from './styles.scss'

const settings = defineMessages({
    title: {
        id: 'app.settings.dialog.title',
        description: 'App configuration dialog title',
        defaultMessage: 'Settings',
    },
    cancel: {
        id: 'app.settings.dialog.actions.cancel',
        description: 'App configuration dialog cancel action',
        defaultMessage: 'Cancel',
    },
    save: {
        id: 'app.settings.dialog.actions.save',
        description: 'App configuration dialog save action',
        defaultMessage: 'Save',
    }
})

const languages = CONFIG.app.languages.available
const langSelectorSource = []
languages.map(({code, name, flag}) => langSelectorSource.push({label: name, value: code, flag: require(`../../common/img/${flag}`)}))


const Settings = ({ active, onSave, onCancel, intl: {formatMessage}, language, setLanguage }) =>
    <Dialog
        active={ active }
        title = { formatMessage(settings.title)}
        onEscKeyDown = { onCancel }
        onOverlayClick = { onCancel }
        actions = {[
                        { label: formatMessage(settings.cancel), onClick: onCancel },
                        { label: formatMessage(settings.save), onClick: onSave, primary: true }
                    ]}
        >

        <Dropdown
            auto
            allowBlank = { false }
            label = 'Select language'
            className = { styles['lang-selector'] }
            source={ langSelectorSource }
            template = { (item) =>  <div className = {styles['item']}> <img src = {item.flag} /><div> {item.label} </div></div> }
            onChange = { lang => setLanguage(lang) }
            value = { language }
        />


    </Dialog>

export default CSSModules(injectIntl(Settings), styles);