import { BaseModel, DatabaseConfig, Database } from "./db/db.js";
import Fields from './db/fields.js'
import Serializer from "./db/serializer.js";

const sequelize = Database.getSequelize()

export { BaseModel, sequelize, Fields, DatabaseConfig, Database, Serializer }