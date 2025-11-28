import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

class UserModel extends Model {
  id!: number;
  name!: string;
  email!: string;
  cpf!: string;
  password!: string;
  profileImage!: string | null; // <--- NOVO CAMPO
  updatedBy!: number | null;
  role!: "admin" | "patient";

  public async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [11, 11],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // ADICIONE ESTE BLOCO DO profileImage
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("admin", "patient"),
      allowNull: false,
      defaultValue: "patient",
    },
  },

  {
    sequelize,
    modelName: "UserModel",
    tableName: "users",
  }
);

UserModel.beforeCreate(async (user: UserModel) => {
  await user.hashPassword();
});

UserModel.beforeUpdate(async (user: UserModel) => {
  if (user.changed("password")) {
    await user.hashPassword();
  }
});

export default UserModel;
