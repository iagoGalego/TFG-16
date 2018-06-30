import {
    TaskBuilder, WorkflowBuilder, SequenceFlowBuilder, AutomaticChoiceBuilder,
    ParameterValueBuilder, UserChoiceBuilder, TASK_TYPE, OrJoinBuilder, AndJoinBuilder
} from './builders'
import HMBAPI from "../../../common/lib/API";
import {
    ChoicePathCondition,
    Metadata, OrJoin, ParameterValue, StringType, TaskTranslation, UserChoice, Workflow,
    WorkflowTranslation
} from "./index";
import UUID from "uuid";

export default class Translator{
    static toOpenetFormat(
        {
            workflow : {
                uri,
                executionId,
                executionStatus,
                isSubWorkflow,
                name,
                description,
                startDate,
                expiryDate,
                metadata,
                modificationDate,
                element,
                sequenceFlow,
                trigger,
                versionNumber,
                isDesignFinished,
                isValidated,
                designer,
                translation
            }, graph : {
                nodes,
                links
            }
    } ){

        let workflow = new WorkflowBuilder()
            .setIsValidated(isValidated)
            .setIsDesignFinished(isDesignFinished)
            .setProvider("default")
            .setDesigner(designer)
            .setExecutionId(executionId)
            .setExecutionStatus(executionStatus)
            .setIsSubWorkflow()
            .setStartDate(startDate)
            .setExpiryDate(expiryDate)
            .setMetadata(metadata)
            .setModificationDate(modificationDate)
            .setTrigger(trigger)
            .setVersionNumber(versionNumber)
            .setTranslation([translation]);

        if(uri !== '') workflow.setUri(uri);
        let from, to, fromLevel, toLevel;

        links.filter( link => link.type !== 'verticalStart' && link.type !== 'verticalEnd' )
            .filter( link => !(link.isBase === true && link.isTransitable !== true) )
            .forEach( link => {
                from = link.from;
                to = link.to;
                fromLevel = link.fromLevel;
                toLevel = link.toLevel;

                if(link.type === 'parallelStart'){
                    from = links.find( l => l.to === link.from && link.type !== 'verticalStart' ).from;
                    if(nodes.find(n => n.id === from).type === "loop"){
                        from = nodes.find(n => n.start === from).id
                        fromLevel = 1;
                    }
                } else if (link.type === 'parallelEnd'){
                    to = links.find( l => l.from === link.to && link.type !== 'verticalEnd' ).to;
                    if(nodes.find(n => n.id === to).type === "loopEnd"){
                        to = nodes.find(n => n.id === to).start
                        toLevel = 1;
                    }
                }
                //TODO revisable
                if(link.reverse){
                    workflow.addFusion(
                        new SequenceFlowBuilder()
                            .to(from, 1 - link.toLevel)
                            .from(to, 1 - link.fromLevel)
                            .lastVersionNumber(versionNumber)
                            .versionNumber(versionNumber)
                            .isDisabled(link.isDisabled)
                            .build())
                }else{
                    workflow.addFusion(
                        new SequenceFlowBuilder()
                            .from(from, fromLevel)
                            .to(to, toLevel)
                            .lastVersionNumber(versionNumber)
                            .versionNumber(versionNumber)
                            .isDisabled(link.isDisabled)
                            .build())
                }
            });

        let val, metadataArray, x, y, translationTask;
        nodes.filter( cell => cell.type !== 'invisible' )
            .forEach( node => {
                translationTask = new TaskTranslation();
                translationTask.description = node.description;
                translationTask.name = node.name;
                translationTask.languageCode = translation.languageCode;
                translationTask.imageUrl = null;
                metadataArray = [];
                x = new Metadata();
                y = new Metadata();
                x.name = "x";
                x.metadataValue = node.x;
                y.name = "y";
                y.metadataValue = node.y;
                metadataArray.push(x);
                metadataArray.push(y);
                val = "HumanTask";
                switch (node.type){
                    case "automaticTask":
                        val = "AutomaticTask";
                    case "userTask":
                        let task = new TaskBuilder(val, {uri: node.id})
                            .setInitial(node.isInitial)
                            .setFinal(node.isFinal)
                            .isDisabled(node.isDisabled)
                            .setRequired(node.isRequired)
                            .setTagReference(node.rolesAllowed)
                            .setOperator(node.operator)
                            .setTranslation([translationTask])
                            .setMetadata(metadataArray)
                            .setLastVersionNumber(versionNumber)
                            .setVersionNumber(versionNumber)
                            .setUser([designer]);

                        if(node.operator){
                            if(node.operator.uri === "http://citius.usc.es/hmb/questionnaires/operators/do_quest" &&
                                node.parameters["Questionnaire"]){
                                let parameterValues = [];
                                let parameterValue = new ParameterValue();
                                parameterValues.push(parameterValue);
                                parameterValue.namedParameter = node.parameters["Questionnaire"].parameter;
                                parameterValue.namedParameterValue = new StringType();
                                parameterValue.namedParameterValue.stringValue = node.parameters["Questionnaire"].value;
                                task.setParameters(parameterValues)
                            } else if(node.operator.uri === "http://citius.usc.es/hmb/questionnaires/operators/manage_task" &&
                                node.parameters["Task ID"]){
                                let parameterValues = [];
                                let parameterValue = new ParameterValue();
                                parameterValues.push(parameterValue);
                                parameterValue.namedParameter = node.parameters["Task ID"].parameter;
                                parameterValue.namedParameterValue = new StringType();
                                parameterValue.namedParameterValue.stringValue = node.parameters["Task ID"].value;
                                task.setParameters(parameterValues)
                            }
                        }

                        task.setNumberOfPaths();

                        if(node.initialDate){
                            node.startDateIsRelative?
                                task.setRelativeStartTime(node.initialDate.getTime())
                                :
                                task.setAbsoluteStartTime(node.initialDate.getTime());
                        }
                        if(node.endingDate){
                            node.expiryDateIsRelative?
                                task.setRelativeExpiryTime(node.endingDate.getTime())
                                :
                                task.setAbsoluteExpiryTime(node.endingDate.getTime());
                        }

                        workflow.addTask(task.build());
                        break;
                    case "loopEnd":
                        let loopStart = nodes.find(({id}) => id === node.start);
                        let loopEndBase = links.find(({from, to}) => from === node.id && to === loopStart.id);

                        let loopEndChoice = {
                            numberOfPaths: loopEndBase.counter,
                            expiryDate: null,
                            startDate: null,
                            lastVersionNumber: 0,
                            metadata: metadataArray,
                            operator: null,
                            pairedTask: loopStart.id,
                            parameterValue: [],
                            pathId: '',
                            tagReference: [],
                            versionNumber: 0,
                            isDisabled: false,
                            isFinal: false,
                            isInitial: false,
                            isRequired: false,
                            user: [],
                            uri: node.id,
                            translation: [translationTask]
                        };
                        loopEndChoice.pathCondition= loopStart.conditions.map(
                            (condition, index) =>{
                                let c = new ChoicePathCondition();
                                c.genURI();
                                c.pathIndex = index;
                                c.condition = condition.condition;
                                if(condition.comparator !== null && condition.conditionValue !== null)
                                    c.condition += condition.comparator+condition.conditionValue
                                return c
                            }
                        );
                        loopEndChoice["@class"] = "es.usc.citius.hmb.model.AutomaticChoice";
                        workflow.addTask(loopEndChoice);
                        break;
                    case "automaticChoice":
                    case "andSplit":
                        let automaticJoin = nodes.find(({start}) => start === node.id);
                        let automaticBase = links.find(({from, to}) => from === node.id && to === automaticJoin.id);
                        let automaticChoice = {
                            numberOfPaths: automaticBase.counter,
                            expiryDate: null,
                            startDate: null,
                            lastVersionNumber: 0,
                            metadata: metadataArray,
                            translation: [translationTask],
                            operator: null,
                            pairedTask: automaticJoin.id,
                            parameterValue: [],
                            pathId: '',
                            tagReference: [],
                            versionNumber: 0,
                            isDisabled: node.isDisabled,
                            isFinal: false,
                            isInitial: false,
                            isRequired: node.isRequired,
                            user: [],
                            uri: node.id,
                        };
                        if(node.type === 'automaticChoice'){
                            automaticChoice.pathCondition= node.conditions.map(
                                (condition, index) =>{
                                    let c = new ChoicePathCondition();
                                    c.genURI();
                                    c.pathIndex = index;
                                    c.condition = condition.condition
                                    if(condition.comparator !== null && condition.conditionValue !== null)
                                        c.condition += condition.comparator+condition.conditionValue
                                    return c
                                }
                            );
                            automaticChoice["@class"] = "es.usc.citius.hmb.model.AutomaticChoice";
                        } else {
                            automaticChoice["@class"] = "es.usc.citius.hmb.model.Split";
                        }
                        //let automaticChoice = new AutomaticChoiceBuilder({uri: node.id})
                        //    .setPairedTask(automaticJoin.id)
                        //    .setNumberOfPaths(automaticBase.counter)
                        //    .setPathCondition(null, node.condition);
                        workflow.addTask(automaticChoice);
                        break;
                    case "userChoice":
                        let userJoin = nodes.find(({start}) => start === node.id);
                        let userBase = links.find(({from, to}) => from === node.id && to === userJoin.id);
                        let userChoice = {
                            numberOfPaths: userBase.counter,
                            expiryDate: null,
                            startDate: null,
                            lastVersionNumber: 0,
                            metadata: metadataArray,
                            translation: [translationTask],
                            operator: null,
                            pairedTask: userJoin.id,
                            parameterValue: [],
                            pathId: '',
                            tagReference: [],
                            versionNumber: 0,
                            isDisabled: node.isDisabled,
                            isFinal: false,
                            isInitial: false,
                            isRequired: node.isRequired,
                            user: [],
                            uri: node.id,
                        };
                        userChoice["@class"] = "es.usc.citius.hmb.model.UserChoice";
                        //let userChoice = new UserChoiceBuilder({uri: node.id})
                            //.setPairedTask(userJoin.id)
                            //.setNumberOfPaths(userBase.counter)
                            //.setPathCondition(null, node.condition);
                        workflow.addTask(userChoice);
                        break;
                    case "loop":
                        let loopEnd = nodes.find(({start}) => start === node.id);
                        let loopBase = links.find(({from, to}) => to === node.id && from === loopEnd.id);
                        let loopChoice = {
                            numberOfPaths: loopBase.counter,
                            expiryDate: null,
                            startDate: null,
                            lastVersionNumber: 0,
                            metadata: metadataArray,
                            translation: [translationTask],
                            operator: null,
                            pairedTask: loopEnd.id,
                            parameterValue: [],
                            pathId: '',
                            tagReference: [],
                            versionNumber: 0,
                            isDisabled: false,
                            isFinal: false,
                            isInitial: false,
                            isRequired: false,
                            user: [],
                            uri: node.id,
                        };
                        loopChoice["@class"] = "es.usc.citius.hmb.model.OrJoin";
                        workflow.addTask(loopChoice);
                        break;
                    case "automaticChoiceEnd":
                    case "userChoiceEnd":
                        let orSplit = nodes.find(({id}) => id === node.start);
                        let orBase = links.find(({from, to}) => to === node.id && from === orSplit.id);
                        let orChoice = {
                            numberOfPaths: orBase.counter,
                            expiryDate: null,
                            startDate: null,
                            lastVersionNumber: 0,
                            metadata: metadataArray,
                            translation: [translationTask],
                            operator: null,
                            pairedTask: orSplit.id,
                            parameterValue: [],
                            pathId: '',
                            tagReference: [],
                            versionNumber: 0,
                            isDisabled: node.isDisabled,
                            isFinal: false,
                            isInitial: false,
                            isRequired: node.isRequired,
                            user: [],
                            uri: node.id,
                        };
                        orChoice["@class"] = "es.usc.citius.hmb.model.OrJoin";
                        //new OrJoin();
                        //let orChoice = new OrJoinBuilder({uri: node.id})
                            //.setPairedTask(orSplit.id)
                            //.setNumberOfPaths(orBase.counter);
                        workflow.addTask(orChoice);
                        break;
                    case "andSplitEnd":
                        let andSplit = nodes.find(({id}) => id === node.start);
                        let andBase = links.find(({from, to}) => to === node.id && from === andSplit.id);
                        let andChoice = {
                            localAggregationRules: [],
                            numberOfPaths: andBase.counter,
                            expiryDate: null,
                            startDate: null,
                            lastVersionNumber: 0,
                            metadata: metadataArray,
                            translation: [translationTask],
                            operator: null,
                            pairedTask: andSplit.id,
                            parameterValue: [],
                            pathId: '',
                            tagReference: [],
                            versionNumber: 0,
                            isDisabled: node.isDisabled,
                            isFinal: false,
                            isInitial: false,
                            isRequired: node.isRequired,
                            user: [],
                            uri: node.id,
                        };
                        andChoice["@class"] = "es.usc.citius.hmb.model.AndJoin";
                        //let andChoice = new AndJoinBuilder({uri: node.id})
                        //    .setPairedTask(andSplit.id)
                        //    .setNumberOfPaths(andBase.counter);
                        workflow.addTask(andChoice);
                        break;
                    default:
                        let defaultTask = new TaskBuilder("Task", {uri: node.id})
                            .isDisabled(node.isDisabled)
                            .setRequired(node.isRequired)
                            .setMetadata(metadataArray);
                        if(node.isInitial) defaultTask.setInitial();
                        else if(node.isFinal) defaultTask.setFinal();
                        workflow.addTask(defaultTask.build())
                    //throw new Error("Task type unknown")
                }

            });

        return workflow.build()
    }

    static toEditorFormat( { workflow: { elements, sequenceFlow } } ){
        let from, to, links = [], ele = [];
        sequenceFlow.forEach( link => {
            from = elements.find(({uri}) => uri === link.sourceTask);
            to = elements.find(({uri}) => uri === link.targetTask);
            //TODO revisable

            let l = {
                from: from.uri,
                fromLevel: link.sourceIndex,
                to: to.uri,
                toLevel: link.targetIndex,
            };
            if(from.pairedTask === to.uri && from.uri === to.pairedTask) {
                if(from["@class"] === "es.usc.citius.hmb.model.OrJoin" && to["@class"] === "es.usc.citius.hmb.model.AutomaticChoice"){
                    to.type = "loopEnd";
                    from.type = "loop";
                    l.reverse = true;
                    l.from = to.uri;
                    l.to = from.uri;
                    l.fromLevel = 1;
                    l.toLevel = 1;
                    l.type = 'return';
                    l.counter = 2;
                    links.push(l)
                } else{
                    l.isBase = true;
                    l.isTransitable = true;
                    if(from.numberOfPaths) l.counter = from.numberOfPaths;
                    links.push(l)
                    if(from["@class"] === "es.usc.citius.hmb.model.Split" || from["@class"] === "es.usc.citius.hmb.model.AutomaticChoice" ||
                        from["@class"] === "es.usc.citius.hmb.model.UserChoice"){
                        from.isTransitable = true;
                    }
                }
            } else if(Number(from.metadata.find(m => m.name === "y").metadataValue) > Number(to.metadata.find(m => m.name === "y").metadataValue)
            ){
                let id = UUID.v4();
                ele.push({
                    id: id, type: 'invisible', fromLevel: link.sourceIndex, x: Number(from.metadata.find(m => m.name === "x").metadataValue), y: Number(to.metadata.find(m => m.name === "y").metadataValue)
                });
                links.push({
                    from: from.uri, to: id, type: "verticalStart", fromLevel: link.sourceIndex, toLevel: link.targetIndex
                });
                links.push({
                    from: id, to: to.uri, type: "parallelStart", fromLevel: link.sourceIndex, toLevel: link.targetIndex
                });
            } else if(Number(from.metadata.find(m => m.name === "y").metadataValue) < Number(to.metadata.find(m => m.name === "y").metadataValue)
            ){
                let id2 = UUID.v4();
                ele.push({
                    id: id2, type: 'invisible', x: Number(to.metadata.find(m => m.name === "x").metadataValue), y: Number(from.metadata.find(m => m.name === "y").metadataValue)
                });
                links.push({
                    from: link.sourceTask, to: id2, type: "parallelEnd", fromLevel: link.sourceIndex, toLevel: link.targetIndex
                });
                links.push({
                    from: id2, to: link.targetTask, type: "verticalEnd", fromLevel: link.sourceIndex, toLevel: link.targetIndex
                });
            } else {
                links.push(l)
            }
        });

        let val = "userTask", type = '';
        elements.forEach( node => {

            if(node.pairedTask !== null &&
                (node["@class"] === "es.usc.citius.hmb.model.AutomaticChoice" || node["@class"] === "es.usc.citius.hmb.model.UserChoice" || node["@class"] === "es.usc.citius.hmb.model.Split") &&
                node.type !== "loopEnd"){
                let pairedLink = sequenceFlow.find(({sourceTask, targetTask}) => sourceTask === node.uri && targetTask === node.pairedTask);
                if (pairedLink === undefined){
                    links.push({
                        from: node.uri,
                        fromLevel: 0,
                        to: node.pairedTask,
                        toLevel: 0,
                        isBase: true,
                        counter: node.numberOfPaths
                    })
                } else {
                    node.fromLevel = pairedLink.sourceIndex
                }
            }


            type = '';
            val = "userTask";
            switch (node["@class"]){
                case "es.usc.citius.hmb.model.AutomaticTask":
                    val = "automaticTask";
                case "es.usc.citius.hmb.model.HumanTask":
                    let task = {
                        type: val,
                        id: node.uri,
                        name: node.translation[0].name,
                        description: node.translation[0].description,
                        isInitial: node.isInitial,
                        isFinal: node.isFinal,
                        parameters: {},
                        isDisabled: node.isDisabled,
                        rolesAllowed: node.tagReference,
                        isRequired: node.isRequired,
                        x: Number(node.metadata.find(m => m.name === "x").metadataValue),
                        y: Number(node.metadata.find(m => m.name === "y").metadataValue)
                    };

                    //if(val === "AutomaticTask") task.setNumberOfPaths();

                    if(node.startDate) task.initialDate = new Date(node.startDate.time);
                    if(node.expiryDate) task.endingDate = new Date(node.expiryDate.time);
                    if(node.operator) task.operator = node.operator.uri;
                    else task.operator = '';
                    if(node.parameterValue) {
                        node.parameterValue.map(
                            (parameterValue) => {
                                task.parameters[parameterValue.namedParameter.name] = {
                                    value: parameterValue.namedParameterValue.stringValue,
                                    parameter: parameterValue.namedParameter
                                }
                            }
                        );
                    }

                    ele.push(task);
                    break;
                case "es.usc.citius.hmb.model.Split":
                    let split = {
                        id: node.uri,
                        type: "andSplit",
                        name: node.name,
                        description: node.description,
                        operator: node.operator,
                        parameters: node.parameterValue,
                        rolesAllowed: [],
                        initialDate: node.startDate,
                        endingDate: node.expiryDate,
                        isRequired: node.isRequired,
                        isDisabled: node.isDisabled,
                        isInitial: node.isInitial,
                        isFinal: node.isFinal,
                        x: Number(node.metadata.find(m => m.name === "x").metadataValue),
                        y: Number(node.metadata.find(m => m.name === "y").metadataValue)
                    };
                    if(node.isTransitable) split.isTransitable = true;
                    ele.push(split);
                    break;
                case "es.usc.citius.hmb.model.AutomaticChoice":
                    let automaticChoice = {
                        id: node.uri,
                        type: "automaticChoice",
                        name: node.name,
                        description: node.description,
                        operator: node.operator,
                        parameters: node.parameterValue,
                        rolesAllowed: [], //incompleto esto
                        initialDate: node.startDate,
                        endingDate: node.expiryDate,
                        isRequired: node.isRequired,
                        isDisabled: node.isDisabled,
                        isInitial: node.isInitial,
                        isFinal: node.isFinal,
                        x: Number(node.metadata.find(m => m.name === "x").metadataValue),
                        y: Number(node.metadata.find(m => m.name === "y").metadataValue)
                    };

                    automaticChoice.conditions = node.pathCondition.map((condition) => {});

                    node.pathCondition.map(
                        (condition) =>{
                            let c = condition.condition.split(" ");
                            let res = {condition: c[0], comparator: null, conditionValue: null};
                            if(c.length === 3){
                                res.comparator = " "+c[1]+" ";
                                res.conditionValue = c[2]
                            }
                            automaticChoice.conditions[condition.pathIndex] =  res;
                        }
                    );

                    if(node.type === "loopEnd") {
                        automaticChoice.type = "loopEnd";
                        automaticChoice.start = node.pairedTask;
                    }
                    if(node.isTransitable) automaticChoice.isTransitable = true;
                    if(node.hasOwnProperty("fromLevel")) automaticChoice.fromLevel = node.fromLevel;
                    ele.push(automaticChoice);
                    break;
                case "es.usc.citius.hmb.model.UserChoice":
                    let userChoice = {
                        id: node.uri,
                        type: "userChoice",
                        name: node.name,
                        description: node.description,
                        operator: node.operator,
                        parameters: node.parameterValue,
                        rolesAllowed: [], //incompleto esto
                        initialDate: node.startDate,
                        endingDate: node.expiryDate,
                        isRequired: node.isRequired,
                        isDisabled: node.isDisabled,
                        isInitial: node.isInitial,
                        isFinal: node.isFinal,
                        x: Number(node.metadata.find(m => m.name === "x").metadataValue),
                        y: Number(node.metadata.find(m => m.name === "y").metadataValue)
                    };
                    if(node.isTransitable) userChoice.isTransitable = true;
                    if(node.hasOwnProperty("fromLevel")) userChoice.fromLevel = node.fromLevel;

                    ele.push(userChoice);
                    break;
                case "es.usc.citius.hmb.model.OrJoin":
                    let orSplit = elements.find(({uri}) => uri === node.pairedTask);
                    if(orSplit["@class"] === "es.usc.citius.hmb.model.AutomaticChoice"){
                        type = "automaticChoiceEnd";
                    } else if(orSplit["@class"] === "es.usc.citius.hmb.model.UserChoice"){
                        type = "userChoiceEnd";
                    }
                    let orChoice = {
                        id: node.uri,
                        type: type,
                        start: orSplit.uri,
                        name: node.name,
                        description: node.description,
                        operator: node.operator,
                        parameters: node.parameterValue,
                        rolesAllowed: [], //incompleto esto
                        initialDate: node.startDate,
                        badges: [],
                        endingDate: node.expiryDate,
                        giveBadges: false,
                        givePoints: false,
                        points: 0,
                        x: Number(node.metadata.find(m => m.name === "x").metadataValue),
                        y: Number(node.metadata.find(m => m.name === "y").metadataValue)
                    };

                    if(node.type === "loop"){
                        let cond = elements.find(e => e.uri === node.pairedTask).pathCondition;

                        orChoice.conditions = cond.map((condition) => {});

                        cond.map(
                            (condition) =>{
                                let c = condition.condition.split(" ");
                                let res = {condition: c[0], comparator: null, conditionValue: null};
                                if(c.length === 3){
                                    res.comparator = " "+c[1]+" ";
                                    res.conditionValue = c[2]
                                }
                                orChoice.conditions[condition.pathIndex] =  res;
                            }
                        );


                        orChoice.isRequired= node.isRequired;
                        orChoice.isDisabled= node.isDisabled;
                        orChoice.isInitial= node.isInitial;
                        orChoice.isFinal= node.isFinal;
                        orChoice.type = "loop";
                        delete orChoice.start;
                    }
                    ele.push(orChoice);
                    break;
                case "es.usc.citius.hmb.model.AndJoin":
                    let andSplit = elements.find(({uri}) => uri === node.pairedTask);
                    let andChoice = {
                        id: node.uri,
                        type: "andSplitEnd",
                        start: andSplit.uri,
                        name: node.name,
                        description: node.description,
                        operator: node.operator,
                        parameters: node.parameterValue,
                        rolesAllowed: [], //incompleto esto
                        initialDate: node.startDate,
                        badges: [],
                        endingDate: node.expiryDate,
                        giveBadges: false,
                        givePoints: false,
                        points: 0,
                        x: Number(node.metadata.find(m => m.name === "x").metadataValue),
                        y: Number(node.metadata.find(m => m.name === "y").metadataValue)
                    };
                    ele.push(andChoice);
                    break;
                default:
                    let defaultTask = {
                        id: node.uri,
                        x: Number(node.metadata.find(m => m.name === "x").metadataValue),
                        y: Number(node.metadata.find(m => m.name === "y").metadataValue),
                        isDisabled: false,
                        isRequired: node.isRequired,
                    };
                    if(node.isInitial) {
                        defaultTask.isInitial = true;
                        defaultTask.type = "start";
                    }
                    else if(node.isFinal)  {
                        defaultTask.isFinal = true;
                        defaultTask.type = "end";
                    }
                    ele.push(defaultTask);
                //throw new Error("Task type unknown")
            }

        });

        ele.forEach(
            node => {
                if(node.type === "userChoice" || node.type === "automaticChoice" ||node.type === "andSplit"){
                    let endNode = ele.find(e => e.start === node.id);
                    let invisiblesFrom = links.filter(({from, type}) => (from === node.id && type === 'verticalStart'));
                    let invisiblesTo = links.filter(({to, type}) => (to === endNode.id && type === 'verticalEnd'));
                    invisiblesFrom.forEach(
                        invisible => {
                            let invisibleEnd = ele.find(({id}) => id === invisiblesTo.find(e1 => e1.toLevel === invisible.fromLevel).from)
                            invisibleEnd.start = invisible.to;
                        }
                    )
                }else if (node.type === "loopEnd"){
                    let save_x
                    let verticalEnd = links.find(l => l.from === node.id && l.type === "verticalStart");
                    if(verticalEnd){
                        let invisibleEnd = ele.find(e => e.id === verticalEnd.to)
                        save_x = invisibleEnd.x
                        let parallelEnd = links.find(l => l.from === invisibleEnd.id && l.type === "parallelStart");
                        let loopStart = ele.find(e => e.id === node.start);
                        let verticalStart = links.find(l => l.to === loopStart.id && l.type === "verticalEnd");
                        let invisibleStart = ele.find(e => e.id === verticalStart.from)
                        invisibleEnd.fromLevel = 0;
                        invisibleEnd.x = invisibleStart.x
                        invisibleStart.x = save_x
                        let parallelStart = links.find(l => l.to === invisibleStart.id && l.type === "parallelEnd");
                        invisibleStart.start =invisibleEnd.id;
                        verticalEnd.fromLevel = 0;
                        verticalEnd.toLevel = 0;
                        parallelEnd.fromLevel = 0;
                        parallelEnd.toLevel = 0;
                        verticalStart.fromLevel = 0;
                        verticalStart.toLevel = 0;
                        parallelStart.fromLevel = 0;
                        parallelStart.toLevel = 0;
                        verticalStart.to = node.id;
                        verticalEnd.from = loopStart.id;
                    } else {
                        let isLoop = links.find(l => l.to === node.start && l.from === node.id && type !== "return");
                        delete isLoop.isBase;
                        delete isLoop.isTransitable;
                        isLoop.isLoop = true;
                        isLoop.reverse = true;
                        let to = isLoop.to;
                        isLoop.to = isLoop.from;
                        isLoop.from = to;
                        isLoop.fromLevel = 0;
                        isLoop.toLevel = 0;
                        ele.find(({id}) => id === node.start).fromLevel = 0
                    }
                }
            }
        );

        return {nodes: ele, links: links}
    }
}

