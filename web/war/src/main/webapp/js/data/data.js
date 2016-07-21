
define([
    'flight/lib/component',
    './withPublicApi',
    './withBrokenWorkerConsole',
    './withDataRequestHandler',
    './withCurrentUser',
    './withCachedConceptIcons',
    './withDocumentCopyText',
    './withWebsocket',
    './withWebsocketLegacy',
    './withKeyboardRegistration',
    './withObjectSelection',
    './withObjectsUpdated',
    './withClipboard',
    './withWorkspaces',
    './withWorkspaceFiltering',
    './withWorkspaceVertexDrop'
], function(
    defineComponent
    // mixins auto added in order (change index of slice)
) {
    'use strict';

    var PATH_TO_WORKER = 'jsc/data/web-worker/data-worker.js',
        mixins = Array.prototype.slice.call(arguments, 1);

    return defineComponent.apply(null, [Data].concat(mixins));

    function Data() {

        this.after('initialize', function() {
            var self = this;

            this.setupDataWorker();

            this.dataRequestPromise = new Promise(function(fulfill, reject) {
                    if (self.visalloData.readyForDataRequests) {
                        fulfill();
                    } else {
                        var timer = _.delay(reject, 10000);
                        self.on('readyForDataRequests', function readyForDataRequests() {
                            if (timer) {
                                clearTimeout(timer);
                            }
                            fulfill();
                            self.off('readyForDataRequests', readyForDataRequests);
                        });
                    }
                }).then(function() {
                    return Promise.require('util/withDataRequest');
                }).then(function(withDataRequest) {
                    return withDataRequest.dataRequest;
                });

            this.messagesPromise = this.dataRequestPromise.then(function() {
                    return Promise.require('util/messages');
                }).then(this.setupMessages.bind(this));

            if (typeof DEBUG !== 'undefined') {
                DEBUG.logCacheStats = function() {
                    self.worker.postMessage({
                        type: 'postCacheStats'
                    });
                }
            }
        });

        this.setupMessages = function(i18n) {
            window.i18n = i18n;
            return i18n;
        };

        this.setupDataWorker = function() {
            var self = this;

            this.worker = new Worker(PATH_TO_WORKER + '?' + visalloCacheBreaker);
            this.worker.postMessage(JSON.stringify({
                cacheBreaker: visalloCacheBreaker,
                webWorkerResources: visalloPluginResources.webWorker
            }));
            this.worker.onmessage = this.onDataWorkerMessage.bind(this);
            this.worker.onerror = this.onDataWorkerError.bind(this);

            require(['redux'], function(redux) {

                var workerMiddleware = () => (next) => {
                    if (!next) {
                        console.error( // eslint-disable-line no-console
                            'Fatal: worker middleware received no `next` action. Check your chain of middlewares.'
                        );
                    }

                    self.worker.addEventListener('message', function(event) {
                        var data = event.data;
                        if (!_.isArray(data)) {
                            console.log('ACTION', data.action)
                            next(data.action);
                        }
                    })

                    return (action) => {
                        console.log(action)
                        if (action.meta && action.meta.WebWorker) {
                            self.worker.postMessage(action);
                        } else {
                            return next(action);
                        }
                    };
                };
                var store = redux.createStore(function(store, action) {
                    if (!store) return { test: 'hello from main' }
                    console.log('REDUCER', store, action)
                    if (action && action.type === 'TEST') {
                        return Object.assign({}, store, { test: action.test })
                    }
                    return store;
                }, redux.applyMiddleware(workerMiddleware));

                self._reduxStore = store;
                visalloData._reduxStore = store;
            })
        };

        this.onDataWorkerError = function(event) {
            console.error('data-worker error', event);
        };

        this.onDataWorkerMessage = function(event) {
            var data = event.data;

            if (_.isArray(data)) {
                data.forEach(this.processWorkerMessage.bind(this));
            } else {
                this.processWorkerMessage(data);
            }
        };

        this.processWorkerMessage = function(message) {
            if (message.type && (message.type in this)) {
                this[message.type](message);
            } else {
                console.warn('Unhandled message from worker', message);
            }
        }
    }
});
