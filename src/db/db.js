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


// Django Model yapısına benzer bir BaseModel sınıfı
class BaseModel extends Model {
    static init(attributes, options = {}) {
        const sequelize = Database.getSequelize();
        
        if (!options.sequelize) {
            options.sequelize = sequelize;
        }

        const defineAttributes = {
            id: Fields.IntegerField({ autoIncrement: true, primaryKey: true }),
            ...attributes 
        };

        return super.init(defineAttributes, options);
    }

    static async syncModel() {
        await this.sync({ alter: true });
    }
}

export { sequelize, DataTypes, BaseModel, DatabaseConfig, Database };
