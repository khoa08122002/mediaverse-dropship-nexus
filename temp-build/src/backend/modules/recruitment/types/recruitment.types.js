"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStatus = exports.JobStatus = exports.JobType = void 0;
var client_1 = require("@prisma/client");
Object.defineProperty(exports, "JobType", { enumerable: true, get: function () { return client_1.JobType; } });
Object.defineProperty(exports, "JobStatus", { enumerable: true, get: function () { return client_1.JobStatus; } });
Object.defineProperty(exports, "ApplicationStatus", { enumerable: true, get: function () { return client_1.ApplicationStatus; } });
