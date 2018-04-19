/**
 * Created by victorjose.gallego on 6/3/16.
 */

import {
    TaskBuilder, WorkflowBuilder, SequenceFlowBuilder, AutomaticChoiceBuilder,
    ParameterValueBuilder, UserChoiceBuilder, TASK_TYPE, OrJoinBuilder, AndJoinBuilder
} from './builders'

export default class Translator{
    static toOpenetFormat( {
                               workflow : {
                                   executionId,
                                   executionStatus,
                                   isSubWorkflow,
                                   name,
                                   description,
                                   startDate,
                                   expiryDate,
                                   metadata,
                                   modificationDate,
                                   provider,
                                   element,
                                   sequenceFlow,
                                   trigger,
                                   versionNumber,
                                   isDesignFinished,
                                   isValidated,
                                   designer
                               },
                               graph : {
                                   nodes,
                                   links
                               }
                           } ){

        let workflow = new WorkflowBuilder()
            .setName(name)
            .setDescription(description)
            .setIsValidated(isValidated)
            .setIsDesignFinished(isDesignFinished)
            .setProvider(provider)
            .setDesigner(designer)
            .setExecutionId(executionId)
            .setExecutionStatus(executionStatus)
            .setIsSubWorkflow()
            .setStartDate(startDate)
            .setExpiryDate(expiryDate)
            .setMetadata(metadata)
            .setModificationDate(modificationDate)
            .setTrigger(trigger)
            .setVersionNumber(versionNumber);

        let from, to;
        links.filter( link => link.type !== 'verticalStart' && link.type !== 'verticalEnd' )
            .forEach( link => {
                from = link.from;
                to = link.to;
                if(link.type === 'parallelStart'){
                    from = links.find( l => l.to === link.from && link.type !== 'verticalStart' ).from;
                    if(nodes.find(n => n.id === from).type === "loop"){
                        from = nodes.find(n => n.start === from).id
                    }
                } else if (link.type === 'parallelEnd'){
                    to = links.find( l => l.from === link.to && link.type !== 'verticalEnd' ).to;
                    if(nodes.find(n => n.id === to).type === "loopEnd"){
                        to = nodes.find(n => n.id === to).start
                    }
                }
                //TODO revisable
                if(link.reverse){
                    workflow.addFusion(
                        new SequenceFlowBuilder()
                            .to(from, link.fromLevel)
                            .from(to, link.toLevel)
                            .lastVersionNumber(versionNumber)
                            .versionNumber(versionNumber)
                            .isDisabled(link.isTransitable)
                            .build())
                }else{
                    workflow.addFusion(
                        new SequenceFlowBuilder()
                            .from(from, link.fromLevel)
                            .to(to, link.toLevel)
                            .lastVersionNumber(versionNumber)
                            .versionNumber(versionNumber)
                            .isDisabled(link.isTransitable)
                            .build())
                }
            });

        let val = true;
        nodes.filter( cell => cell.type !== 'invisible' )
            .forEach( node => {
                val = true;
                switch (node.type){
                    case "automaticTask":
                        val = false;
                    case "userTask":
                        let task = new TaskBuilder(val, {uri: node.id})
                            .setName(node.name)
                            .setDescription(node.description)
                            .setInitial(node.isInitial)
                            .setFinal(node.isFinal)
                            .isDisabled(node.isDisabled)
                            .setOperator(node.operator)
                            //.setParameters(node.parameters)
                            .setParameters()
                            .setTagReference(node.rolesAllowed)
                            .setRequired(node.isRequired)
                            .setTagReference(node.tagReference)
                            .setMetadata(metadata)
                            .setLastVersionNumber(versionNumber)
                            .setVersionNumber(versionNumber)
                            //.setWorkflow(workflow)
                            .setUser([designer])
                            .setParameters();

                        if(!val) task.setNumberOfPaths();

                        node.startDateIsRelative ? task.setRelativeStartTime(node.startDate) : task.setAbsoluteStartTime(node.startDate);
                        node.expiryDateIsRelative ? task.setRelativeExpiryTime(node.expiryDate) : task.setAbsoluteExpiryTime(node.expiryDate);

                        workflow.addTask(task.build());
                        break;
                    case "loopEnd":
                        let loopStart = nodes.find(({id}) => id === node.start);
                        let loopEndBase = links.find(({from, to}) => from === node.id && to === loopStart.id);
                        let loopEndChoice = new AutomaticChoiceBuilder({uri: node.id})
                            .setPairedTask(loopStart.id)
                            .setNumberOfPaths(loopEndBase.counter)
                            .setPathCondition(null, node.condition);
                        workflow.addTask(loopEndChoice.build());
                        break;
                    case "automaticChoice":
                    case "andSplit":
                        let automaticJoin = nodes.find(({start}) => start === node.id);
                        let automaticBase = links.find(({from, to}) => from === node.id && to === automaticJoin.id);
                        let automaticChoice = new AutomaticChoiceBuilder({uri: node.id})
                            .setPairedTask(automaticJoin.id)
                            .setNumberOfPaths(automaticBase.counter)
                            .setPathCondition(null, node.condition);
                        workflow.addTask(automaticChoice.build());
                        break;
                    case "userChoice":
                        let userJoin = nodes.find(({start}) => start === node.id);
                        let userBase = links.find(({from, to}) => from === node.id && to === userJoin.id);
                        let userChoice = new UserChoiceBuilder({uri: node.id})
                            .setPairedTask(userJoin.id)
                            .setNumberOfPaths(userBase.counter)
                            .setPathCondition(null, node.condition);
                        workflow.addTask(userChoice.build());
                        break;
                    case "loop":
                        let loopEnd = nodes.find(({start}) => start === node.id);
                        let loopBase = links.find(({from, to}) => to === node.id && from === loopEnd.id);
                        let loopChoice = new OrJoinBuilder({uri: node.id})
                            .setPairedTask(loopEnd.id)
                            .setNumberOfPaths(loopBase.counter);
                        workflow.addTask(loopChoice.build());
                        break;
                    case "automaticChoiceEnd":
                    case "userChoiceEnd":
                        let orSplit = nodes.find(({id}) => id === node.start);
                        let orBase = links.find(({from, to}) => to === node.id && from === orSplit.id);
                        let orChoice = new OrJoinBuilder({uri: node.id})
                            .setPairedTask(orSplit.id)
                            .setNumberOfPaths(orBase.counter);
                        workflow.addTask(orChoice.build());
                        break;
                    case "andSplitEnd":
                        let andSplit = nodes.find(({id}) => id === node.start);
                        let andBase = links.find(({from, to}) => to === node.id && from === andSplit.id);
                        let andChoice = new AndJoinBuilder({uri: node.id})
                            .setPairedTask(andSplit.id)
                            .setNumberOfPaths(andBase.counter);
                        workflow.addTask(andChoice.build());
                        break;
                    default:
                        workflow.addTask(new TaskBuilder(true, {uri: node.id}).build())
                    //throw new Error("Task type unknown")
                }

            });

        return workflow.build()
    }
}