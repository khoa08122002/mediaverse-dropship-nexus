"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobDto = exports.CreateJobDto = exports.JobStatus = exports.JobType = void 0;
var JobType;
(function (JobType) {
    JobType["FULLTIME"] = "FULLTIME";
    JobType["PARTTIME"] = "PARTTIME";
    JobType["CONTRACT"] = "CONTRACT";
    JobType["INTERNSHIP"] = "INTERNSHIP";
})(JobType || (exports.JobType = JobType = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["ACTIVE"] = "ACTIVE";
    JobStatus["CLOSED"] = "CLOSED";
    JobStatus["DRAFT"] = "DRAFT";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
class CreateJobDto {
}
exports.CreateJobDto = CreateJobDto;
class UpdateJobDto {
}
exports.UpdateJobDto = UpdateJobDto;
//# sourceMappingURL=job.types.js.map