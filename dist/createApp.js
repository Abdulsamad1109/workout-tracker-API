"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const express_validator_1 = require("express-validator");
const swagger_1 = require("./congfig/swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.use('/api/users', users_1.default);
    app.use('/api/auth', auth_1.default);
    app.get('/greet', (0, express_validator_1.query)('person').notEmpty().escape(), (req, res) => {
        const result = (0, express_validator_1.validationResult)(req);
        console.log('req.query.person:', req.query.person);
        console.log('Type:', typeof req.query.person);
        if (result.isEmpty()) {
            return res.send(`Hello, ${req.query.person}!`);
        }
        res.send({ errors: result.array() });
    });
    return app;
}
//# sourceMappingURL=createApp.js.map