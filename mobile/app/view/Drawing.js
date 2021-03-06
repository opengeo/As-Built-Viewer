Ext.define('AsBuilt.view.Drawing', {
    extend: 'Ext.Container',
    requires: ['GXM.Button', 'AsBuilt.util.Config', 'GXM.Map', 'Ext.field.Checkbox', 'Ext.SegmentedButton'],
    xtype: 'app_drawing',

    config: {
        attributes: null,
        fid: null,
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            height: 50,
            items: [{
                xtype: 'segmentedbutton',
                defaults: {
                    ui: 'drawing'
                },
                items: [{
                    text: AsBuilt.util.Config.getDetailsButtonText(),
                    type: 'details'
                }, {
                    text: AsBuilt.util.Config.getNotesButtonText(),
                    type: "notes_button"
                }, {
                    text: "Zoom",
                    type: "zoom_button"
                }]
            }, {
                xtype: 'spacer',
                width: 50
            }, {
                xtype: 'checkboxfield',
                checked: true,
                type: "show_annotations",
                label: 'Show Annotations',
                labelWidth: 150
            }, {
                xtype: 'spacer',
                flex: 1
            }, {
                text: AsBuilt.util.Config.getDoneButtonText(),
                type: "drawing_done"
            }]
        }]
    },

    initialize: function() {
        var attributes = this.getAttributes();
        // get the notes
        Ext.getStore('Notes').on({'load': function(store, records) {
            var item = this.down('segmentedbutton').getItems().items[1],
                title = AsBuilt.util.Config.getNotesItemTitle();
            if (records.length > 0) {
                item.setText(
                    records.length + " " + AsBuilt.util.Config.getNotesTextSuffix()
                );
                item.title = title;
                AsBuilt.app.getController('Notes').showNotes();
            } else { 
                item.setText(
                    AsBuilt.util.Config.getAddNoteButtonText()
                );
                item.title = title;
            } 
        }, scope: this});
        Ext.getStore('Notes').load({
            filter: new OpenLayers.Filter.Comparison({
                type: '==',
                property: AsBuilt.util.Config.getDocumentIdField(),
                value: this.getFid().split(".").pop()
            })
        });
        // remove first / and add file extension
        var path = attributes[AsBuilt.util.Config.getPathField()];
        if (path.charAt(0) === "/") {
            path = path.substring(1);
        }
        path = path + "." + attributes[AsBuilt.util.Config.getFileTypeField()];
        var width = parseInt(attributes[AsBuilt.util.Config.getImageWidthField()], 10);
        var height = parseInt(attributes[AsBuilt.util.Config.getImageHeightField()], 10);
        var vector = new OpenLayers.Layer.Vector(null, {
            eventListeners: {
                'featureadded': function(evt) {
                    AsBuilt.app.getController('Notes').saveAnnotation(evt.object);
                },
                'afterfeaturemodified': function(evt) {
                    AsBuilt.app.getController('Notes').saveAnnotation(evt.object);
                }
            },
            styleMap: new OpenLayers.StyleMap({
                'default': OpenLayers.Util.applyDefaults({
                    fillColor: "#FF0000",
                    fillOpacity: 0,
                    strokeColor: "#FF0000"
                }, OpenLayers.Feature.Vector.style['default']),
                temporary : OpenLayers.Util.applyDefaults({
                    pointRadius : 16
                }, OpenLayers.Feature.Vector.style.temporary)
            })
        });
        var DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
            initialize: function(layer, options) {
                OpenLayers.Control.prototype.initialize.apply(this, [options]);
                this.layer = layer;
                this.handler = new OpenLayers.Handler.Feature(
                    this, layer, {click: this.clickFeature}
                );
            },
            clickFeature: function(feature) {
                this.layer.destroyFeatures([feature]);
                this.layer.events.triggerEvent("afterfeaturemodified", {object: this.layer});
            },
            setMap: function(map) {
                this.handler.setMap(map);
                OpenLayers.Control.prototype.setMap.apply(this, arguments);
            },
            CLASS_NAME: "OpenLayers.Control.DeleteFeature"
        });
        var map = new OpenLayers.Map({
            projection: "EPSG:404000",
            autoUpdateSize: false,
            theme: null,
            hasTransform3D: false,
            maxExtent: new OpenLayers.Bounds(
                0, -height,
                width, 0
            ),
            maxResolution: width/256,
            units: "m",
            controls : [
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions : {
                        interval : 100,
                        enableKinetic : true
                    }
                }),
                new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Path),
                new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.RegularPolygon, {handlerOptions: {sides: 40}}),
                new OpenLayers.Control.ModifyFeature(vector),
                new DeleteFeature(vector)
            ]
        });
        map.addLayers([new OpenLayers.Layer.WMS(null,
            AsBuilt.util.Config.getGeoserverUrl(), {
               layers: AsBuilt.util.Config.getPrefix() + ":" + AsBuilt.util.Config.getImagesLayer(),
               CQL_FILTER: AsBuilt.util.Config.getPathField() + "='" + path + "'"
            }, {
               buffer: 0,
               transitionEffect: "resize",
               tileLoadingDelay: 300
            }
        ), vector]);
        var mapZoom = 3;
        var res = map.getResolutionForZoom(mapZoom);
        var size = Ext.Viewport.getSize(), w = size.width, h = size.height;
        var factorX = (1 - ((res*w)/width/2));
        var factorY = (1 - ((res*h)/height/2));
        var center = [factorX*width, -factorY*height];
        this.add(Ext.create('GXM.Map', {id: 'drawing_map', map: map, mapCenter: center, mapZoom: mapZoom}));
        this.down('segmentedbutton').add([Ext.create('GXM.Button', {
            control: map.controls[1],
            text: "Draw Line",
            type: "draw_line",
            exclusiveGroup: 'annotation',
            disabled: true
        }), Ext.create("GXM.Button", {
            text: "Draw Circle",
            exclusiveGroup: 'annotation',
            disabled: true,
            type: "draw_circle",
            control: map.controls[2]
        }), Ext.create("GXM.Button", {
            text: "Modify",
            disabled: true,
            exclusiveGroup: 'annotation',
            type: "modify",
            control: map.controls[3]
        }), Ext.create("GXM.Button", {
            text: "Delete",
            disabled: true,
            exclusiveGroup: 'annotation',
            type: "delete",
            control: map.controls[4]
        })]);
        this.callParent(arguments);
    }
});
