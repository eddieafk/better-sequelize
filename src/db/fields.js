import { DataTypes } from 'sequelize'
class Fields {
  static IntegerField({ autoIncrement = false, primaryKey = false } = {}) {
        return {
            type: DataTypes.INTEGER,
            autoIncrement,
            primaryKey
        };
    }
    
    static StringField({ allowNull = true, unique = false } = {}) {
        return {
            type: DataTypes.STRING,
            allowNull,
            unique
        };
    }
    
    static Boolean({ allowNull = true, defaultValue = false } = {}) {
        return {
            type: DataTypes.BOOLEAN,
            allowNull,
            defaultValue
        };
    }
    
    static EmailField({ allowNull = false, unique = true } = {}) {
        return {
            type: DataTypes.STRING,
            allowNull,
            unique,
            validate: {
                isEmail: true
            }
        };
    }

    static ForeignKeyField({ model, key = 'id', type = 'INTEGER', allowNull = true, onDelete, onUpdate }, targetModel) {
        if (!model) {
            throw new Error('ForeignKeyField requires a valid `model` reference.');
        }

        const validTypes = {
            INTEGER: DataTypes.INTEGER,
            STRING: DataTypes.STRING
        };

        if (!validTypes[type]) {
            throw new Error(`Invalid ForeignKey type: '${type}'. Supported types: ${Object.keys(validTypes).join(', ')}`);
        }

        const validActions = ['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION'];

        if (!validActions.includes(onDelete)) {
            throw new Error(`Invalid onDelete value: '${onDelete}'. Use one of: ${validActions.join(', ')}`);
        }

        if(!onDelete) {
            throw new Error("You must state what will hapen in case of 'onDelete' !")
        }

        if(!onUpdate) {
            throw new Error("You must state what will happen in case of 'onUpdate' !")
        }
     
        if (!validActions.includes(onUpdate)) {
            throw new Error(`Invalid onUpdate value: '${onUpdate}'. Use one of: ${validActions.join(', ')}`);
        }

        // Foreign Key alanını oluştur
        const fieldDefinition = {
            type: validTypes[type],
            allowNull,
            references: {
                model,
                key
            },
            onDelete,
            onUpdate
        };

        // Eğer hedef model tanımlanmışsa otomatik olarak belongsTo ilişkisini ekle
        if (targetModel) {
            targetModel.belongsTo(model, { foreignKey: key });
        }

        return fieldDefinition;
    }


    static EnumField({ values, allowNull = true, defaultValue } = {}) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('EnumField requires a non-empty array of values.');
        }
    
        return {
            type: DataTypes.ENUM,
            values,
            allowNull,
            defaultValue
        };
    }


    static DateField({ allowNull = true, defaultValue = null, autoNow = false, autoNowAdd = false } = {}) {
        let finalDefaultValue = defaultValue;
        
        if (autoNowAdd) {
            // Only set on creation
            finalDefaultValue = DataTypes.NOW;
        }
        
        return {
            type: DataTypes.DATE,
            allowNull,
            defaultValue: finalDefaultValue,
            ...( autoNow && { 
                // Always update timestamp on save
                set() {
                    this.setDataValue('updatedAt', new Date());
                }
            })
        };
    }

}
export default Fields