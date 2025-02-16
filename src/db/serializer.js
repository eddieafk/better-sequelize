class Serializer {
    constructor(modelClass) {
        this.modelClass = modelClass;
        // Get fields automatically
        this.fields = Object.keys(modelClass.fields || {});
        // Add ID field automatically
        if (!this.fields.includes('id')) {
            this.fields.unshift('id');
        }
    }

    // Form Model to JSON.
    serialize(instance) {
        if (!instance) return null;
        
        let data = {};
        this.fields.forEach(field => {
            if (instance[field] !== undefined) {
                data[field] = instance[field];
            }
        });
        return data;
    }

    // Serialize more than one instance.
    serializeMany(instances) {
        return instances.map(instance => this.serialize(instance));
    }

    // Deserialization
    async deserialize(data) {
        let validatedData = {};
        const modelFields = this.modelClass.fields || {};

        for (const [fieldName, fieldDef] of Object.entries(modelFields)) {
            if (!fieldDef.allowNull && data[fieldName] === undefined) {
                throw new Error(`${fieldName} field is required.`);
            }
            if (data[fieldName] !== undefined) {
                validatedData[fieldName] = data[fieldName];
            }
        }

        return validatedData;
    }

    // Register a register
    async create(data) {
        await this.modelClass._initializeModel();
        const validatedData = await this.deserialize(data);
        const instance = await this.modelClass.create(validatedData);
        return this.serialize(instance);
    }

    // Updating a register
    async update(id, data) {
        await this.modelClass._initializeModel();
        const instance = await this.modelClass.findByPk(id);
        if (!instance) {
            throw new Error('Record not found');
        }

        const validatedData = await this.deserialize({...instance.toJSON(), ...data});
        await instance.update(validatedData);
        return this.serialize(instance);
    }

    // Unregistering
    async destroy(id) {
        await this.modelClass._initializeModel();
        const instance = await this.modelClass.findByPk(id);
        if (!instance) {
            throw new Error('Record not found');
        }

        await instance.destroy();
        return true;
    }

    // Get only one -the chosen- register.
    async retrieve(id) {
        await this.modelClass._initializeModel();
        const instance = await this.modelClass.findByPk(id);
        return this.serialize(instance);
    }

    // Get all of the registers
    async list(options = {}) {
        await this.modelClass._initializeModel();
        const instances = await this.modelClass.findAll(options);
        return this.serializeMany(instances);
    }
}

export default Serializer;