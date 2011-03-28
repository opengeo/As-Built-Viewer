Ext.ns("AsBuilt");
/** api: constructor
 *  .. class:: Search(config)
 *
 *    Search for images.
 */
AsBuilt.Search = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = app_search */
    ptype: "app_search",

    /** api: config[searchLabel]
     *  ``String``
     *  Label for search input (i18n).
     */
    searchLabel: "Search",

    /** api: method[init]
     *  :arg target: ``gxp.Viewer``
     *  Initialize the plugin.
     */
    init: function(target) {
        AsBuilt.Search.superclass.init.apply(this, arguments);
        this.initContainer();
    },

    addActions: function(config) {
        this.addOutput();
        return AsBuilt.Search.superclass.addActions.call(this, []);
    },

    /** private: method[initContainer]
     *  Create the primary output container.  All other items will be added to 
     *  this when the group feature store is ready.
     */
    initContainer: function() {
        this.container = new Ext.Container(Ext.apply({
            layout: "border",
            items: [{
                layout: "form",
                height: 200,
                region: "north",
                border: false,
                bodyStyle: "padding: 5px",
                items: [{
                    xtype: "fieldset",
                    title: this.searchLabel,
                    items: [{
                        xtype: "combo",
                        width: 140,
                        name: "streetname",
                        fieldLabel: "Street name",
                        emptyText: "Select a street",
                        triggerAction: 'all',
                        displayField: 'name',
                        store: new Ext.data.JsonStore({
                            fields: ['name'],
                            root: 'streets',
                            url: "/stub/streets.json"
                        })
                    }, {
                        xtype: "combo",
                        width: 140,
                        disabled: true,
                        name: "start_intersection",
                        fieldLabel: "Starting intersection"
                    }, {
                        xtype: "combo",
                        width: 140,
                        disabled: true,
                        name: "end_intersection",
                        fieldLabel: "Ending intersection"
                    }]
                }]
            }, {
                xtype: "container",
                layout: "fit",
                region: "center",
                ref: "gridContainer"
            }]
        }, this.outputConfig));
        delete this.outputConfig;
    },

    /** api: method[addOutput]
     */
    addOutput: function() {
        return AsBuilt.Search.superclass.addOutput.call(this, this.container);
    }

});

Ext.preg(AsBuilt.Search.prototype.ptype, AsBuilt.Search);
