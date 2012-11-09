Ext.define('AsBuilt.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: ['AsBuilt.model.User'],
    config: {
        refs: {
            main: 'main',
            popup: 'app_popup',
            searchForm: 'app_search',
            login: 'login',
            loginButton: 'button[text="Login"]',
            userButton: 'container[type="user"]',
            logoffButton: 'button[type="user"]',
            logoffPanel: 'panel[type="logoff"]'
        },

        control: {
            loginButton: {
                tap: 'login'
            },
            logoffButton: {
                tap: 'logoff'
            }
        }

    },

    logoff: function() {
        var login = this.getLogin();
        if (login) {
            login.getFieldsAsArray().forEach(function(field) {
                field.setValue('');
            });
            this.getLogoffPanel().hide();
            this.getMain().destroy();
            var search = Ext.getStore('Search').getAt(0);
            if (search) {
                Ext.getStore('Search').remove(search);
                Ext.getStore('Search').sync();
            }
            if (this.getPopup()) {
                this.getPopup().hide;
            }
            if (this.getSearchForm()) {
                this.getSearchForm().hide();
            }
            Ext.Viewport.setActiveItem(login);
        }
    },

    login: function() {
        var values = this.getLogin().getValues();
        var user = Ext.create('AsBuilt.model.User', values);
        var errors = user.validate();
        if (errors.isValid()) {
            var main = this.getMain();
            if (!main) {
                main = Ext.create('AsBuilt.view.Main', {
                    user: values['username']
                });
            }
            Ext.Viewport.setActiveItem(main);
            this.getUserButton().setHtml('<span class="username">' + values['username'] + '</span><div class="arrow"/>');
            Ext.Viewport.maximize();
            var msg = "WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520.  No part of this record may be disclosed to persons without a 'need to know,' as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation.  Unauthorized release may result in civil penalty or other action.<br/>SFMTA As-Built Design Documents are 'Security Sensitive Information' or 'SSI Documents' and are confidential and protected from public disclosure under federal law, as noted above.<br/>The disclosure of SSI documents to unauthorized persons may cause irreparable damage to the SFMTA, and may threaten or compromise the security of the traveling public, transit employees, or transit infrastructure.<br/>By accessing this program you acknowledge that the disclosure to the public of any documents identified as SSI is against federal law and you agree to abide by the restrictions against disclosure of such documents.</br>Please refer to the SFMTA Statement of Incompatible Activities for more detail regarding prohibited conduct.  Inappropriate use of SFMTA resources may result in discipline, up to and including termination of employment.<br/>For more information, please review the SFMTA Technology Resources Policy available under the Quick Links > IT Support Team tabs on the SFMTA Intranet page.  Continuing means you accept the above conditions.  Press OK when ready.";
            Ext.Msg.show({
                title: ' SENSITIVE SECURITY INFORMATION',
                width: '50em',
                cls: 'security-popup',
                zIndex: 1000,
                showAnimation: null,
                hideAnimation: null,
                message: msg,
                buttons: [{text: 'OK'}],
                promptConfig: false,
                fn: function(){}
            });
        } else {
            var message = '';
            Ext.each(errors.items,function(rec,i){
                message += rec._field + " " + rec._message+"<br>";
            });
            Ext.Msg.show({
                zIndex: 1000,
                showAnimation: null,
                hideAnimation: null,
                message: message,
                buttons: [{text: 'OK'}],
                promptConfig: false,
                fn: function(){}
            });
        }
    }

});
