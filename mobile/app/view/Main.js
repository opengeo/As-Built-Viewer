Ext.define("AsBuilt.view.Main", {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
        'GXM.FeatureList',
        'AsBuilt.view.Map',
        'AsBuilt.util.Config'
    ],
    config: {
        user: null,
        fullscreen: true,
        layout: 'vbox',
        items: [{
            xtype: 'container',
            layout: 'fit',
            flex: 1,
            items: [{
                xtype: 'toolbar',
                height: 50,
                docked: 'top',
                items: [{
                    xtype: 'container',
                    cls: 'header-container',
                    html: AsBuilt.util.Config.getHeaderText()
                }, {
                    xtype: 'container',
                    cls: 'title-container',
                    html: AsBuilt.util.Config.getTitleText()
                }]
            }, {
                xtype: 'app_map'
            }, {
                xtype: 'toolbar',
                listeners: {
                    dragend: {
                        fn: function(event) {
                            var deltaY = event.deltaY,
                                height = Ext.getCmp('listcontainer').getHeight(),
                                maxHeight = Ext.Viewport.getSize().height - 100,
                                minHeight = 0,
                                newHeight;
                            // the toolbar has been moved up, increase the height of the table
                            if (deltaY < 0) {
                                newHeight = height + Math.abs(deltaY);
                                if (newHeight <= maxHeight) {
                                    Ext.getCmp('listcontainer').setHeight(newHeight);
                                } else {
                                    Ext.getCmp('listcontainer').setHeight(maxHeight);
                                }
                            } else if (deltaY > 0) {
                                newHeight = height - deltaY;
                                if (newHeight >= minHeight) {
                                    Ext.getCmp('listcontainer').setHeight(newHeight);
                                } else {
                                    Ext.getCmp('listcontainer').setHeight(minHeight);
                                }
                            }
                            Ext.Viewport.down('app_map').getMap().updateSize();
                        },
                        element: 'element'
                    }
                },
                height: 50,
                docked: 'bottom',
                items: [{
                    xtype: 'segmentedbutton',
                    id: 'mapped-group',
                    hidden: true,
                    defaults: {
                        width: '9em',
                        ui: 'filter'
                    },
                    items: [{
                        text: AsBuilt.util.Config.getAllFilterButtonText(),
                        id: 'filter_all'
                    }, {
                        text: AsBuilt.util.Config.getMappedFilterButtonText(),
                        id: 'filter_mapped'
                    }, {
                        text: AsBuilt.util.Config.getUnmappedFilterButtonText(),
                        id: 'filter_unmapped'
                    }]
                }, {
                    xtype: 'spacer',
                    flex: 1
                }, {
                    iconMask: 'true',
                    ui: 'filter',
                    id: 'search',
                    iconCls: 'search'
                }, {
                    text: AsBuilt.util.Config.getCancelButtonText(),
                    id: 'cancel_search',
                    ui: 'filter',
                    hidden: true
                }, {
                    text: AsBuilt.util.Config.getResetButtonText(),
                    id: 'reset_search',
                    ui: 'filter',
                    hidden: true
                }, {
                    text: AsBuilt.util.Config.getModifySearchButtonText(),
                    id: 'modify_search',
                    ui: 'filter',
                    hidden: true
                }]
            }]
        }, {
            xtype: 'container',
            id: "listcontainer",
            listeners: {
                "painted": function() {
                    var mapPanel = Ext.ComponentQuery.query('app_map')[0];
                    var lyr;
                    for (var i=0, ii=mapPanel.getMap().layers.length; i<ii; ++i) {
                        lyr = mapPanel.getMap().layers[i];
                        if (lyr instanceof OpenLayers.Layer.Vector && lyr.protocol) {
                            break;
                        }
                    }
                    var featureList = Ext.Viewport.down("gxm_featurelist");
                    if (!featureList) {
                        this.add(Ext.create("GXM.FeatureList", {
                            layer: lyr,
                            listeners: {
                                'itemtap': function(list, idx, target, record) {
                                    var popup = Ext.Viewport.down('gxm_featurepopup');
                                    if (popup) {
                                        popup.hide();
                                    }
                                    // TODO centralize this code, is also in view/Map.js
                                    var f = record.getFeature();
                                    var drawing = Ext.create('AsBuilt.view.Drawing', {
                                        fid: f.fid,
                                        attributes: f.attributes
                                    });
                                    var search = Ext.Viewport.down('app_search');
                                    if (search) {
                                        search.hide();
                                    }
                                    Ext.Viewport.add(drawing);
                                    Ext.Viewport.setActiveItem(drawing);
                                }
                            },
                            itemTpl: new Ext.XTemplate(AsBuilt.util.Config.getListItemTpl())
                        }));
                    }
                }
            },
            layout: "fit",
            items: [{
                xtype: 'toolbar', 
                docked: 'top', 
                id: 'featurelist-toolbar', 
                ui: 'maxfeatures', 
                hidden: true, 
                items: [{
                    xtype: 'container', 
                    cls: 'maxfeatures', 
                    width: '100%'
                }]
            }],
            height: 250
        }]
    }
});
