# Better Sequelize

A wrapper around Sequelize ORM that provides an enhanced model interface with simplified field definitions and configurations.

## Installation and Set

```bash
npm install better-sequelize
```

# Quick Start
```js
import { BaseModel, Fields, Database, Serializer } from 'better-sequelize'

async function main() {
    await Database.initialize({
        dialect: "sqlite",
        storage: "./db.sqlite"
    });

class User extends BaseModel {
    static fields = {
        username: Fields.StringField({ allowNull: false }),
        email: Fields.EmailField(),
        isActive: Fields.Boolean({ defaultValue: true })
}

    // Create serializer
const userSerializer = new Serializer(User);

try {
const user = await userSerializer.create({
    username: "test",
    email: "test@test.com"
});
    console.log("User created:", user);
} catch (error) {
    console.error("Error:", error);
 }
}

main().catch(console.error);
```

