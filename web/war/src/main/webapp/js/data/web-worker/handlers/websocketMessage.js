define([
    'require',
    'configuration/plugins/registry',
    '../store'
], function(require, registry, store) {
    'use strict';

    var NOOP = function() {},
        storeTypeForData = function(data) {
            return ('graphVertexId' in data) ? 'vertex' : ('graphEdgeId' in data) ? 'edge' : null;
        },
        socketHandlers = {
            workspaceChange: function(data, json) {
                require(['../util/store'], function(legacyStore) {
                    legacyStore.workspaceWasChangedRemotely(data);
                })
            },
            workspaceDelete: function(data) {
                require([
                    '../util/store',
                    './workspaceSwitch'
                ], function(legacyStore, workspaceSwitch) {
                    legacyStore.removeWorkspace(data.workspaceId);
                    workspaceSwitch(data);
                    dispatchMain('rebroadcastEvent', {
                        eventName: 'workspaceDeleted',
                        data: {
                            workspaceId: data.workspaceId
                        }
                    })
                });
            },
            workProductChange: function(data) {
                require(['../store/product/actions'], function(actions) {
                    store.getStore().dispatch(actions.getProduct(data.id))
                })
            },
            workProductDelete: function(data) {
                require(['../store/product/actions'], function(actions) {
                    store.getStore().dispatch(actions.removeProduct(data.id))
                })
            },
            sessionExpiration: function(data) {
                dispatchMain('rebroadcastEvent', {
                    eventName: 'sessionExpiration'
                });
            },
            userStatusChange: (function() {
                var previousById = {};
                return function(data) {
                    var previous = data && previousById[data.id];
                    if (!previous || !_.isEqual(data, previous)) {
                        previousById[data.id] = data;
                        dispatchMain('rebroadcastEvent', {
                            eventName: 'userStatusChange',
                            data: data
                        });
                    }
                }
            })(),
            userWorkspaceChange: NOOP,
            publish: function(data) {
                // Property undo already publishes propertyChange
                if (data.objectType !== 'property' || data.publishType !== 'undo') {
                    socketHandlers.propertyChange(data);
                }
            },
            propertyChange: function(data) {
                var type = storeTypeForData(data),
                    objectId = type && (data.graphVertexId || data.graphEdgeId);

                if (!type) {
                    throw new Error('Property change sent unknown type', data);
                }

                require(['../util/store'], function(legacyStore) {
                    var storeObject = legacyStore.getObject(publicData.currentWorkspaceId, type, objectId),
                        edgeCreation = type === 'edge' && !('propertyName' in data);
                    if (storeObject || edgeCreation) {
                        require(['../services/' + type], function(service) {
                            service.properties(objectId)
                                .catch(function(error) {
                                    // Ignore 404's since we need to check if
                                    // we have access to changed object
                                    if (!error || error.status !== 404) {
                                        throw error;
                                    }

                                    if (type === 'vertex') {
                                        legacyStore.removeWorkspaceVertexIds(publicData.currentWorkspaceId, objectId);
                                        dispatchMain('rebroadcastEvent', {
                                            eventName: 'verticesDeleted',
                                            data: {
                                                vertexIds: [objectId]
                                            }
                                        });
                                    } else {
                                        legacyStore.removeObject(publicData.currentWorkspaceId, 'edge', objectId);
                                        dispatchMain('rebroadcastEvent', {
                                            eventName: 'edgesDeleted',
                                            data: {
                                                edgeId: objectId
                                            }
                                        });
                                    }
                                }).done();
                        });
                    }
                });
            },
            verticesDeleted: function(data) {
                require(['../util/store'], function(legacyStore) {
                    var storeObjects = _.compact(
                            legacyStore.getObjects(publicData.currentWorkspaceId, 'vertex', data.vertexIds)
                        );
                    if (storeObjects.length) {
                        require(['../services/vertex'], function(vertex) {
                            vertex.exists(_.pluck(storeObjects, 'id'))
                                .then(function(existsResponse) {
                                    var deleted = _.keys(_.pick(existsResponse.exists, function(exists) {
                                        return !exists;
                                    }));
                                    if (deleted.length) {
                                        legacyStore.removeWorkspaceVertexIds(publicData.currentWorkspaceId, deleted);
                                        dispatchMain('rebroadcastEvent', {
                                            eventName: 'verticesDeleted',
                                            data: {
                                                vertexIds: data.vertexIds
                                            }
                                        });
                                    }
                                })
                                .catch(function() {
                                    legacyStore.removeWorkspaceVertexIds(publicData.currentWorkspaceId, data.vertexIds);
                                    dispatchMain('rebroadcastEvent', {
                                        eventName: 'verticesDeleted',
                                        data: {
                                            vertexIds: data.vertexIds
                                        }
                                    });
                                });
                        });
                    }
                });
            },
            edgeDeletion: function(data) {
                require([
                    '../util/store',
                    '../services/edge'
                ], function(legacyStore, edge) {
                    edge.exists([data.edgeId])
                        .then(function(r) {
                            if (!r.exists[data.edgeId]) {
                                legacyStore.removeObject(publicData.currentWorkspaceId, 'edge', data.edgeId);
                                dispatchMain('rebroadcastEvent', {
                                    eventName: 'edgesDeleted',
                                    data: data
                                });
                            }
                        })
                });
            },
            textUpdated: function(data) {
                if (data.graphVertexId &&
                    (!data.workspaceId ||
                     data.workspaceId === publicData.currentWorkspaceId)) {

                    dispatchMain('rebroadcastEvent', {
                        eventName: 'textUpdated',
                        data: {
                            vertexId: data.graphVertexId
                        }
                    })
                }
            },
            longRunningProcessDeleted: function(processId) {
                dispatchMain('rebroadcastEvent', {
                    eventName: 'longRunningProcessDeleted',
                    data: {
                        processId: processId
                    }
                });
            },
            longRunningProcessChange: function(process) {
                dispatchMain('rebroadcastEvent', {
                    eventName: 'longRunningProcessChanged',
                    data: {
                        process: process
                    }
                });
            },
            entityImageUpdated: function(data) {
                if (data && data.graphVertexId) {
                    socketHandlers.propertyChange(data);
                }
            },
            notification: function(data) {
                dispatchMain('rebroadcastEvent', {
                    eventName: 'notificationActive',
                    data: data
                });
            },
            systemNotificationUpdated: function(data) {
                dispatchMain('rebroadcastEvent', {
                    eventName: 'notificationUpdated',
                    data: data
                });
            },
            systemNotificationEnded: function(data) {
                dispatchMain('rebroadcastEvent', {
                    eventName: 'notificationDeleted',
                    data: data
                });
            }
        },
        callHandlersForName = function(name, data) {
            var extensions = _.where(
                registry.extensionsForPoint('org.visallo.websocket.message'),
                { name: name }
            );
            if (extensions.length) {
                extensions.forEach(function(e) {
                    e.handler(data);
                });

                return true;
            }
        };

    return function(data) {
        var body = data.responseBody,
            json = JSON.parse(body);

        if (isBatchMessage(json)) {
            var filtered = _.reject(json.data, messageFromUs);
            if (filtered.length) {
                console.groupCollapsed('Socket Batch (' + filtered.length + ')');
                filtered.forEach(process);
                console.groupEnd();
            }
        } else if (!messageFromUs(json)) {
            process(json);
        }
    }

    function process(json) {
        console.debug('%cSocket: %s %O', 'color:#999;font-style:italics', json.type, json.data || json)
        if (json.type in socketHandlers) {
            socketHandlers[json.type]('data' in json ? json.data : json, json);
            callHandlersForName(json.type, json.data);
        } else if (!callHandlersForName(json.type, json.data)) {
            console.warn('Unhandled socket message type:' + json.type, 'message:', json);
        }
    }

    function messageFromUs(json) {
        return json.sourceGuid && json.sourceGuid === publicData.socketSourceGuid;
    }

    function isBatchMessage(json) {
        return json.type === 'batch' && _.isArray(json.data);
    }
});
