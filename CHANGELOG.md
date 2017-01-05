
v3.0.1
==================

v3.0.0
==================

## Added

* Added route to get saved search on workspace
* Add map configuration UI with [`org.visallo.map.options`](http://docs.visallo.org/extension-points/front-end/mapOptions/) extension point
* Graph and Map are now &#34;Case Work Products&#34; within a workspace. Multiple of each type can be created within one workspace.


## Changed

* Collapse equal histogram detail values instead of range
* Geolocation properties are not sortable by default.
* Give default authorizations to all users, not just users without auths
* GraphUpdateContext to abstract to make it clear that you should get the instance from GraphRepository
* Multi-select detail histogram bottom margin
* Remove Exception from GraphUpdateContext#close to avoid needing to catch
* Speed up ACLProvider by caching the ontology property IRI
* Speed up ACLProvider by not repeatly calling hasPrivilege
* Upgrade Accumulo from 1.6.1 to 1.6.6
* Upgrade Accumulo from 1.6.6 to 1.7.2
* Upgrade Elasticsearch from 1.7.2 to 1.7.5
* Upgrade Hadoop from CDH5.4.2 to 2.7.3
* Upgrade V5 dependencies to support new infrastructure versions
* Upgrade ZooKeeper from 3.4.7 to 3.4.9
* Webapp and plugins install dependencies with [yarn](https://yarnpkg.com) instead of npm
* Webstart version from v2.2.0 to v2.2.1

## Fixed

* Delete the product vertices when deleting the workspace vertex
* Fix issue where decorations would not position correctly after vertex update
* Fix SearchHelper switching after workspace search removed
* GPW streaming value temp file creation with invalid path char
* Added listeners to update the card locations on the server since there were certain instances in which the card locations were not updated and saved to the server.
* After a successful logout, a &#39;Server is not available&#39; message would appear.
* Find related properties missing
* Multiple selection histogram would sometimes have overlapping number/text
* Offline overlay not appearing when the browser loses network connection.
* Relationship lookup in ontology gets related properties
* Relationship lookup in ontology gets related properties
* Search related icon on relationship sections in vertex detail panes no longer shows in fullscreen details where search is not available.
* Users without edit privilege won&#39;t see work product create /  delete / edit buttons
* detail pane showing comment reply buttons and add property/comment toolbar items
* graph images in IE
* graph.flush calls on ontology update methods to prevent race conditions

## Removed

* `active` property is no longer included in `workspace/all` response for easy change tracking
* `pluginDevMode` is no longer available. Turn off compilation on a per-file basis with `registerCompiledJavaScript` or `skipCompile`
* Add to Workspace URL scheme has been removed as entities can&#39;t be added to a workspace.
* Statistics aggregation option in saved search dashboard cards. This aggregation type will be reworked in a future release.
* Workspace search is removed since workspaces don&#39;t have entities

v2.2.2
==================

## Changed

* User account management modal to use an user’s display name rather
  than username

## Fixed

* Prevent notification groups to get dismissed inadvertently
* Property info popover not opening when clicking on another user’s
  comment.

v2.2.1
==================

## Added

* Add the ability to configure development web servers to ask for a
  client certificate (i.e. want), without requiring one.
* Data/display type formatters now return the element.

## Changed

* Added method to allow directory searches for people to return an email
  attribute
* Default authorizations will be given to all users, not just users
  without any existing authorizations.
* Provide options for restricting directory search to people and/or
  groups

## Fixed

* Dashboard card components no longer stick around when they’re not
  supposed to.
* Dashboard does not freeze anymore when cards are moved vertically

v2.2.0
==================

## Added

* HISTORY_READ privilege required for viewing vertex/edge/property history
* An archetype jar to help developers generate a maven project to start plugin development.
* OwlToJava: Support StreamingPropertyValue and DirectoryEntity types
* Allow admin extensions to request a sort within a section
* Provide a way to redirect the user after authenticating
* Add methods which take timestamps to SingleValueVisalloProperty and VisalloProperty
* Include babel polyfill https://babeljs.io/docs/usage/polyfill/

## Changed

* Upgraded React from 0.14.8 to 15.3.0
* version branch 2.2 depends on the vertexium 2.4.5
* Refactor web visibility validation to VisibilityValidator class
* Web: Merge logic to get client IP address from CurrentUser and AuthenticationHander
* Allow ACLProvider to continue even if a concept or relationship cannot be found

## Fixed

* Add user admin privilges plugin to visallo-dev-jetty-server module
* Dashboard pie chart infinite loop

## Documentation

* Steps to generate the archetype jar

## Deprecated

* getRemoteAddr to provide a more consistent way of retrieving the client IP address. Use RemoteAddressUtil.getClientIpAddr to get the client IP address in the future.

v2.1.2
==================

## Fixed

* Issue where search property filters did not show up in IE.
* Search filters had a bug due to using a single equals rather than
  comparing with triple equals.

v2.1.1
==================

## Changed

* Only show available properties that are sortable (specified in
  ontology) in search pane sort inv.
* Pass vertex to `shouldDisable` handler for `org.visallo.vertex.menu`
  extensions
* The `org.visallo.detail.text` front-end extension function
  `shouldReplaceTextSectionForVertex` is now passed property name and
key

## Fixed

* Activity pane now shows correctly when multiple activity extensions
  are registered.
* Admin user editor now correctly resets authorization list when
  switching between users
* _Find Path_ actions in activity pane update correctly when multiple
  rows have the same source and destination vertices.
* No longer offer string properties as available properties to aggregate
  on in histograms (only dates and numbers are supported)
* Property select field not disabling properly when there are no
  available properties.
* Vertexium user property map not being updated through Proxy User
* When creating a connection in the graph, the preview edge arrow
  displays correctly after inverting direction
* Workspace sharing between users with published entities might
  disappear for some users on update.

## Documentation

* Add `shouldDisable` example to
  [`org.visallo.vertex.menu`](http://docs.visallo.org/extension-points/front-end/vertexMenu/)
* Extension documentation for
  [`org.visallo.detail.text`](http://docs.visallo.org/extension-points/front-end/detailText/)
* Update web app plugin tutorial to use public API and fix errors

## Removed

* FormatVisallo CLI tool

v2.1.0
==================

  * Always update ontology in evaluator context
  * Upgrade jetty to 9.2.9.v20150224
  * Fix double import when using enter to import file
  * Add filters to aggregation property selects and check for mapzen
  * Fix issues so saved searches can switch between global and private with the appropriate user privilege
  * Fix accumulo security exception when access is deleted from another user
  * Fix flashing of right aligned numbers in multiple selection histogram detail pane.
  * Truncate the histogram text so count number is visible
  * RDF Export: add rdf comment to exported file for unsupported data types
  * Fix acl check for compound properties
  * Escape quotes exported RDF literals
  * Fix bug with importing strings with quotes in them from rdf
  * RDF Import: Fix metadata import, mutation not being updated to a ExistingElementMutation correctly
  * Add visallo system metadata to elements and properties when importing using xml rdf (#541)
  * Remove includes as IE doesn't have it
  * UserAdminCLI: Support setting authorizations and privileges from the user admin CLI
  * Add popover positioning to map component
  * Protect against NPE's when checking workspace access. Happens when shared workspace deleted
  * Fix dashboard saved search still loading when limit is set
  * Match visallo dep to poi with tika's dep version. Fixes importing docx
  * Fix firefox text cutting off at end of dashboard bar charts
  * Use init parameters when creating configuration
  * Change exec-maven-plugin group id from org.apache.maven.plugins to org.codehaus.mojo.
  * Remove dialogs and popovers on session expiration
  * Remove text that says delete will remove relationship
  * Fix syntax error in style url background-image
  * Fix some race conditions with text property updating while in the process of opening another text
  * Fix uploaded image not being pushed onto queue
  * MetricsManager in RdfTripleImportHelper
  * Configuration: Support setting system properties via Visallo configuration properties
  * Fix exceptions in iterator finalize
  * Fix dashboard missing extension toolbar items when on shared workspace dashboard
  * Add option requiredPrivilege to registerExtension to suppress extension based on privileges
  * Add handlers to toggle registered keyboard shortcuts
  * Correctly add a vertex to shared workspace if visibility is change such that the shared workspace can now see it
  * User must have SEARCH_SAVE_GLOBAL privilege to save/delete
  * Add the server's host name to the ping vertex id
  * Upgrade Vertexium from 2.4.3 to 2.4.4
  * User admin styling post-refactor fixes
  * Use component attacher for menubar extensions
  * RDF: Increase RDF triple import performance by hanging onto the Vertexium mutations between lines
  * Remove unnecessary edge filtering which broke with published edges
  * Stickier user notifications
  * Hide search hits label after closing pane
  * Add new user auths and default auths to graph
  * Fix acl add/update/delete checks on comment properties
  * Adjust popover z-index to appear on top of closest modal
  * Uglify production builds while correctly concatenating sourcemap from babel
  * Use babel to transpile all js, not just jsx.
  * Fix UI issue if no creator of the workspace is found
  * Fix detectedObjects & properties with long text causing detail overflow
  * Refactor Authorizations and Privileges out of UserRepository into AuthorizationRepository and PrivilegeRepository
  * Visibility validation and highlighting on term and import forms
  * Highlighting for invalid comment visibility input
  * Add clientIpAddress to log4j MDC
  * Fix babel plugin compilation for jsx
  * Move Apache Poi version to root pom
  * Fix NPE when calling toString on ClientApiWorkspace when users or vertices are null
  * Add workspace and user title formulas. Add concept type properties to dashboard and dashboard item vertices
  * RDF: Support raw (not transformed by VisibilityTranslator) visibility.
  * Move eslint and set root flag
  * Add ConfigDirectoryStaticResourceHandler helper class to load files and serve them from the Visallo config directories
  * Fix z-index calculation for multiple stacked modals
  * Upgrade tika to 1.13 and commons compress to 1.11 to match tika dependency
  * Add additional checks to ACLProvider to help troubleshoot
  * Keep track of open vertex previews
  * Add hash visibility source to TM vertex id if it exists
  * Update grunt deps (grunt from ^0.4.5 to ^1.0.1 and grunt-exect from ^0.4.6 to ^1.0.0)
  * Adds documentation for web.cacheServletFilter.maxAge property
  * Document pluginDevMode in dev property file
  * Eslint upgrade (eslint-plugin-react to ^5.2.2 and grunt-eslint to ^19.0.0)
  * Add object rest/spread support plugin to babel
  * Fix edit visibility of text when collapsed
  * Ignore hidden legend labels when ellipsizing
  * Create more consistant metadata in GPWs, to include modified by and modified date
  * Validate visibility fields
  * Upgrade to gitbook 3
