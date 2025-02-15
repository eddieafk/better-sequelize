# Better Sequelize

A wrapper around Sequelize ORM that provides an enhanced model interface with simplified field definitions and configurations.

## Installation and Set

```bash
npm install better-sequelize
```

# Quick Start
```js
import { BaseModel, Database, Fields, Serializer } from 'better-sequelize';

Database.initialize({
    dialect: 'sqlite',
    storage: './db.sqlite'
})

class User extends BaseModel {
    static fields = {
        username: Fields.StringField({ unique: true }),
        email: Fields.EmailField(),
        password: Fields.StringField(),
        isActive: Fields.Boolean({ defaultValue: true }),
    }
}
User.init(User.fields, {
    sequelize: Database.getSequelize(),
    tableName: 'users'
})
await User.syncModel();

class UserSerializer extends Serializer {
    constructor() {
        super(User, ['username', 'email', 'password']);
    }
}
const userSerializer = new UserSerializer()
userSerializer.create({ username: "MyNameIsEddie", email: "example@example.com", "password": "HiThere" })

```
