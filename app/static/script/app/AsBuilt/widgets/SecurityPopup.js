Ext.ns("AsBuilt");
AsBuilt.SecurityPopup = function() {
    Ext.Msg.show({
        title: 'SENSITIVE SECURITY INFORMATION',
        msg: "WARNING: This record contains Sensitive Security Information that is controlled under 49 CFR parts 15 and 1520.  No part of this record may be disclosed to persons without a 'need to know,' as defined in 49 CFR parts 15 and 1520, except with the written permission of the Administrator of the Transportation Security Administration or the Secretary of Transportation.  Unauthorized release may result in civil penalty or other action.<br/>SFMTA As-Built Design Documents are 'Security Sensitive Information' or 'SSI Documents' and are confidential and protected from public disclosure under federal law, as noted above.<br/>The disclosure of SSI documents to unauthorized persons may cause irreparable damage to the SFMTA, and may threaten or compromise the security of the traveling public, transit employees, or transit infrastructure.<br/>By accessing this program you acknowledge that the disclosure to the public of any documents identified as SSI is against federal law and you agree to abide by the restrictions against disclosure of such documents.</br>Please refer to the SFMTA Statement of Incompatible Activities for more detail regarding prohibited conduct.  Inappropriate use of SFMTA resources may result in discipline, up to and including termination of employment.<br/>For more information, please review the SFMTA Technology Resources Policy available under the Quick Links > IT Support Team tabs on the SFMTA Intranet page.  Continuing means you accept the above conditions.  Press OK when ready.",
       buttons: Ext.Msg.OK,
       icon: Ext.MessageBox.INFO
    });
};
