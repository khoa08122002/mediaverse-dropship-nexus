"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = exports.Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["EDITOR"] = "EDITOR";
    Role["VIEWER"] = "VIEWER";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
})(Status || (exports.Status = Status = {}));
var client_1 = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return client_1.PrismaClient; } });
//# sourceMappingURL=types.js.map