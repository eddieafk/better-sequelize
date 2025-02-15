class Serializer {
    constructor(model, fields) {
        this.model = model;
        this.fields = fields;
    }

    // 📌 Modeli JSON formatına çevirme
    serialize(instance) {
        let data = {};
        this.fields.forEach(field => {
            if (instance[field] !== undefined) {
                data[field] = instance[field];
            }
        });
        return data;
    }

    // 📌 Gelen veriyi doğrulama ve deserialization
    async deserialize(data) {
        let validatedData = {};

        for (const field of this.fields) {
            if (data[field] === undefined) {
                throw new Error(`${field} alanı gereklidir.`);
            }
            validatedData[field] = data[field];
        }

        return validatedData;
    }

    // 📌 Yeni bir kullanıcı oluştur
    async create(data) {
        const validatedData = await this.deserialize(data);
        return await this.model.create(validatedData);
    }

    async destroy(id) {
        if (!id) {
            throw new Error('ID alanı gereklidir.');
        }
        
        const instance = await this.model.findByPk(id);
        if (!instance) {
            throw new Error('Kayıt bulunamadı.');
        }

        await instance.destroy();
        return true;
    }
}

export default Serializer;
