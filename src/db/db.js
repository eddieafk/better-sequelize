import { Sequelize, DataTypes, Model } from 'sequelize';
import Fields from './fields.js'

let sequelize = null;

    const defaultConfig = {
        dialect: 'sqlite',
        storage: 'database.sqlite',
        host: 'localhost',
        port: null,
        username: null,
        password: null,
        database: null,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    };
    
    const dialectConfigs = {
        mysql: {
            port: 3306,
            dialect: 'mysql'
        },
        postgres: {
            port: 5432,
            dialect: 'postgres'
        },
        sqlite: {
            dialect: 'sqlite',
            storage: 'database.sqlite'
        }
    };

    class DatabaseConfig {
        static createConfig(options = {}) {
            const dialect = options.dialect || 'sqlite';
            
            if (!dialectConfigs[dialect]) {
                throw new Error(`Unsupported dialect: ${dialect}. Supported dialects are: ${Object.keys(dialectConfigs).join(', ')}`);
            }
    
            return {
                ...defaultConfig,
                ...dialectConfigs[dialect],
                ...options
            };
        }
    }

    class Database {
        static initialize(config = {}) {
            const dbConfig = DatabaseConfig.createConfig(config);
            sequelize = new Sequelize(dbConfig);
            return sequelize;
        }
    
        static getSequelize() {
            if (!sequelize) {
                sequelize = Database.initialize();
            }
            return sequelize;
        }
    }


// BaseModel
class BaseModel extends Model {
    static _initialized = false;
    static _initPromise = null;

    static async _initializeModel() {
        if (this._initialized) return;
        if (this._initPromise) return this._initPromise;

        this._initPromise = (async () => {
            try {
                const sequelize = Database.getSequelize();
                await sequelize.authenticate();

                if (this.fields) {
                    const tableName = this.name.toLowerCase() + 's';

                    const defineAttributes = {
                        id: Fields.IntegerField({ autoIncrement: true, primaryKey: true }),
                        ...this.fields
                    };

                    super.init(defineAttributes, {
                        sequelize,
                        tableName,
                        modelName: this.name
                    });

                    await this.sync({ alter: true });
                    this._initialized = true;
                    console.log(`Model ${this.name} initialized and synced successfully`);
                }
            } catch (error) {
                console.error(`Error initializing model ${this.name}:`, error);
                throw error;
            }
        })();

        return this._initPromise;
    }

    static async create(values, options) {
        await this._initializeModel();
        return super.create(values, options);
    }

    static {
        const originalExtends = Object.getPrototypeOf(this);
        if (originalExtends !== Model) {
            this._initializeModel().catch(error => {
                console.error(`Failed to initialize model ${this.name}:`, error);
            });
        }
    }
}

export { sequelize, DataTypes, BaseModel, DatabaseConfig, Database };
