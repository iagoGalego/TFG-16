import { cloneElement } from 'react'
import omit from 'object.omit'

export function createChild(child, props = {}){
    return child && cloneElement(child, omit(props, ["children", "styles", "location", "history", "params", "route", "routes", "routeParams", "intl"]), ...child);
}