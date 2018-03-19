/**
 * Created by victorjose.gallego on 6/3/16.
 */

import { TaskBuilder, WorkflowBuilder, AndSplitBuilder, SequenceFlowBuilder, AutomaticChoiceBuilder, ParameterValueBuilder, UserChoiceBuilder, TASK_TYPE} from './builders'

export default class Translator{
    static toOpenetFormat( {
        name,
        description,
        provider,
        designer,
        expiryDate,
        startDate,
        startDateIsRelative,
        expiryDateIsRelative,
        isValidated = true,
        isDesignFinished = true,
        cells = [] } ){

        let workflow = new WorkflowBuilder()
                            .setName(name)
                            .setDescription(description)
                            .setIsValidated(isValidated)
                            .setIsDesignFinished(isDesignFinished)
                            .setProvider(provider)
                            .setDesigner(designer);

        if (startDateIsRelative) workflow.setRelativeStartTime(startDate);
        else workflow.setAbsoluteStartTime(startDate);

        if (expiryDateIsRelative) workflow.setRelativeExpiryTime(expiryDate);
        else workflow.setAbsoluteExpiryTime(expiryDate);

        cells.filter( cell => cell.type === 'link' )
            .forEach( link => workflow.addFusion(
                new SequenceFlowBuilder()
                    .from(link.source.id, Number.parseInt(link.source.port))
                    .to(link.target.id, Number.parseInt(link.target.port))
                    .build()
            ));

        cells.filter( cell => cell.type !== 'link' )
            .forEach( node => {
                switch (node.TASK_TYPE){
                    case TASK_TYPE.TASK:
                        let task = new TaskBuilder()
                            .setName(node.name)
                            .setDescription(node.description)
                            .setInitial(node.isInitial)
                            .setFinal(node.isFinal)
                            .setOperator(node.operator)
                            .setRequired(node.isRequired)
                            .setTagReference(node.tagReference);

                        node.startDateIsRelative ? task.setRelativeStartTime(node.startDate) : task.setAbsoluteStartTime(node.startDate);
                        node.expiryDateIsRelative ? task.setRelativeStartTime(node.expiryDate) : task.setAbsoluteStartTime(node.expiryDate);

                        //TODO set parameter value
                            /*
                             setOperatorIntegerParameter( parameterName, parameterValue )
                             setOperatorFloatParameter( parameterName, parameterValue )
                             setOperatorStringParameter( parameterName, parameterValue )
                             setOperatorBooleanParameter( parameterName, parameterValue )
                             setOperatorDateParameter( parameterName, parameterValue )
                             setOperatorSortParameter( parameterName, parameterValue )
                            */

                        workflow.addTask(task.build());
                        break;
                    case TASK_TYPE.AUTOMATIC_CHOICE:
                        break;
                    case TASK_TYPE.AND_SPLIT:
                        break;
                    case TASK_TYPE.USER_CHOICE:
                        break;
                    default:
                        workflow.addTask(new TaskBuilder().build())
                        //throw new Error("Task type unknown")
                }

            });

        return workflow.build()
    }
    
    static toJointJSFormat( workflow ){
    }
}