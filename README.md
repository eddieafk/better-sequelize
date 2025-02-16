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

<<<<<<< HEAD
    class User extends BaseModel {
        static fields = {
            username: Fields.StringField({ allowNull: false }),
            email: Fields.EmailField(),
            isActive: Fields.Boolean({ defaultValue: true })
        }
=======
class User extends BaseModel {
    static fields = {
        username: Fields.StringField({ unique: true }),
        email: Fields.EmailField(),
        password: Fields.StringField(),
        isActive: Fields.Boolean({ defaultValue: true }),
>>>>>>> bd184eb9689c61992bd2583c7b9277961adb0826
    }

    // Create serializer
    const userSerializer = new Serializer(User);

<<<<<<< HEAD
try {
const user = await userSerializer.create({
    username: "testasas",
    email: "test@tesasast.com"
});
    console.log("User created:", user);
} catch (error) {
    console.error("Error:", error);
 }
}

main().catch(console.error);
```
=======
```
>>>>>>> bd184eb9689c61992bd2583c7b9277961adb0826
