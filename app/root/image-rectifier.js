var Response = require("ringo/webapp/response").Response;

exports.app = function(app) {
    return Response.skin(module.resolve("../skins/image-rectifier.html"));
};
