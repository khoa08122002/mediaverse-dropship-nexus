"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var prisma_module_1 = require("./prisma/prisma.module");
var user_module_1 = require("./modules/user/user.module");
var auth_module_1 = require("./modules/auth/auth.module");
var blog_module_1 = require("./modules/blog/blog.module");
var contact_module_1 = require("./modules/contact/contact.module");
var recruitment_module_1 = require("./modules/recruitment/recruitment.module");
var file_upload_module_1 = require("./modules/file-upload/file-upload.module");
var health_module_1 = require("./modules/health/health.module");
var public_decorator_1 = require("./modules/auth/decorators/public.decorator");
var AppController = function () {
    var _classDecorators = [(0, common_1.Controller)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _health_decorators;
    var _ready_decorators;
    var AppController = _classThis = /** @class */ (function () {
        function AppController_1() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(AppController.name));
        }
        AppController_1.prototype.health = function () {
            this.logger.log('Simple health check requested');
            return { status: 'ok' };
        };
        AppController_1.prototype.ready = function () {
            this.logger.log('Readiness check requested');
            return { status: 'ready' };
        };
        return AppController_1;
    }());
    __setFunctionName(_classThis, "AppController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _health_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('health')];
        _ready_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Get)('ready')];
        __esDecorate(_classThis, null, _health_decorators, { kind: "method", name: "health", static: false, private: false, access: { has: function (obj) { return "health" in obj; }, get: function (obj) { return obj.health; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _ready_decorators, { kind: "method", name: "ready", static: false, private: false, access: { has: function (obj) { return "ready" in obj; }, get: function (obj) { return obj.ready; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppController = _classThis;
}();
exports.AppController = AppController;
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    cache: true,
                    envFilePath: ['.env', '.env.production'],
                    expandVariables: true,
                    validate: function (config) {
                        var required = ['JWT_SECRET'];
                        var missing = required.filter(function (key) { return !config[key]; });
                        if (missing.length > 0) {
                            console.warn("Missing environment variables: ".concat(missing.join(', ')));
                        }
                        return config;
                    },
                }),
                prisma_module_1.PrismaModule,
                user_module_1.UserModule,
                auth_module_1.AuthModule,
                blog_module_1.BlogModule,
                contact_module_1.ContactModule,
                recruitment_module_1.RecruitmentModule,
                file_upload_module_1.FileUploadModule,
                health_module_1.HealthModule,
            ],
            controllers: [AppController],
            providers: [],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
