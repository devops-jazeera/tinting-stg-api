"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var AppExpress_1 = __importDefault(require("./apex/AppExpress"));
var typeorm_1 = require("typeorm");
var Config = __importStar(require("./utils/Config"));
var Log_1 = require("./utils/Log");
var Watcher_1 = require("./utils/Watcher");
//import { main } from "./sync";
var http = require("http");
var Store_1 = require("./utils/Store");
var App_1 = require("./utils/App");
var SysService_1 = require("./SysService");
var SyncMainService_1 = require("./app/task/SyncMainService");
var port = 5000;
var TINTING_STORE_ID = process.env ? process.env.TINTING_STORE_ID : null;
var count = 0;
Config.setEnvConfig();
process.env.TZ = "UTC";
var conn = null;
var run = function () { return __awaiter(_this, void 0, void 0, function () {
    var appExpress, express, httpServer, CallSync, lastSyncDate, diff, error_1;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                Log_1.log.log(Config.dbOptions);
                if (!(!conn || !conn.isConnected)) return [3 /*break*/, 3];
                Watcher_1.WatcherInit();
                console.table(Config.dbOptions);
                return [4 /*yield*/, typeorm_1.createConnection(Config.dbOptions)];
            case 1:
                conn = _a.sent();
                Log_1.log.debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                return [4 /*yield*/, Config.DbEnvConfig()];
            case 2:
                _a.sent();
                Log_1.log.debug("DbEnvConfig Completed");
                Log_1.log.debug("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                _a.label = 3;
            case 3:
                Log_1.log.debug(" ************************************** " + conn.isConnected);
                if (conn && conn.isConnected) {
                    appExpress = new AppExpress_1.default();
                    express = appExpress.express;
                    httpServer = http.Server(express);
                    // const io = require("socket.io")(httpServer);
                    // io.on("connection", function(socket: any) {
                    //   console.log("Client connected!");
                    //   socket.on("message", function(data: any) {
                    //     console.log("Sending update!");
                    //     socket.emit("update", "Working!");
                    //   });
                    // });
                    express.use("/api", function (req, res, next) {
                        if (TINTING_STORE_ID) {
                            var diff = syncTimeDiff();
                            Log_1.log.warn("sync Time Diff:", diff);
                            if (diff > 5) {
                                Log_1.log.error("----->: sync time start : " + diff);
                                sync();
                            }
                        }
                        next();
                    });
                    httpServer.listen(port, function (err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (err) {
                                Log_1.log.error(err);
                                throw err;
                            }
                            return [2 /*return*/, Log_1.log.log("info", "\n                    ***********************************************\n                            server is listening on " + port + "\n                    ***********************************************\n          ")];
                        });
                    }); });
                    try {
                        CallSync = function () { return __awaiter(_this, void 0, void 0, function () {
                            var syncData;
                            return __generator(this, function (_a) {
                                try {
                                    syncData = new SyncMainService_1.SyncMainService();
                                    // await syncData.runSync();
                                    // }
                                }
                                catch (err) {
                                    Log_1.log.error("SyncService 1 Error: ");
                                    Log_1.log.error(err);
                                }
                                return [2 /*return*/];
                            });
                        }); };
                        if (TINTING_STORE_ID) {
                            CallSync();
                        }
                        Log_1.log.info("TINTING_STORE_ID: " + TINTING_STORE_ID);
                        if (TINTING_STORE_ID) {
                            lastSyncDate = null;
                            diff = null;
                            Store_1.StoreInIt();
                            sync();
                        }
                    }
                    catch (error) {
                        Log_1.log.error("Sync Error");
                        Log_1.log.error(error);
                    }
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                Log_1.log.error(error_1);
                setTimeout(function () {
                    if (count <= 5) {
                        count += 1;
                        Log_1.log.error("================ " + count);
                        run();
                    }
                    else {
                        Log_1.log.error(error_1);
                    }
                }, 5000);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
run();
var sync = function () { return __awaiter(_this, void 0, void 0, function () {
    var child_process, fs, syncFileUpdate, macAddress, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                child_process = require("child_process");
                fs = require("fs");
                syncFileUpdate = __dirname + "/update.ts";
                syncFileUpdate = fs.existsSync(syncFileUpdate) ? __dirname + "/update.ts" : __dirname + "/update.js";
                child_process.fork(syncFileUpdate);
                Log_1.log.warn("syncFileUpdate:", syncFileUpdate);
                _a = {};
                return [4 /*yield*/, App_1.App.getMacAddress()];
            case 1:
                _a.systemAddress = _b.sent(),
                    _a.storeId = TINTING_STORE_ID;
                return [4 /*yield*/, SysService_1.SysService.SelectedMacAddress(TINTING_STORE_ID, Log_1.log)];
            case 2:
                macAddress = (_a.selectAddress = _b.sent(),
                    _a);
                console.log(JSON.stringify(macAddress));
                Log_1.log.warn(JSON.stringify(macAddress));
                return [2 /*return*/];
        }
    });
}); };
var syncTimeDiff = function () {
    try {
        var lastSyncDate = Store_1.getItem("syncdate", "index -> cron");
        Log_1.log.warn("Last sync time: ", lastSyncDate);
        lastSyncDate = new Date(lastSyncDate);
        var diff = (new Date().getTime() - lastSyncDate.getTime()) / 60000;
        return diff;
    }
    catch (error) {
        Log_1.log.error(error);
        Store_1.StoreInIt();
        return 0;
    }
};
process.on("uncaughtException", function (err) {
    Log_1.log.error("Caught exception: " + err);
    setTimeout(function () {
        if (count <= 5) {
            count += 1;
            Log_1.log.error("================ " + count);
            run();
        }
        else {
            Log_1.log.error("======= ERROR STORE ID ========= " + TINTING_STORE_ID);
            if (TINTING_STORE_ID) {
                try {
                    Log_1.log.error("======= ERROR ========= ");
                    var errorObj = err;
                    Log_1.log.error(JSON.stringify(errorObj));
                    Log_1.log.error("ERROR-CODE :: " + errorObj.code);
                    Log_1.log.error("======== ERROR ======== ");
                    if (errorObj && errorObj.code == "57P03") {
                        SysService_1.SysService.ResetService(Log_1.log);
                    }
                }
                catch (error) {
                    Log_1.log.error("======= CATCH ERROR ========= ");
                    Log_1.log.error(error);
                }
            }
            Log_1.log.error(err);
        }
    }, 5000);
});
