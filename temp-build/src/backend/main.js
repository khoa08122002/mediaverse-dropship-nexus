"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var common_1 = require("@nestjs/common");
var app_module_1 = require("./app.module");
var swagger_1 = require("@nestjs/swagger");
var cookieParser = require("cookie-parser");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, app_1, corsOrigins, config, document_1, port, host, error_1, signals, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new common_1.Logger('Bootstrap');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    // Print startup information
                    logger.log('=================================');
                    logger.log('Starting application initialization...');
                    logger.log("Environment: ".concat(process.env.NODE_ENV));
                    logger.log("Port: ".concat(process.env.PORT));
                    logger.log("Host: ".concat(process.env.HOST));
                    logger.log("Database URL configured: ".concat(!!process.env.DATABASE_URL));
                    logger.log("JWT Secret configured: ".concat(!!process.env.JWT_SECRET));
                    logger.log('=================================');
                    // Create NestJS application
                    logger.log('Creating NestJS application...');
                    return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule, {
                            logger: ['error', 'warn', 'log'],
                        })];
                case 2:
                    app_1 = _a.sent();
                    corsOrigins = process.env.NODE_ENV === 'production'
                        ? ['https://phg2.vercel.app']
                        : ['http://localhost:3000', 'http://localhost:5173'];
                    logger.log("Configuring CORS with origins: ".concat(corsOrigins));
                    app_1.enableCors({
                        origin: corsOrigins,
                        credentials: true,
                    });
                    // Configure global pipes and middleware
                    logger.log('Configuring global pipes and middleware...');
                    app_1.useGlobalPipes(new common_1.ValidationPipe({
                        transform: true,
                        whitelist: true,
                    }));
                    app_1.use(cookieParser());
                    app_1.setGlobalPrefix('api');
                    // Configure Swagger only in development
                    if (process.env.NODE_ENV !== 'production') {
                        logger.log('Setting up Swagger documentation...');
                        config = new swagger_1.DocumentBuilder()
                            .setTitle('PHG Corporation API')
                            .setDescription('The PHG Corporation API description')
                            .setVersion('1.0')
                            .addBearerAuth()
                            .build();
                        document_1 = swagger_1.SwaggerModule.createDocument(app_1, config);
                        swagger_1.SwaggerModule.setup('api/docs', app_1, document_1);
                    }
                    port = process.env.PORT || 3002;
                    host = process.env.HOST || '0.0.0.0';
                    logger.log("Attempting to start server on ".concat(host, ":").concat(port, "..."));
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, app_1.listen(port, host)];
                case 4:
                    _a.sent();
                    logger.log('=================================');
                    logger.log('Application successfully started!');
                    logger.log("Server is running on ".concat(host, ":").concat(port));
                    logger.log("Environment: ".concat(process.env.NODE_ENV));
                    logger.log("Health check endpoint: /api/health");
                    logger.log('=================================');
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    logger.error("Failed to start server on ".concat(host, ":").concat(port));
                    logger.error('Server startup error:', error_1);
                    throw error_1;
                case 6:
                    signals = ['SIGTERM', 'SIGINT'];
                    signals.forEach(function (signal) {
                        process.on(signal, function () { return __awaiter(_this, void 0, void 0, function () {
                            var error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        logger.log("".concat(signal, " received. Shutting down gracefully..."));
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, app_1.close()];
                                    case 2:
                                        _a.sent();
                                        logger.log('Application closed successfully');
                                        process.exit(0);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_3 = _a.sent();
                                        logger.error('Error during shutdown:', error_3);
                                        process.exit(1);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    logger.error('Fatal error during application bootstrap:');
                    logger.error(error_2);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Add global unhandled error handlers
process.on('uncaughtException', function (error) {
    console.error('Uncaught Exception:');
    console.error(error);
    process.exit(1);
});
process.on('unhandledRejection', function (reason) {
    console.error('Unhandled Rejection:');
    console.error(reason);
    process.exit(1);
});
bootstrap();
