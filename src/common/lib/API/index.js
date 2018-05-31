/**
 * Created by victorjose.gallego on 4/11/16.
 */

import URLSearchParams from 'url-search-params'
import CONFIG from '../../config.json'

let __instance = null;
let __token = null;

export class APIClient {
    constructor(){
        if(!__instance){
            this.DB = new DB();
            this.Exec = new Exec();
            __instance = this
        }

        return __instance
    }

    static get instance(){
        return new APIClient()
    }

    static init(token){
        if(token && !__token)
            __token = token
    }

    login({user, pass}){
        if(user === undefined || pass === undefined){
            let err =  new Error('The user and password are mandatory');
            
            return Promise.reject(err)
        }

        let query = new URLSearchParams();
        query.append('username', user);
        query.append('password', pass);

        return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.authAPI}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            mode: 'cors',
            body: query.toString()
        }).then( response => {
            return response.ok
                ? response.json()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        }).then( json => json.content
        ).then( token => {
            __token = token;
            return token
        })
    }
    logout(){
        if(!__token){
            let err = new Error('You must log in first!');
            
            return Promise.reject(err)
        }

        let query = new URLSearchParams();
        query.append('token', __token);

        return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.authAPI}/logout?${query.toString()}`).then( response => {
            return response.ok
                ? response.json()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        }).then( json => {
            __token = null;
            return json
        })
    }
    loadUserConfiguration(user){
        if(user === undefined){
            let err =  new Error('The user is mandatory');

            return Promise.reject(err)
        }

        //TODO fetch config
        return {
            lang: 'en'
        }
    }

    checkConnection(){
        if(!__token){
            let err = new Error('You must log in first!');
            
            return Promise.reject(err)
        }

        let query = new URLSearchParams();
        query.append('token', __token);

        return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.authAPI}/check?${query.toString()}`).then( response => {
            return response.ok
                ? response.json()
                : Promise.reject(new Error(`${response.status} ${response.statusText}`))
        })
    }
}

class DB{
    admin = {
        actionGroups: {
            getAll(){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/actiongroups`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        actions: {
            getAll(){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/actions`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        globalProperties: {
            getAll( provider ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                provider = Array.isArray(provider) ? provider : [provider];

                let query = new URLSearchParams();

                provider.forEach(x => query.append('provider', x));

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/globalproperties?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            value: {
                get( property ){
                    if(!__token){
                        let err = new Error('You must log in first!');
                        
                        return Promise.reject(err)
                    }

                    return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/globalproperty/${property}`, {
                        headers: {
                            'X-Auth-Token' : __token,
                            'Accept': 'application/json;charset=utf-8'
                        }
                    }).then( response => {
                        return response.ok
                            ? response.json()
                            : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                    })
                },
                set( property, value ){
                    if(!__token){
                        let err = new Error('You must log in first!');
                        
                        return Promise.reject(err)
                    }

                    let val = new URLSearchParams();
                    val.append('value', value);

                    return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/globalproperty/${property}`, {
                        method: 'POST',
                        headers: {
                            'X-Auth-Token' : __token,
                            'Accept': 'application/json;charset=utf-8',
                            'Content-Type' : 'application/json;charset=utf-8',
                        },
                        body: val.toString()
                    }).then( response => {
                        return response.ok
                            ? response.json()
                            : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                    })
                }
            }
        },
        globalResourceProperties: {
            getAll( provider ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                provider = Array.isArray(provider) ? provider : [provider];

                let query = new URLSearchParams();

                provider.forEach(x => query.append('provider', x));

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/globalresourceproperties?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            getAllWithourProvider( ){
                if(!__token){
                    let err = new Error('You must log in first!');

                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/globalresourceproperties`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        localCaseProperties: {
            getAll( provider ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                provider = Array.isArray(provider) ? provider : [provider];

                let query = new URLSearchParams();

                provider.forEach(x => query.append('provider', x));

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/localcaseproperties?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        localProperties: {
            getAll( provider ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                provider = Array.isArray(provider) ? provider : [provider];

                let query = new URLSearchParams();

                provider.forEach(x => query.append('provider', x));

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/localproperties?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        operators: {
            getAllByProvider( provider ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                provider = Array.isArray(provider) ? provider : [provider];

                let query = new URLSearchParams();

                provider.forEach(x => query.append('provider', x));

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/operators?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            getAll(){
                if(!__token){
                    let err = new Error('You must log in first!');

                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/operators`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        resources: {
            getAll( operatorId ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                let query = new URLSearchParams();

                query.append('operatorId', operatorId);

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/resources?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        tags: {
            getAllByProvider( provider ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                provider = Array.isArray(provider) ? provider : [provider];

                let query = new URLSearchParams();

                provider.forEach(x => query.append('provider', x));

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/tags?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            getAll( ){
                if(!__token){
                    let err = new Error('You must log in first!');

                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/tags`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        users: {
            getAll(  ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/users`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        workflows: {
            create( workflow ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                let data = new FormData();
                data.append('object', workflow);

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/workflow`, {
                    method: 'POST',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8',
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(workflow)
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            get( workflowId ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/workflow/${workflowId}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            delete( workflowId ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/workflow/${workflowId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            getPaginatedWithoutQuery( { page = 0, pagesize = Number.MAX_SAFE_INTEGER } ){
                if(!__token){
                    let err = new Error('You must log in first!');

                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/workflows/page/${page}/size/${pagesize}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            getPaginated( { designer, metadata, provider, page = 0, pagesize = Number.MAX_SAFE_INTEGER } ){
                if(!__token){
                    let err = new Error('You must log in first!');

                    return Promise.reject(err)
                }

                let query = new URLSearchParams();

                if(designer !== '') query.append('designer', designer);
                if(metadata.length !== 0) {
                    metadata.map(
                        (m) => {
                            query.append('metadata', m)
                        }
                    )
                }
                if(provider !== '') query.append('provider', provider);

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/workflows/page/${page}/size/${pagesize}?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            updateAll( provider ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                provider = Array.isArray(provider) ? provider : [provider];

                let query = new URLSearchParams();

                provider.forEach(x => query.append('provider', x));

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/operation/updateWorkflows?${query.toString()}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            update( workflowId ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/operation/updateWorkflow/${workflowId}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            validate( workflowId ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.adminAPI}/validateWorkflow/${workflowId}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        }
    };
    users = {
        user: {
            create( user ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user`, {
                    method: 'POST',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    },
                    body: user
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            get( userId ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user/${userId}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            modify( user ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user/${user.systemontology_Name}`, {
                    method: 'PUT',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    },
                    body: user
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            delete( userId ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
        },
        getPaginated( { roles, search, page = 0, pagesize = Number.MAX_SAFE_INTEGER } ){
            let query = new URLSearchParams();
            query.append('roles', roles);
            query.append('search', search);
            query.append('page', page);
            query.append('pagesize', pagesize);

            if(!__token){
                let err = new Error('You must log in first!');
                
                return Promise.reject(err)
            }

            return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/users?${query.toString()}`, {
                headers: {
                    'X-Auth-Token' : __token,
                    'Accept': 'application/json;charset=utf-8'
                }
            }).then( response => {
                return response.ok
                    ? response.json()
                    : Promise.reject(new Error(`${response.status} ${response.statusText}`))
            })
        },
        properties : {
            value: {
                get( { userId, property } ){
                    if(!__token){
                        let err = new Error('You must log in first!');
                        
                        return Promise.reject(err)
                    }

                    return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user/${userId}/property/${property}`, {
                        headers: {
                            'X-Auth-Token' : __token,
                            'Accept': 'application/json;charset=utf-8'
                        }
                    }).then( response => {
                        return response.ok
                            ? response.json()
                            : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                    })
                },
                set( { userId, property, value } ){
                    if(!__token){
                        let err = new Error('You must log in first!');
                        
                        return Promise.reject(err)
                    }

                    return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user/${userId}/property/${property}`, {
                        method: 'PUT',
                        headers: {
                            'X-Auth-Token' : __token,
                            'Accept': 'application/json;charset=utf-8'
                        },
                        body: value
                    }).then( response => {
                        return response.ok
                            ? response.json()
                            : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                    })
                },
                add( { userId, property, value } ){
                    if(!__token){
                        let err = new Error('You must log in first!');
                        
                        return Promise.reject(err)
                    }

                    return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user/${userId}/property/${property}`, {
                        method: 'PATCH',
                        headers: {
                            'X-Auth-Token' : __token,
                            'Accept': 'application/json;charset=utf-8'
                        },
                        body: value
                    }).then( response => {
                        return response.ok
                            ? response.json()
                            : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                    })
                },
                delete( { userId, property } ){
                    if(!__token){
                        let err = new Error('You must log in first!');
                        
                        return Promise.reject(err)
                    }

                    return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user/${userId}/property/${property}`, {
                        method: 'DELETE',
                        headers: {
                            'X-Auth-Token' : __token,
                            'Accept': 'application/json;charset=utf-8'
                        }
                    }).then( response => {
                        return response.ok
                            ? response.json()
                            : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                    })
                }},
            getAllValues( userId ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/users/${CONFIG.api.versions.db.userAPI}/user/${userId}/properties`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        }
    };
    client = {
        tasks : {
            paginated( { page = 0, pagesize = Number.MAX_SAFE_INTEGER } ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/client/${CONFIG.api.versions.db.clientAPI}/tasks/page/${page}/size/${pagesize}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            byExecutionAndCase( { executionId, caseId } ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/client/${CONFIG.api.versions.db.clientAPI}/execution/${executionId}/case/${caseId}/tasks`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        workflows: {
            paginated( { page = 0, pagesize = Number.MAX_SAFE_INTEGER } ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/client/${CONFIG.api.versions.db.clientAPI}/workflows/page/${page}/size/${pagesize}`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
        },
        profile(full = false ){
            if(!__token){
                let err = new Error('You must log in first!');
                
                return Promise.reject(err)
            }

            return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/client/${CONFIG.api.versions.db.clientAPI}/profile${full ? '.full' : ''}`, {
                headers: {
                    'X-Auth-Token' : __token,
                    'Accept': 'application/json;charset=utf-8',
                }
            }).then( response => {
                return response.ok
                    ? response.json()
                    : Promise.reject(new Error(`${response.status} ${response.statusText}`))
            })
        },
        loggedUser: {
            get(  ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/client/${CONFIG.api.versions.db.clientAPI}/user`, {
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            modify( user ){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/client/${CONFIG.api.versions.db.clientAPI}/user`, {
                    method: 'POST',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8'
                    },
                    body: user
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        }
    };
    segmentation = {
        create(segmentation){
            if(!__token){
                let err = new Error('You must log in first!');
                
                return Promise.reject(err)
            }

            return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.segmentationAPI}/segmentation`, {
                method: 'POST',
                headers: {
                    'X-Auth-Token' : __token,
                    'Accept': 'application/json;charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: segmentation
            }).then( response => {
                return response.ok
                    ? response.json()
                    : Promise.reject(new Error(`${response.status} ${response.statusText}`))
            })
        },
        search : {
            byWorkflow({ user, wfid }){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.segmentationAPI}/segmentation/search/user/${user}/workflow/${wfid}`, {
                    method: 'GET',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            byExecution({ user, eid }){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.segmentationAPI}/segmentation/search/user/${user}/execution/${eid}`, {
                    method: 'GET',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            },
            byExecutionAndCase({ user, eid, cid }){
                if(!__token){
                    let err = new Error('You must log in first!');
                    
                    return Promise.reject(err)
                }

                return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.segmentationAPI}/segmentation/search/user/${user}/execution/${eid}/case/${cid}`, {
                    method: 'GET',
                    headers: {
                        'X-Auth-Token' : __token,
                        'Accept': 'application/json;charset=utf-8',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }).then( response => {
                    return response.ok
                        ? response.json()
                        : Promise.reject(new Error(`${response.status} ${response.statusText}`))
                })
            }
        },
        get(id){
            if(!__token){
                let err = new Error('You must log in first!');
                
                return Promise.reject(err)
            }

            return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.segmentationAPI}/segmentation/${id}`, {
                method: 'GET',
                headers: {
                    'X-Auth-Token' : __token,
                    'Accept': 'application/json;charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then( response => {
                return response.ok
                    ? response.json()
                    : Promise.reject(new Error(`${response.status} ${response.statusText}`))
            })
        },
        modify( { id, segmentation }){
            if(!__token){
                let err = new Error('You must log in first!');
                
                return Promise.reject(err)
            }

            return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.segmentationAPI}/segmentation/${id}`, {
                method: 'PUT',
                headers: {
                    'X-Auth-Token' : __token,
                    'Accept': 'application/json;charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: segmentation
            }).then( response => {
                return response.ok
                    ? response.json()
                    : Promise.reject(new Error(`${response.status} ${response.statusText}`))
            })
        },
        delete(id){
            if(!__token){
                let err = new Error('You must log in first!');
                
                return Promise.reject(err)
            }

            return fetch(`${CONFIG.api.baseURL}/${CONFIG.api.dbAPI}/admin/${CONFIG.api.versions.db.segmentationAPI}/segmentation/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-Auth-Token' : __token,
                    'Accept': 'application/json;charset=utf-8',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then( response => {
                return response.ok
                    ? response.json()
                    : Promise.reject(new Error(`${response.status} ${response.statusText}`))
            })
        }
    }
}

class Exec{
    admin = {
        async: {
            case: {
                add(){}
            },
            properties: {
                local: {
                    multivalued: {
                        value: {
                            add(){},
                            delete(){}
                        }
                    },

                    value: {
                        set(){},
                        delete(){},
                    }
                },
                localCase: {
                    multivalued: {
                        value: {
                            add(){},
                            delete(){}
                        }
                    },

                    value: {
                        set(){},
                        delete(){},
                    }
                },

            },
            workflow: {
                run(){}
            }
        },
        sync: {

        }
    };
    client = {

    }
}

export default APIClient
